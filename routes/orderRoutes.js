const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authenticateUser = require("../middleware/authenticateFirebaseToken");

router.use(authenticateUser); // Protect all routes

// Get all orders for the current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .populate("driverId")
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an order by ID for the current user
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, userId })
      .populate("driverId")
      .populate("products.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const order = new Order({ ...req.body });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, userId },
      { ...req.body, dateModified: Date.now() },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedOrder = await Order.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
