const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      match: [/^0\d{9}$/, "Phone must be 10 digits and start with 0"],
    },

    companyName: {
      type: String,
      required: true,
    },

    supplyType: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);