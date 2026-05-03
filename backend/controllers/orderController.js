const Order = require("../models/Order");
const Supplement = require("../models/Supplement");

const createOrder = async (req, res) => {
  try {
    const { supplementId, quantity } = req.body;

    if (!supplementId || !quantity) {
      return res.status(400).json({ message: "Supplement and quantity are required" });
    }

    const supplement = await Supplement.findById(supplementId);

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    if (supplement.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const totalPrice = supplement.price * quantity;

    const order = await Order.create({
      member: req.user._id,
      supplement: supplementId,
      quantity,
      totalPrice,
      status: "Pending",
    });

    supplement.stock -= quantity;
    await supplement.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ member: req.user._id })
      .populate("supplement")
      .populate("member", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("supplement")
      .populate("member", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("supplement")
      .populate("member", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("supplement")
      .populate("member", "name email phone role");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSupplierOrders,
  updateOrderStatus,
};