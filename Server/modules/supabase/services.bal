import ballerina/http;
// import ballerina/jwt;
// import ballerina/log;

public isolated class SupabaseService {
    final string supabaseRef;
    final string supabaseSecret;
    final http:Client supabaseClient;
    final http:Client googleClient;

    public function init(string supabaseRef, string supabaseSecret) returns error? {
        self.supabaseRef = supabaseRef;
        self.supabaseSecret = supabaseSecret;

        // Create a new HTTP client to communicate with the Firebase API
        self.supabaseClient = check new("https://api.supabase.com/v1/projects/" + supabaseRef);

        // Create a client for Google OAuth validation
        self.googleClient = check new("https://oauth2.googleapis.com");
    }

    public isolated function validateGoogleAccessToken(string access_token) returns json|http:Unauthorized|error {
        // Validate the access token with Google's OAuth2 tokeninfo endpoint
        string validationUrl = "/tokeninfo?access_token=" + access_token;

        http:Response|error response = self.googleClient->get(validationUrl);
        if (response is http:Response) {
            json|error result = response.getJsonPayload();
            if (result is json) {
                // If validation is successful, return the token info
                // log:printInfo("Access token validated: " + result.toString());
                return result;
            } else {
                // log:printError("Failed to parse Google token validation response.");
                return <http:Unauthorized>{
                    body : "Failed to parse Google token validation response."
                };
            }
        } else {
            // If the token is invalid or expired, return an error
            // log:printError("Google access token validation failed.");
            return <http:Unauthorized>{
                    body : "Invalid Access Token"
                };
        }
    }

    public isolated function googleLogin(string access_token) returns json|http:Unauthorized|error{
        // if(true){
            // Prepare the request payload for Google OAuth login
            // json payload = {
            //     "email": "test@gmail.com",
            //     "password": "test@123"
            // };

            // Send the request to Supabase's OAuth endpoint to sign in with Google
            http:Response response = check self.supabaseClient->get("/config/auth/third-party-auth",
                {
                    "Authorization": "Bearer " + self.supabaseSecret,
                    "Content-Type": "application/json"
                });

            // Get the JSON payload from the response
            json|error result = check response.getJsonPayload();
            return result;
        // } else {
        //     return self.validateGoogleAccessToken(access_token);
        // }
    }


}
