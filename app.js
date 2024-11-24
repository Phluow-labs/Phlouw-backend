const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const driverRoutes = require("./routes/driverRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const pickupRoutes = require("./routes/pickupRoutes")
const authenticateFirebaseToken = require("./middleware/authenticateFirebaseToken");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users",userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/orders", authenticateFirebaseToken,orderRoutes);
app.use("/api/products",authenticateFirebaseToken, productRoutes);
app.use('/api/pickups', pickupRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
