const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplement",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);