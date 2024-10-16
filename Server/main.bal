import ballerina/http;
import ballerina/log;
import ballerinax/googleapis.drive;
// import Server.firebase_provider;
import Server.estimator;
import ballerina/mime;
import Server.google_drive;

// Define the list of valid API keys
configurable string[] validApiKeys = ?;

// configurable string firebaseWebApiKey = ?;
// configurable string firebaseProjectId = ?;


//define the firebase service
// final firebase_provider:firebaseService firebaseService = check new(firebaseWebApiKey, firebaseProjectId);

// Define the request interceptor class
service class RequestInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            @http:Header {name: "Authorization"} string|() jwtToken,
            @http:Header {name: "x-api-key"} string apiKey)
        returns http:Unauthorized|http:NextService|error? {
        
        // string reqPath = from string p in path select "/"+p;


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
            return <http:Unauthorized> {
                body: "Invalid API Key"
            };
        }

        //check jwt token
        // if reqPath != "/googleLogin" {
        //     if jwtToken is string {
        //         json|error result = firebaseService.validateJwtToken(jwtToken);
        //         if result is json {
        //             log:printInfo("JWT Token is valid");
        //             ctx.set("jwtClaims", result);
        //         } else {
        //             return <http:Unauthorized> {
        //                 body: "Invalid JWT Token"
        //             };
        //         }
        //     } else {
        //         return <http:Unauthorized> {
        //             body: "JWT Token not found"
        //         };
        //     }
        // }

        // Call the next service in the pipeline
        return ctx.next();
    }
}

// service http:InterceptableService / on new http:Listener(9090) {

//     // Define a simple GET resource to return a greeting
//     resource function get greeting(http:RequestContext ctx) returns string {
//         return "Hello, World!";
//     }

//     resource function post googleLogin(@http:Payload json jsonObj) returns json|error {
//         string accessToken = "";
//         var accessTokenValue = jsonObj.access_token;
//         if accessTokenValue is string {
//             accessToken = accessTokenValue;
//         } else {
//             return "Invalid access token";
//         }
//         json|error result = firebaseService.googleLogin(accessToken.toString());
//         return result;
//     }
// }

configurable string estimatorApiKey = ?;
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
final estimator:estimatorService estimator = check new(estimatorApiKey);
final google_drive:driverService googleDriveService = check new(refreshToken, clientId, clientSecret);


service http:InterceptableService / on new http:Listener(9090) {
    public function createInterceptors() returns RequestInterceptor {
        return new RequestInterceptor();
    }

    resource function post estimate(http:Request request) returns json|error {
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

                // estimate the price from the file
                if uploadedFileResult is drive:File{
                    string fileID = uploadedFileResult.id.toString();
                    string url = string `https://drive.usercontent.google.com/download?id=${fileID}&confirm=xxx`;
                    json|error result = estimator.estimate(url);
                    if result is json {
                        float price = check result.data.price;
                        float lkrPrice = price * 300;
                        float finalPrice = (lkrPrice < 2000.0) 
                            ? 24124 - 53.5 * lkrPrice + 0.0386 * lkrPrice * lkrPrice - 8.82e-6 * lkrPrice * lkrPrice * lkrPrice
                            : 12151 - 10.6 * lkrPrice + 3.29e-3 * lkrPrice * lkrPrice - 2.88e-7 * lkrPrice * lkrPrice * lkrPrice;
                        json response = {
                            "price": finalPrice.round(2)
                        };
                        return response;
                    } else {
                        return error("Estimation failed: " + result.toString());
                    }
                }
            }
        }
        
        return error("No file found in the request");
    }
}