const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getTrainerAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("member"), createAppointment);

router.get("/my", protect, allowRoles("member"), getMyAppointments);

router.get(
  "/trainer",
  protect,
  allowRoles("trainer", "admin"),
  getTrainerAppointments
);

router.get("/", protect, allowRoles("admin"), getAllAppointments);

router.put(
  "/:id/status",
  protect,
  allowRoles("trainer", "admin"),
  updateAppointmentStatus
);

module.exports = router;