const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  downloadsLeft: {
    type: Number,
    default: 10,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

module.exports = mongoose.model("User", userSchema);
