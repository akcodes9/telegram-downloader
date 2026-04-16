const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin123@cluster0.ivpsulh.mongodb.net/telegramDB?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
