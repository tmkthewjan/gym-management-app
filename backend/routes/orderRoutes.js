const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSupplierOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("member"), createOrder);

router.get("/my", protect, allowRoles("member", "supplier", "admin"), getMyOrders);

router.get("/supplier", protect, allowRoles("supplier", "admin"), getSupplierOrders);

router.get("/", protect, allowRoles("admin", "supplier"), getAllOrders);

router.put("/:id/status", protect, allowRoles("supplier", "admin"), updateOrderStatus);

module.exports = router;