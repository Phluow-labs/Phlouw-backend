const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver")
const { driverSockets } = require("../app"); 

// Create a new driver
router.post("/", async (req, res) => {
  try {
    const driver = new Driver(req.body);
    const savedDriver = await driver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a driver by ID
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
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
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
    if (!deletedDriver)
      return res.status(404).json({ message: "Driver not found" });
    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver login
router.post("/login", async (req, res) => {
  const { fullName, code } = req.body;

  try {
    const driver = await Driver.findOne({
      fullName: { $regex: new RegExp(`^${fullName}$`, "i") }, 
      code,
    });

    if (!driver) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json(driver); // Firebase token will be used on the frontend for authentication
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register driver to receive WebSocket notifications
router.post("/register", (req, res) => {
  const { driverId, socketId } = req.body;

  // Store driver socket ID for later communication
  driverSockets[driverId] = socketId;

  res.status(200).json({ message: "Driver registered for notifications" });
});

module.exports = router;
