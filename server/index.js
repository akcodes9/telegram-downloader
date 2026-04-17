const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const path = require("path");

const connectDB = require("./db");
const verifyPayment = require("./paymentVerification");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.send("API running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Create Razorpay order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 20000, // ₹200 (in paise)
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating order" });
  }
});

// Payment verification
app.post("/verify-payment", verifyPayment);

// ================= STATIC FILES =================

// Serve frontend (from /public)
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// ================= SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
