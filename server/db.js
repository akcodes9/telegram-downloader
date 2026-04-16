const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akhil0903:YOUR_PASSWORD@cluster0.i39z9qh.mongodb.net/telegramDB?retryWrites=true&w=majority",
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
