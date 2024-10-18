import ballerina/log;
import ballerina/http;
import ballerina/uuid;
// import ballerina/time;

// Function to generate a secure random API key.
// Function to generate a new API key using UUID.
public function generateApiKey() returns string {
    // Generate a new UUID as the API key
    string apiKey = uuid:createType4AsString();
    log:printInfo("Generated API Key: " + apiKey);
    return apiKey;
}

public isolated class googleService {
    final http:Client googleClient;
    public isolated function init() returns error? {
        // Create a client for Google OAuth validation
        self.googleClient = check new("https://oauth2.googleapis.com");
    }
    public isolated function decodeGoogleJWT(string id_token) returns json|http:Unauthorized|error {
            // Validate the access token with Google's OAuth2 tokeninfo endpoint
            string validationUrl = "/tokeninfo?id_token=" + id_token;

            http:Response|error response = self.googleClient->get(validationUrl);
            if (response is http:Response) {
                json|error result = response.getJsonPayload();
                if (result is json) {
                    //validate the token
                    if(result.iss == "https://accounts.google.com" && result.email_verified == "true"){
                        return result;
                    } else {
                        return <http:Unauthorized>{
                            body : "Invalid ID Token"
                        };
                    }
                } else {
                    // log:printError("Failed to parse Google token validation response.");
                    return <http:Unauthorized>{
                        body : "Failed to parse Google token validation response."
                    };
                }
            } else {
                return <http:Unauthorized>{
                        body : "Failed to validate Google ID Token"
                    };
            }
        }
}
