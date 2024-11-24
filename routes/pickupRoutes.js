// routes/pickupRoutes.js
const express = require("express");
const Pickup = require("../models/Pickup");  

const router = express.Router();

// Create a new pickup
router.post("/pickup", async (req, res) => {
  const { name, logo, location, date, time, price, status } = req.body;

  try {
    const newPickup = new Pickup({ name, logo, location, date, time, price, status });
    await newPickup.save();
    res.status(201).json({ message: "Pickup created successfully", pickup: newPickup });
  } catch (error) {
    res.status(400).json({ error: "Error creating pickup", details: error.message });
  }
});

// Get all pickups
router.get("/pickups", async (req, res) => {
  try {
    const pickups = await Pickup.find();
    res.status(200).json(pickups);
  } catch (error) {
    res.status(400).json({ error: "Error fetching pickups", details: error.message });
  }
});

// Update pickup status
router.put("/pickup/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedPickup = await Pickup.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedPickup) {
      return res.status(404).json({ error: "Pickup not found" });
    }
    res.status(200).json(updatedPickup);
  } catch (error) {
    res.status(400).json({ error: "Error updating pickup status", details: error.message });
  }
});

// Delete a pickup
router.delete("/pickup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPickup = await Pickup.findByIdAndDelete(id);
    if (!deletedPickup) {
      return res.status(404).json({ error: "Pickup not found" });
    }
    res.status(200).json({ message: "Pickup deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting pickup", details: error.message });
  }
});

module.exports = router;
