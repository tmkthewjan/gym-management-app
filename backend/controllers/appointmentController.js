const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { trainer, date, time, note } = req.body;

    if (!trainer || !date || !time) {
      return res.status(400).json({
        message: "Trainer, date and time are required",
      });
    }

    const appointment = await Appointment.create({
      member: req.user._id,
      trainer,
      date,
      time,
      note,
    });

    res.status(201).json({
      message: "Trainer booking request sent successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ member: req.user._id })
      .populate("trainer")
      .populate("member", "name email phone role");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrainerAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("member", "name email phone role")
      .populate("trainer");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("member", "name email phone role")
      .populate("trainer");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, Approved or Rejected",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("member", "name email phone role")
      .populate("trainer");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getTrainerAppointments,
  getAllAppointments,
  updateAppointmentStatus,
};