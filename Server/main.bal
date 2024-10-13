import ballerina/http;
import ballerina/log;
import Server.firebase_provider;

// Define the list of valid API keys
configurable string[] validApiKeys = ?;

configurable string firebaseWebApiKey = ?;
configurable string firebaseProjectId = ?;

//define the firebase service
final firebase_provider:firebaseService firebaseService = check new(firebaseWebApiKey, firebaseProjectId);

// Define the request interceptor class
service class RequestInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            @http:Header {name: "Authorization"} string|() jwtToken,
            @http:Header {name: "x-api-key"} string apiKey)
        returns http:Unauthorized|http:NextService|error? {
        
        string reqPath = from string p in path select "/"+p;


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
        if reqPath != "/googleLogin" {
            if jwtToken is string {
                json|error result = firebaseService.validateJwtToken(jwtToken);
                if result is json {
                    log:printInfo("JWT Token is valid");
                    ctx.set("jwtClaims", result);
                } else {
                    return <http:Unauthorized> {
                        body: "Invalid JWT Token"
                    };
                }
            } else {
                return <http:Unauthorized> {
                    body: "JWT Token not found"
                };
            }
        }

        // Call the next service in the pipeline
        return ctx.next();
    }
}
    
service http:InterceptableService / on new http:Listener(9090) {
    public function createInterceptors() returns RequestInterceptor {
        return new RequestInterceptor();
    }

    // Define a simple GET resource to return a greeting
    resource function get greeting(http:RequestContext ctx) returns string {
        return "Hello, World!";
    }

    resource function post googleLogin(@http:Payload json jsonObj) returns json|error {
        string accessToken = "";
        var accessTokenValue = jsonObj.access_token;
        if accessTokenValue is string {
            accessToken = accessTokenValue;
        } else {
            return "Invalid access token";
        }
        json|error result = firebaseService.googleLogin(accessToken.toString());
        return result;
    }


}

// public function main() {
//     string apiKey = utils:generateApiKey();
//     log:printInfo("Generated API Key: " + apiKey);
// }

