const express = require("express");
const {
  createMember,
  getMembers,
  getMyMemberProfile,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("member"), createMember);
router.get("/", protect, allowRoles("admin"), getMembers);
router.get("/me", protect, allowRoles("member"), getMyMemberProfile);
router.get("/:id", protect, allowRoles("admin"), getMemberById);
router.put("/:id", protect, allowRoles("admin", "member"), updateMember);
router.delete("/:id", protect, allowRoles("admin"), deleteMember);

module.exports = router;