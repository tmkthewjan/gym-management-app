const Trainer = require("../models/Trainer");

const createTrainer = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (from >= to) {
      return res.status(400).json({
        message: "From time must be earlier than To time",
      });
    }

    const trainer = await Trainer.create(req.body);

    res.status(201).json({
      message: "Trainer created successfully",
      trainer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();

    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrainer = async (req, res) => {
  try {
    if (req.body.from && req.body.to && req.body.from >= req.body.to) {
      return res.status(400).json({
        message: "From time must be earlier than To time",
      });
    }

    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({
      message: "Trainer updated successfully",
      trainer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrainer,
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
};