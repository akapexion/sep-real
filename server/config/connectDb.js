const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://asadkaptech:mern-sep@ac-qvpabnd-shard-00-00.t18qqgk.mongodb.net:27017,ac-qvpabnd-shard-00-01.t18qqgk.mongodb.net:27017,ac-qvpabnd-shard-00-02.t18qqgk.mongodb.net:27017/?ssl=true&replicaSet=atlas-91d141-shard-0&authSource=admin&appName=Cluster0");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

module.exports = connectDb;
