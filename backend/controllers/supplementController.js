const Supplement = require("../models/Supplement");

const createSupplement = async (req, res) => {
  try {
    const { name, category, description, price, stock, imageUrl } = req.body;

    if (!name || !category || !description || !price) {
      return res.status(400).json({ message: "Please fill all supplement fields" });
    }

    const supplement = await Supplement.create({
      name,
      category,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      imageUrl: imageUrl || "",
      supplier: req.user._id,
      status: Number(stock) > 0 ? "Available" : "Out of Stock",
    });

    res.status(201).json({
      message: "Supplement added successfully",
      supplement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find()
      .populate("supplier", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json(supplements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find({ supplier: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(supplements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSupplement = async (req, res) => {
  try {
    if (req.body.stock !== undefined) {
      req.body.status = Number(req.body.stock) > 0 ? "Available" : "Out of Stock";
    }

    const supplement = await Supplement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    res.status(200).json({
      message: "Supplement updated successfully",
      supplement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findByIdAndDelete(req.params.id);

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    res.status(200).json({ message: "Supplement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupplement,
  getSupplements,
  getMySupplements,
  updateSupplement,
  deleteSupplement,
};