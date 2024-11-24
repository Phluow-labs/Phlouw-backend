const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true }, 
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  accountType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("User", userSchema);
