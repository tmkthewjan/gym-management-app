const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllMembers,
  toggleMemberStatus,
  updateMemberByAdmin,
  assignTrainerToMember,
  getAllTrainers,
  toggleTrainerAvailability,
  deleteTrainerAdmin,
  getAllSuppliers,
  toggleSupplierStatus,
  deleteSupplierAdmin,
  getAllAppointments,
} = require("../controllers/adminController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();
const admin = [protect, allowRoles("admin")];

// Dashboard
router.get("/dashboard", ...admin, getDashboardStats);

// Users
router.get("/users", ...admin, getAllUsers);
router.delete("/users/:id", ...admin, deleteUser);

// Members
router.get("/members", ...admin, getAllMembers);
router.put("/members/:id/toggle-status", ...admin, toggleMemberStatus);
router.put("/members/:id", ...admin, updateMemberByAdmin);
router.post("/members/:memberId/assign-trainer", ...admin, assignTrainerToMember);

// Trainers
router.get("/trainers", ...admin, getAllTrainers);
router.put("/trainers/:id/toggle-availability", ...admin, toggleTrainerAvailability);
router.delete("/trainers/:id", ...admin, deleteTrainerAdmin);

// Suppliers
router.get("/suppliers", ...admin, getAllSuppliers);
router.put("/suppliers/:id/toggle-status", ...admin, toggleSupplierStatus);
router.delete("/suppliers/:id", ...admin, deleteSupplierAdmin);

// Appointments
router.get("/appointments", ...admin, getAllAppointments);

module.exports = router;