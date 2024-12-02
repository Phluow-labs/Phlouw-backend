const mongoose = require("mongoose");
const crypto = require("crypto"); // For generating unique IDs

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
  userId: { type: String, required: true },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      number: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryStatus: { type: String, default: "Pending" },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date },
  additionalInfo: { type: String },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

// Pre-save hook to generate unique orderId
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = crypto.randomBytes(8).toString("hex");
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
