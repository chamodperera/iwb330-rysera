import ballerinax/mongodb;

public isolated class Database {
    final string connectionString;
    final mongodb:Client mongodb;
    final mongodb:Database db;

    public function init(string connectionString) returns error? {
        self.connectionString = connectionString;
        self.mongodb = check new ({
            connection : self.connectionString
        });
        self.db = check self.mongodb->getDatabase("3dprintingDB");
    }

    public isolated function addUsers(User user) returns error? {
        mongodb:Collection usersCollection = check self.db->getCollection("users");
        check usersCollection->insertOne(user);
    }

    public isolated function getUser(string uid) returns User|error? {
        mongodb:Collection usersCollection = check self.db->getCollection("users");

        User|() result = check usersCollection->findOne({
            "uid": uid
        });

        return result;
    }

    public isolated function addOrders(Order[] newOrders) returns error? {
        mongodb:Collection ordersCollection = check self.db->getCollection("orders");
        check ordersCollection->insertMany(newOrders);
    }

    public isolated function getOrders(string uid) returns stream<Order,error?>|error? {
        mongodb:Collection ordersCollection = check self.db->getCollection("orders");

        stream<Order,error?>|() result = check ordersCollection->find({
            "uid": uid
        });

        return result;
    }
}
