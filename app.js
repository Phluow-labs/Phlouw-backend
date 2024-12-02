const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const { router: orderRoutes, setIoInstance } = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const pickupRoutes = require("./routes/pickupRoutes");
const authenticateFirebaseToken = require("./middleware/authenticateFirebaseToken");

dotenv.config();

const app = express();

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Create WebSocket instance
const io = socketIo(server);

// Set io instance in the order routes
setIoInstance(io);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/orders", authenticateFirebaseToken, orderRoutes); // Order routes with WebSocket support
app.use("/api/products", authenticateFirebaseToken, productRoutes);
app.use("/api/pickups", pickupRoutes);
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: err.message });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
