import Server.estimator;
import Server.google_drive;
import Server.volume_calculator;

import ballerina/http;
import ballerina/log;
import ballerina/mime;
import ballerinax/googleapis.drive;

// Define the list of valid API keys
type Vector [float, float, float];

configurable string[] validApiKeys = ?;

// CORS configuration
http:CorsConfig corsConfig = {
    allowOrigins: ["http://localhost:5173"], // In production, replace with specific origins
    allowCredentials: true,
    allowHeaders: ["x-api-key","Content-Type"],
    allowMethods: ["POST","OPTIONS"],
    maxAge: 3600
    };

service class RequestInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            http:Request req,
            @http:Header {name: "x-api-key"} string|() apiKey)
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

configurable string estimatorApiKey = ?;
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
final estimator:estimatorService estimator = check new (estimatorApiKey);
final google_drive:driverService googleDriveService = check new (refreshToken, clientId, clientSecret);
final volume_calculator:VolumeCalculator volume_calculator = new ();

@http:ServiceConfig {
    cors: corsConfig
}

service http:InterceptableService / on new http:Listener(9090) {
    public function createInterceptors() returns RequestInterceptor[] {
        return [new RequestInterceptor()];
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
}
