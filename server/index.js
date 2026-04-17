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

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Auth routes
app.use("/auth", authRoutes);

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Health check
app.get("/api", (req, res) => {
  res.send("API running");
});

// Create order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 20000, // ₹200
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Error creating order" });
  }
});

// Verify payment
app.post("/verify-payment", verifyPayment);

// Start server (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
