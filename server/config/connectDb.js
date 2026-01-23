const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://asadkaptech:mern-sep@cluster0.t18qqgk.mongodb.net/?appName=Cluster0/FitnessTracker");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

module.exports = connectDb;
