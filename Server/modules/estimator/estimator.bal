import ballerina/http;

public isolated class estimatorService {
    final string key;
    final http:Client estimatorClient;

    public function init(string key) returns error? {
        self.key = key;
        // Create a new HTTP client to communicate with the Estimator API
        do {
            self.estimatorClient = check new("https://www.slant3dapi.com");
        } on fail error e{
            // Handle the error
            return e;
        }
        return;
    }

    public isolated function estimate(string url) returns json|error {
        // Send the request with the correct headers and payload
        http:Response response = check self.estimatorClient->post("/api/slicer", 
            {
                fileURL: url
            },
            headers = {
                "api-key": self.key,
                "Content-Type": "application/json"
            }
        );  

        // Get the JSON payload from the response
        json|error result = check response.getJsonPayload();
        return result;
    }
}


