const Member = require("../models/Member");

const createMember = async (req, res) => {
  try {
    const member = await Member.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Member profile created successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate("user", "name email phone role");

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyMemberProfile = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role"
    );

    if (!member) {
      return res.status(404).json({ message: "Member profile not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      "user",
      "name email phone role"
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMyMemberProfile,
  getMemberById,
  updateMember,
  deleteMember,
};