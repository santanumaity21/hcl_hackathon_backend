const { body, validationResult } = require("express-validator");
const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .isIn(["Doctor", "Patient"])
      .withMessage("Role must be either Doctor or Patient"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Registration logic
    const { name, email, password, role } = req.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // This line hashes the password

      // Create a new user
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  }
);

module.exports = router;
