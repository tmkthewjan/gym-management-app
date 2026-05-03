const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Suppliers route working", suppliers: [] });
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Supplier created", data: req.body });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "Supplier updated", id: req.params.id });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({ message: "Supplier deleted", id: req.params.id });
});

module.exports = router;