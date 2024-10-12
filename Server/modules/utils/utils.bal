import ballerina/log;
import ballerina/uuid;

// Function to generate a secure random API key.
// Function to generate a new API key using UUID.
public function generateApiKey() returns string {
    // Generate a new UUID as the API key
    string apiKey = uuid:createType4AsString();
    log:printInfo("Generated API Key: " + apiKey);
    return apiKey;
}
