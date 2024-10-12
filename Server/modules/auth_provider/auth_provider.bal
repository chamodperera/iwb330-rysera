import ballerina/log;
import ballerina/auth;
import ballerina/regex;
import ballerina/uuid;

// Structure to represent user details after successful authentication.
public type UserDetails record {
    string user;
    string[]? scopes;
};

// Custom API key-based authentication provider.
public class ApiKeyAuthProvider {
    string[] validApiKeys;
    string[] scopes;

    // Constructor to initialize the provider with valid API keys and scopes.
    public function init(string[] validApiKeys, string[] scopes) {
        self.validApiKeys = validApiKeys;
        self.scopes = scopes;
    }

    // Authenticate function that validates the API key.
    public isolated function authenticate(string credential) returns UserDetails|auth:Error {
        log:printInfo("Authenticating API Key: " + credential);

        // Remove "Bearer " from the credential if it exists
        string apiKey = regex:replace(credential,"Bearer ", "").trim();

        // Check if the API key is in the list of valid API keys
        foreach string validKey in self.validApiKeys {
            if apiKey == validKey {
                log:printInfo("Authentication successful for key: " + apiKey);
                return {user: "api_client", scopes: self.scopes};
            }
        }

        return error("Invalid API key");
    }
}

// Function to generate a secure random API key.
// Function to generate a new API key using UUID.
public function generateApiKey() returns string {
    // Generate a new UUID as the API key
    string apiKey = uuid:createType4AsString();
    log:printInfo("Generated API Key: " + apiKey);
    return apiKey;
}
