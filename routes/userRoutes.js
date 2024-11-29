const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser); // Return the created user
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors during creation
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Get all users from the database
    res.json(users); // Return the list of users
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server errors
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // User not found
    }
    res.json(user); // Return the user data
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update user
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // User not found
    }
    res.json(user); // Return updated user
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Delete user
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // User not found
    }
    res.json({ message: "User deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});


router.post("/login", async (req, res) => {
  const { fullName, code } = req.body;

  try {
    const driver = await User.findOne({ fullName, code });
    if (!driver) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
