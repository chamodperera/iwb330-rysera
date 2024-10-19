import Server.estimator;
import Server.google_drive;
import Server.volume_calculator;
import ballerina/mime;
import ballerinax/googleapis.drive;
import ballerina/http;
import ballerina/log;
import Server.db;
import Server.utils;
import Server.quotation_generator;
import Server.google_sheets;
import ballerina/io;

// Define the list of valid API keys
type Vector [float, float, float];
public type Product record {
    string name;
    int quantity;
    decimal rate;
};

public type orderData record {|
    string customerName;
    string customerEmail;
    string[] fileNames;
    string[] fileURLs;
    int[] quantities;
    decimal[] prices;    
|};

configurable string[] validApiKeys = ?; //valid api keys
configurable string mongoDBConnectionString = ?; //mongodb connection string
configurable string estimatorApiKey = ?;
configurable string OAuthRefreshToken = ?;
configurable string OAuthClientId = ?;
configurable string OAuthClientSecret = ?;
configurable string ZohoclientID = ?;
configurable string ZohoclientSecret = ?;
configurable string ZohorefreshToken = ?;
configurable string ZohoorganizationId = ?;

//define mongoDB database
final db:Database db = check new(mongoDBConnectionString);
final estimator:estimatorService estimator = check new (estimatorApiKey);
final google_drive:driverService googleDriveService = check new (OAuthRefreshToken, OAuthClientId, OAuthClientSecret);
final volume_calculator:VolumeCalculator volume_calculator = new ();
final utils:googleService googleService = check new();
final quotation_generator:ZohoQuotationService quotation_generator = check new(ZohoclientID, ZohoclientSecret, ZohorefreshToken, ZohoorganizationId);
final google_sheets:sheetsService sheetsService = check new(OAuthRefreshToken, OAuthClientId, OAuthClientSecret);

http:CorsConfig corsConfig = {
    allowOrigins: ["http://localhost:5173"],
    allowCredentials: true,
    allowHeaders: [ "X-Api-Key", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    maxAge: 3600
};
// Define the request interceptor class
service class RequestInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            http:Request req,
            @http:Header {name: "X-Api-Key"} string|() apiKey)
        returns http:Unauthorized|http:NextService|error? {
        
        if req.method == http:OPTIONS {
            return ctx.next();
        }

        // Check if API key exists
        if apiKey is () {
            return <http:Unauthorized>{
                body: "Missing API Key"
            };
        }

        // Check if API key is valid
        boolean isValidKey = false;
        foreach string validKey in validApiKeys {
            if apiKey == validKey {
                log:printInfo("Authentication successful for key: " + apiKey);
                isValidKey = true;
                break;
            }
        }
        if !isValidKey {
            return <http:Unauthorized>{
                body: "Invalid API Key"
            };
        }

        return ctx.next();
    }
}

@http:ServiceConfig {
    cors: corsConfig
}

