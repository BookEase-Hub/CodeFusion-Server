const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/add-user', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: 'password'
    });
    await newUser.save();
    res.json({ message: 'User added', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
