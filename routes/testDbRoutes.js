const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// Test route
router.get("/test-db", async (req, res) => {
  try {
    const users = await User.find(); // Fetch users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
