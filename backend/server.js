const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ============= MIDDLEWARE ============= */
app.use(cors());
app.use(express.json());

/* ============= MONGODB CONNECTION ============= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ============= CONTACT SCHEMA ============= */
const contactSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String },
    category: { type: String },
    message:  { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

/* ============= ROUTES ============= */

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Xynor Labs server is running 🚀" });
});

// Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }

    const newContact = new Contact({ name, email, phone, category, message });
    await newContact.save();

    console.log("📩 New contact saved:", newContact);
    res.status(201).json({ success: true, message: "Message received!" });

  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

/* ============= START SERVER ============= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});