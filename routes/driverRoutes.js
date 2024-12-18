const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver"); // MongoDB model for Driver

// Create a new driver
router.post("/", async (req, res) => {
  try {
    const driver = new Driver(req.body); // Create a new driver
    const savedDriver = await driver.save(); // Save to the database
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find(); // Get all drivers from the database
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a driver by ID
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id); // Find a driver by their ID
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a driver
router.put("/:id", async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a driver
router.delete("/:id", async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id); // Delete the driver
    if (!deletedDriver)
      return res.status(404).json({ message: "Driver not found" });
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver login (for authenticating driver via Firebase or other method)
router.post("/login", async (req, res) => {
  const { fullName, code } = req.body;

  try {
    const driver = await Driver.findOne({
      fullName: { $regex: new RegExp(`^${fullName}$`, "i") }, // Case-insensitive search
      code,
    });

    if (!driver) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json(driver); // Send driver data back to frontend (Firebase token for auth)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
