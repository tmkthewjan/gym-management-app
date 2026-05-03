const express = require("express");
const {
  createSupplement,
  getSupplements,
  getMySupplements,
  updateSupplement,
  deleteSupplement,
} = require("../controllers/supplementController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSupplements);
router.get("/my", protect, allowRoles("supplier", "admin"), getMySupplements);

router.post("/", protect, allowRoles("supplier", "admin"), createSupplement);
router.put("/:id", protect, allowRoles("supplier", "admin"), updateSupplement);
router.delete("/:id", protect, allowRoles("supplier", "admin"), deleteSupplement);

module.exports = router;