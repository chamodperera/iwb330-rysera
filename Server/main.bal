import ballerina/http;
import ballerina/auth;
import Server.auth_provider;

string[] validKeys = ["your_valid_api_key_1", "your_valid_api_key_2"];
string[] scopes = ["read", "write"];
auth_provider:ApiKeyAuthProvider apiKeyAuthProvider =  new(validKeys,scopes);

@http:ServiceConfig{
    auth: [
        
    ]
}

service /secure on new http:Listener(9090) {

    // This function responds with `string` value `Hello, World!` to HTTP GET requests.
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