service http:InterceptableService / on new http:Listener(9090) {
    
    public function createInterceptors() returns RequestInterceptor {
        return new RequestInterceptor();
    }

    // Define a simple GET resource to return a greeting
    resource function get greeting(http:RequestContext ctx) returns string {
        return "Hello, World!";
    }

    resource function get getUser(@http:Query string jwt) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);
        if result is json {
           //check if user exists in the database
           db:User|() user = check db.getUser(check result.sub);
              if (user is db:User) {
                return user;
              }else{
                return ();
              }
        } else {
            return result;
        }
    }


    resource function post registerUser(@http:Query string jwt,db:UserData userData) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);

        if result is json {
            db:User user = {
                uid: check result.sub,
                email: check result.email,
                name: userData.name,
                avatar: check result.picture,
                organization: userData.organization,
                contact: userData.contact
            };

            //add user to the database
            check  db.addUsers(user);
            return user;
        } else {
            return result;
        }
    }

    resource function post upload(http:Request request) returns json|error {
        log:printInfo("File upload request received");
        // Extract the file from multipart request
        mime:Entity[] bodyParts = check request.getBodyParts();
        foreach var part in bodyParts {
            if part.getContentDisposition().name == "file" {
                // Get file details
                string fileName = part.getContentDisposition().fileName;
                if fileName == "" {
                    fileName = "uploaded-file";
                }
                byte[] fileContent = check part.getByteArray();

                // Upload the file to Google Drive
                drive:File|error uploadedFileResult = googleDriveService.uploadFile(fileContent, fileName, "1-DDCsqJJRTkBOvzDvTX-qHhYOI-Bpf6n");

                // Calculate the volume of the file
                float|error volume = volume_calculator.parseSTL(fileContent);

                if uploadedFileResult is drive:File {
                    log:printInfo("File uploaded successfully: " + uploadedFileResult.toString());
                    if volume is float {
                        log:printInfo("Volume calculated successfully: " + volume.toString());
                        string fileID = uploadedFileResult.id.toString();
                        string url = string `https://drive.usercontent.google.com/download?id=${fileID}&confirm=xxx`;
                        json response = {
                            "url": url,
                            "volume": volume
                        };
                        return response;
                    } else {
                        return error("Volume calculation failed: " + volume.toString());
                    }
                } else {
                    return error("File upload failed: " + uploadedFileResult.toString());
                }

            }
        }

        return error("No file found in the request");
    }

    resource function post setOrders(@http:Query string jwt,db:Order[] newOrders) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);

        if result is json {
            //add user to the database
            check  db.addOrders(newOrders);
            return "order added successfully";
        } else {
            return result;
        }
    }

    resource function get getOrders(@http:Query string jwt) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);
        if result is json {
            db:Order[]|error? orders = db.getOrders(check result.sub);
            if orders is db:Order[] {
                return orders;
            } else {
                return error("Failed to retrieve orders");
            }
        } else {
            return error("Failed to retrieve orders");
        }
    }

    resource function post estimate(@http:Payload json jsonObj) returns json|error {
        string url = check jsonObj.url;
        float weight = check jsonObj.weight;
        json|error result = estimator.estimate(url);

        if result is json {
            float price = check result.data.price;
            float lkrPrice = price * 300;
            float finalPrice = (lkrPrice < 2000.0)
                ? 24124 - 53.5 * lkrPrice + 0.0386 * lkrPrice * lkrPrice - 8.82e-6 * lkrPrice * lkrPrice * lkrPrice
                : 12151 - 10.6 * lkrPrice + 3.29e-3 * lkrPrice * lkrPrice - 2.88e-7 * lkrPrice * lkrPrice * lkrPrice;
            int printingCost = <int>(finalPrice / 3.5- 6 * weight);
            if (printingCost < 0) {
                weight = weight/1.5;
            } 
            int totalminutes = <int>((finalPrice / 3.5 - 6 * weight) / 0.69);
            string time = string `${totalminutes / 60} hr ${totalminutes % 60} m`;
            json response = {
                "price": finalPrice.round(2),
                "time": time
            };
            return response;
        } else {
            return error("Estimation failed: " + result.toString());
        }
    }

    resource function post quote(@http:Payload json payload) returns json|error {
        // Convert the payload to a map<json> for easier key checking
        map<json> jsonObj = check payload.ensureType();

    // Validate the presence of required fields
    if !jsonObj.hasKey("customer") {
        return error("Missing 'customer' field in request payload");
    }
    if !jsonObj.hasKey("email") {
        return error("Missing 'email' field in request payload");
    }
    if !jsonObj.hasKey("products") {
        return error("Missing 'products' field in request payload");
    }

    // Parse the request payload
    string customer = check jsonObj.get("customer").ensureType();
    string email = check jsonObj.get("email").ensureType();
    json[] productsJson = check jsonObj.get("products").ensureType();

        Product[] products = [];
        foreach json productJson in productsJson {
            map<json> product = check productJson.ensureType();
            
            string name = check product.get("name").ensureType();
            if name == "" {
                return error("Invalid product name");
            }
            
            int quantity = check product.get("quantity").ensureType();
            if quantity < 0 {
                return error("Invalid product quantity");
            }
            
            decimal rate = check product.get("rate").ensureType();
            if rate < 0.0d {
                return error("Invalid product rate");
            }
            
            products.push({name, quantity, rate});
        }

    // Call the createQuotation function
    json|error quotation = check quotation_generator.createQuotation(email,customer, products);

    if quotation is json {
        return quotation;
    } else {
        return error("Quotation generation failed: " + quotation.toString());
    }

    // upload the quotation to google drive
    // if quotation is byte[] {
    //     drive:File|error uploadedFileResult = googleDriveService.uploadFile(quotation, string `${customer}.pdf`, "1wKktZ0kuX4vF5yBa56eUvfqGMxqQ4nzS");
    //     if uploadedFileResult is drive:File {
    //         string fileID = uploadedFileResult.id.toString();
    //         string url = string `https://drive.usercontent.google.com/download?id=${fileID}&confirm=xxx`;
    //         json response = {
    //             "url": url
    //         };
    //         return response;
    //     } else {
    //         return error("Quotation upload failed: " + uploadedFileResult.toString());
    //     }
    // } else {
    //     return error("Quotation generation failed: " + quotation.toString());
    // }
}

resource function post sendToSheet(http:Caller caller, http:Request req) returns error? {
        // Convert the payload to a map<json> for easier key checking
        map<json> jsonObj = check req.getJsonPayload().ensureType();

        // Validate the presence of required fields
        if !jsonObj.hasKey("customer") {
            check caller->respond("Missing 'customer' field in request payload");
            return;
        }
        if !jsonObj.hasKey("email") {
            check caller->respond("Missing 'email' field in request payload");
            return;
        }
        if !jsonObj.hasKey("products") {
            check caller->respond("Missing 'products' field in request payload");
            return;
        }

        // Parse the request payload
        string customer = check jsonObj.get("customer").ensureType();
        string email = check jsonObj.get("email").ensureType();
        json[] productsJson = check jsonObj.get("products").ensureType();

        string[] fileNames = [];
        string[] fileURLs = [];
        int[] quantities = [];
        decimal[] prices = [];
        foreach json productJson in productsJson {
            map<json> product = check productJson.ensureType();
            
            string name = check product.get("name").ensureType();
            if name == "" {
                check caller->respond("Invalid product name");
                return;
            }

            string url = check product.get("url").ensureType();
            if url == "" {
                check caller->respond("Invalid product url");
                return;
            }
            
            int quantity = check product.get("quantity").ensureType();
            if quantity < 0 {
                check caller->respond("Invalid product quantity");
                return;
            }
            
            decimal rate = check product.get("rate").ensureType();
            if rate < 0.0d {
                check caller->respond("Invalid product rate");
                return;
            }

            fileNames.push(name);
            quantities.push(quantity);
            prices.push(rate);
            fileURLs.push(url);
        }
            orderData orderData = {
                customerName: customer,
                customerEmail: email,
                fileNames: fileNames,
                fileURLs: fileURLs,
                prices: prices,
                quantities: quantities
            };

            error? addOrderResult = sheetsService.addOrder("1is2fVRLwfFtmg6Dna-5NFqynw6vhtBAwti53g_qeIdM", "Orders", orderData);

            if addOrderResult is error {
                check caller->respond("Failed to add order: " + addOrderResult.toString());
                return;
            }
            else {
                io:println("Order added successfully");
                return;
            }
    }
}
