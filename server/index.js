const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

const connectDB = require("./db");
const User = require("./models/User");
const sendVerificationEmail = require("./email");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use(express.static(path.join(__dirname, "public")));

// ===============================
// REGISTER
// ===============================
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "User exists" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const user = new User({
    email,
    password,
    verificationToken: token,
  });

  await user.save();
  await sendVerificationEmail(email, token);

  res.json({ message: "Check your email to verify" });
});

// ===============================
// RESEND VERIFICATION
// ===============================
app.post("/resend", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.isVerified) {
    return res.json({ message: "Already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;

  await user.save();
  await sendVerificationEmail(email, token);

  res.json({ message: "Verification email sent again" });
});

// ===============================
// VERIFY
// ===============================
app.get("/verify/:token", async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token,
  });

  if (!user) {
    return res.send("Invalid token");
  }

  user.isVerified = true;
  user.verificationToken = null;

  await user.save();

  res.send("Email verified! You can now login.");
});

// ===============================
// LOGIN
// ===============================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: "Verify your email first" });
  }

  res.json({ userId: user._id });
});

// ===============================
// GET REMAINING DOWNLOADS
// ===============================
app.post("/remaining", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ remaining: user.downloadsLeft });
});

// ===============================
// CONSUME DOWNLOAD
// ===============================
app.post("/consume", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user || !user.isVerified) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (user.downloadsLeft <= 0) {
    return res.status(403).json({ error: "Limit reached" });
  }

  user.downloadsLeft -= 1;
  await user.save();

  res.json({ remaining: user.downloadsLeft });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
