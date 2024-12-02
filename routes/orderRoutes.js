const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authenticateUser = require("../middleware/authenticateFirebaseToken");


router.use(authenticateUser);

// Get all orders for the current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const orders = await Order.find({ userId })
      .populate("driverId")
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by Id
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.uid;
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

    // Find the driver associated with the order and send the order to them
    const driverId = savedOrder.driverId; // Assuming the order has a driverId field
    const socketId = driverSockets[driverId]; // Retrieve the socketId for the driver

    if (socketId && io) {
      io.to(socketId).emit("newOrder", { order: savedOrder }); // Emit to the specific driver
      console.log(`New order sent to driver: ${driverId}`);
    } else {
      console.log(`Driver ${driverId} not connected or no socketId found`);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.uid;
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
    const userId = req.user.uid;
    const deletedOrder = await Order.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export the setter function to set the WebSocket instance
module.exports =router