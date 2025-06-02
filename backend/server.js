const express = require("express");
const connectDB = require("./db");
const cors = require("cors"); // Import cors
require("dotenv").config();
const cohereRoutes = require("./routes/cohere"); // Adjust path as needed
const User = require("./models/User");
const mongoose = require("mongoose"); // Explicitly import mongoose
const { generateToken } = require("./models/utils/jwt"); // Only generateToken is needed here
const authMiddleware = require("./middleware/auth"); // Import authMiddleware from its new location

const app = express();
connectDB(); // connect to MongoDB

// dotenv.config(); // Removed redundant call

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "https://localhost:8080", "http://localhost:8081", "http://192.168.0.123:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Define Routes
app.use("/api/events", authMiddleware, require("./routes/events"));
app.use("/api/tasks", require("./routes/tasks")); // New route for tasks

app.use("/api/cohere", authMiddleware, require("./routes/cohere"));

app.use("/api/pdf", require("./routes/pdf")); // New route for PDF generation

mongoose
  .connect(process.env.MONGO_URI) // useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6.0+
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Authentication Middleware (now imported from backend/middleware/auth.js)

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ email, password, name });
    await user.save();
    const token = generateToken(user._id);
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
  } catch (error) {
    console.error("Registration error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Get authenticated user details
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//
