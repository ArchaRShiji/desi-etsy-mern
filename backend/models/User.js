// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["customer", "artisan", "admin"], default: "customer" },
  isApproved: { type: Boolean, default: false }, // for artisan approval
  // Artisan profile fields
  businessName: String,
  address: String,
  phone: String,
  description: String,
});

module.exports = mongoose.model("User", userSchema);
