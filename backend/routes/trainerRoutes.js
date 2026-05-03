const express = require("express");
const {
  createTrainer,
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin", "trainer"), createTrainer);

// Members can view trainers
router.get("/", getTrainers);
router.get("/:id", getTrainerById);

router.put("/:id", protect, allowRoles("admin", "trainer"), updateTrainer);
router.delete("/:id", protect, allowRoles("admin"), deleteTrainer);

module.exports = router;