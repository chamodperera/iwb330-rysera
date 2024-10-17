import ballerina/http;
import ballerina/log;
// import ballerina/jwt;
// import Server.supabase;
import Server.db;
import Server.utils;

configurable string[] validApiKeys = ?; //valid api keys
configurable string mongoDBConnectionString = ?; //mongodb connection string

//define mongoDB database
final db:Database db = check new(mongoDBConnectionString);
final utils:googleService googleService = check new();

http:CorsConfig corsConfig = {
    allowOrigins: ["http://localhost:5173"],
    allowCredentials: true,
    allowHeaders: [ "X-Api-Key", "Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    maxAge: 3600
};
// Define the request interceptor class
service class RequestInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](
            http:RequestContext ctx,
            http:Request req,
            @http:Header {name: "X-Api-Key"} string|() apiKey)
        returns http:Unauthorized|http:NextService|error? {
        
        // string reqPath = from string p in path select "/"+p;
        if req.method == http:OPTIONS {
            return ctx.next();
        }

        // Check if API key is valid
        boolean isValidKey = false;
        foreach string validKey in validApiKeys {
            if apiKey == validKey {
                log:printInfo("Authentication successful for key: " + <string>apiKey);
                isValidKey = true;
                break;
            }
        }
        if !isValidKey {
            return <http:Unauthorized> {
                body: "Invalid API Key"
            };
        }

        return ctx.next();
    }
}
@http:ServiceConfig {
    cors: corsConfig
}

service http:InterceptableService / on new http:Listener(9090) {
    
    public function createInterceptors() returns RequestInterceptor {
        return new RequestInterceptor();
    }

    // Define a simple GET resource to return a greeting
    resource function get greeting(http:RequestContext ctx) returns string {
        return "Hello, World!";
    }

    resource function get getUser(@http:Query string jwt) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);
        if result is json {
           //check if user exists in the database
           db:User|() user = check db.getUser(check result.sub);
              if (user is db:User) {
                return user;
              }else{
                return ();
              }
        } else {
            return result;
        }
    }


    resource function post registerUser(@http:Query string jwt,db:UserData userData) returns json|http:Unauthorized|error {
        json|http:Unauthorized|error result = googleService.decodeGoogleJWT(jwt);

        if result is json {
            db:User user = {
                uid: check result.sub,
                email: check result.email,
                name: userData.name,
                avatar: check result.picture,
                organization: userData.organization,
                contact: userData.contact
            };

            //add user to the database
            check  db.addUsers(user);
            return user;
        } else {
            return result;
        }
    }

}


