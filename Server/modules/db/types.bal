// Define the record type for the User Data
public type UserData record {|
    string name;
    string contact;
    string organization;
|};

// Define the record type for the User
public type User record {|
    string uid;
    string email;
    string name;
    string avatar;
    string organization;
    string contact;
|};

public type Order record {|
    string orderDate;
    string uid;
    string fileName;
    string status;
    string printTime;
    string price;
|};