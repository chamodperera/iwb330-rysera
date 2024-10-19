import ballerinax/googleapis.sheets as sheets;
import ballerina/io;

public type orderData record {|
    string customerName;
    string customerEmail;
    string[] fileNames;
    string[] fileURLs;
    int[] quantities;
    decimal[] prices;    
|};

public type rowData record {|
    (int|string|decimal)[] values;
|};

public isolated class sheetsService{
    final sheets:Client sheetsClient;

    public function init(string refreshToken, string clientId, string clientSecret) returns error? {
        sheets:ConnectionConfig config = {
            auth: {
                clientId: clientId,
                clientSecret: clientSecret,
                refreshUrl: sheets:REFRESH_URL,
                refreshToken: refreshToken
            }
        };
        self.sheetsClient = check new (config);
        return;
    }
    private isolated function getCurrentRowCount(string sheetId, string sheetName) returns int|error? {
        sheets:Range range = check self.sheetsClient->getRange(sheetId, sheetName, "C:C");

        int currentRow = 1;
        foreach var value in range.values {
            foreach var element in value {
                if element == "" {
                    return currentRow;
                }
            }
            currentRow = currentRow + 1;
        }
        return currentRow;
    }

    public isolated function addOrder(string sheetId, string sheetName, orderData orderData) returns error? {
        int|error? currentRowCount = check self.getCurrentRowCount(sheetId, sheetName) + 1;

        if(currentRowCount is int){
        io:print("Current Row Count: " + currentRowCount.toString());
        rowData initalData = {
            values: [orderData.customerName, orderData.customerEmail, orderData.fileNames[0], orderData.fileURLs[0], orderData.prices[0], orderData.quantities[0]]
        };
        check self.sheetsClient->createOrUpdateRow(sheetId, sheetName, currentRowCount, initalData.values);
        foreach int i in 1 ..< orderData.fileNames.length() {
            // prepare the data to be written to the sheet
            rowData data = {
                values: ["", "", orderData.fileNames[i], orderData.fileURLs[i], orderData.prices[i], orderData.quantities[i]]
            };

            // write the data to the sheet
            check self.sheetsClient->createOrUpdateRow(sheetId, sheetName, currentRowCount + i, data.values);
        }
        return;
        }   
        }
    
}