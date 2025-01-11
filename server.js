require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const passport = require("./middlewares/passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const { loadCasbin } = require("./middlewares/casbin");
const { casbinMiddleware } = require("./middlewares/casbin");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const cors = require('cors');

// Load Casbin policies
loadCasbin();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000, // Default to 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Default to 100 requests
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.post("/api/resource", casbinMiddleware, (req, res) => {
  res.send("Resource accessed successfully");
});
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
