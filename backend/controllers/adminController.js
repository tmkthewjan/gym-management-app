const User = require("../models/User");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const Supplier = require("../models/Supplier");
const Appointment = require("../models/Appointment");

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalMembers, totalTrainers, totalSuppliers, totalAppointments] =
      await Promise.all([
        User.countDocuments(),
        Member.countDocuments(),
        Trainer.countDocuments(),
        Supplier.countDocuments(),
        Appointment.countDocuments(),
      ]);
    const activeMembers = await Member.countDocuments({ status: "active" });
    const pendingBookings = await Appointment.countDocuments({ status: "Pending" });
    res.status(200).json({
      totalUsers, totalMembers, totalTrainers, totalSuppliers,
      totalAppointments, activeMembers, pendingBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── All Users ─────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete User (cascades to role record) ────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "member")   await Member.deleteOne({ user: user._id });
    if (user.role === "trainer")  await Trainer.deleteOne({ email: user.email });
    if (user.role === "supplier") await Supplier.deleteOne({ email: user.email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── All Members ──────────────────────────────────────────────────────────────
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("user", "name email phone profileImage createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Toggle Member Status ─────────────────────────────────────────────────────
const toggleMemberStatus = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate("user", "name email");
    if (!member) return res.status(404).json({ message: "Member not found" });
    member.status = member.status === "active" ? "inactive" : "active";
    await member.save();
    res.status(200).json({ message: `Member ${member.status}`, member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Member by Admin ───────────────────────────────────────────────────
const updateMemberByAdmin = async (req, res) => {
  try {
    const { membershipType, fitnessGoal, status } = req.body;
    const update = {};
    if (membershipType) update.membershipType = membershipType;
    if (fitnessGoal)    update.fitnessGoal = fitnessGoal;
    if (status)         update.status = status;
    const member = await Member.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate("user", "name email phone");
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member updated", member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Assign Trainer to Member ─────────────────────────────────────────────────
const assignTrainerToMember = async (req, res) => {
  try {
    const { trainerId, date, time, note } = req.body;
    const { memberId } = req.params;

    const member = await Member.findById(memberId).populate("user", "_id name email");
    if (!member) return res.status(404).json({ message: "Member not found" });

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    if (!trainer.available) return res.status(400).json({ message: "Trainer is not available" });

    const appointment = await Appointment.create({
      member: member.user._id,
      trainer: trainerId,
      date: date || new Date().toISOString().split("T")[0],
      time: time || trainer.from,
      note: note || "Assigned by Admin",
      status: "Approved",
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("member", "name email phone")
      .populate("trainer");

    res.status(201).json({ message: "Trainer assigned successfully", appointment: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── All Trainers ─────────────────────────────────────────────────────────────
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Toggle Trainer Availability ─────────────────────────────────────────────
const toggleTrainerAvailability = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    trainer.available = !trainer.available;
    await trainer.save();
    res.status(200).json({ message: "Trainer availability updated", trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Trainer ───────────────────────────────────────────────────────────
const deleteTrainerAdmin = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── All Suppliers ────────────────────────────────────────────────────────────
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Toggle Supplier Status ───────────────────────────────────────────────────
const toggleSupplierStatus = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    supplier.status = supplier.status === "active" ? "inactive" : "active";
    await supplier.save();
    res.status(200).json({ message: `Supplier ${supplier.status}`, supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Supplier ──────────────────────────────────────────────────────────
const deleteSupplierAdmin = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── All Appointments ─────────────────────────────────────────────────────────
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("member", "name email phone")
      .populate("trainer", "name specialization photoUrl")
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};