import ballerina/http;
import ballerina/log;
// import Server.utils;

// Define the list of valid API keys
configurable string[] validApiKeys = ?;

// Define the request interceptor class
service class RequestInterceptor {
    *http:RequestInterceptor;

    // Interceptor resource to handle API key validation
    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            @http:Header {name: "x-api-key"} string apiKey)
        returns http:Unauthorized|http:NextService|error? {
        // Authenticate the API key
        log:printInfo("Authenticating API Key: " + apiKey);

        // Check if the API key is in the list of valid API keys
        foreach string validKey in validApiKeys {
            if apiKey == validKey {
                log:printInfo("Authentication successful for key: " + apiKey);

                // If authentication is successful, proceed to the next service/resource
                return ctx.next();
            }
        }

        return <http:Unauthorized>{
            body: "Invalid API Key"
        };
        
    }
}

service http:InterceptableService / on new http:Listener(9090) {
    public function createInterceptors() returns RequestInterceptor {
        return new RequestInterceptor();
    }

    // Define a simple GET resource to return a greeting
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}

// public function main() {
//     string apiKey = utils:generateApiKey();
//     log:printInfo("Generated API Key: " + apiKey);
// }

