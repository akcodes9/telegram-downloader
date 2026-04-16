const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const connectDB = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

// create order
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
    res.status(500).send("Error creating order");
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
