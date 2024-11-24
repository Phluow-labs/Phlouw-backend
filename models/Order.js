const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      number: { type: Number, required: true },
    },
  ],
  deliveryStatus: { type: String, default: "Pending" },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date },
  additionalInfo: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
