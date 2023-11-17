const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 1000, 
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  mongoose.disconnect();
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected, attempting to reconnect");
  connectDB();
});

module.exports = {
  connectDB,
  openaiApiKey: process.env.OPENAI_API_KEY,
  PORT: process.env.PORT || 3000,
};
