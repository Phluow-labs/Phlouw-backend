// models/Pickup.js
const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },  
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, required: true, enum: ['completed', 'pending', 'denied'] },
  },
  { timestamps: true }
);

const Pickup = mongoose.model("Pickup", pickupSchema);

module.exports = Pickup;  
