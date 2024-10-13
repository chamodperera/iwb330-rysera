import ballerina/http;
import ballerina/jwt;
import ballerina/log;

public isolated class firebaseService {
    final string key;
    final string firebaseProjectId;
    final http:Client firebaseClient;

    public function init(string key,string firebaseProjectId) returns error? {
        self.key = key;
        self.firebaseProjectId = firebaseProjectId;
        // Create a new HTTP client to communicate with the Firebase API
        do {
	        self.firebaseClient = check new("https://identitytoolkit.googleapis.com");
        } on fail error e{
            // Handle the error
            return e;
        }
    }

    public isolated function googleLogin(string access_token) returns json|error {
        // Correct payload with access_token
        string postBody = "access_token=" + access_token + "&providerId=google.com";
        
        json payload = {
            postBody: postBody,
            requestUri: "http://localhost",
            returnSecureToken: true
        };

        // Send the request with the correct headers and payload
        http:Response response = check self.firebaseClient->post("/v1/accounts:signInWithIdp?key=" + self.key, 
            payload.toJsonString(),
            {"Content-Type": "application/json"});

        // Get the JSON payload from the response
        json|error result = check response.getJsonPayload();
        return result;
    }

    public isolated function validateJwtToken(string jwtToken) returns json|error {
        // Configure the JWT validator with Firebase's public keys (JWKS URL)
        jwt:ValidatorConfig validatorConfig = {
            issuer: "https://securetoken.google.com/" + self.firebaseProjectId,  
            audience: self.firebaseProjectId, 
            clockSkew: 60,  // Allowable clock skew in seconds
            signatureConfig: {
                certFile: "resources/firebase_public.cert"
            }
        };

        // Validate the JWT token using the provided validatorConfig
        do{
            jwt:Payload validatedPayload = check jwt:validate(jwtToken, validatorConfig);
            return <json>validatedPayload;
        } on fail error e {
            log:printError("Error validating JWT token: " + e.toString());
            return e;
        }
    }
}
