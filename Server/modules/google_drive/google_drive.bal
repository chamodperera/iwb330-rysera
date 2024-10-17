import ballerinax/googleapis.drive;

# Description.
public isolated class driverService {
    final drive:Client driveClient;
    // Upload a file to Google Drive
    public function init(string refreshToken, string clientId, string clientSecret) returns error? {
        // Define the connection configuration
        drive:ConnectionConfig config = {
            auth: {
                clientId: clientId,
                clientSecret: clientSecret,
                refreshUrl: drive:REFRESH_URL,
                refreshToken: refreshToken
            }
        };
        // Create a new Google Drive client
        self.driveClient = check new (config);
        return;
    }

    public isolated function uploadFile(byte[] byteArray,string fileName, string folderId) returns drive:File|error {
        // Upload the file to Google Drive
        drive:File|error response = check self.driveClient->uploadFileUsingByteArray(byteArray, fileName,folderId);
        return response;
    }
}
    
