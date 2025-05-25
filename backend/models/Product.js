const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // store image URLs or relative paths
    },
  ],
  category: {
    type: String,
    required: true,
  },
  tags: [String], // optional search keywords
  stock: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming all users are in a single User model
    required: true,
  },
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model("Product", ProductSchema);
