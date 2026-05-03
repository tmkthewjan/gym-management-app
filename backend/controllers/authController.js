const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Supplier = require("../models/Supplier");
const Member = require("../models/Member");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (!["member", "trainer", "supplier", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        message: "User already exists with this phone number",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      profileImage: req.body.profileImage || "",
    });

    if (role === "trainer") {
      await Trainer.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
        specialization: req.body.specialization || "General Fitness Trainer",
        experience: req.body.experience || 0,
        available: true,
        from: req.body.from || "08:00",
        to: req.body.to || "17:00",
        photoUrl:
          req.body.photoUrl ||
          req.body.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      });
    }

    if (role === "supplier") {
      await Supplier.create({
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: req.body.companyName || "Royal Fitness Supplier",
        supplyType: req.body.supplyType || "Supplements",
        address: req.body.address || "Not provided",
        status: "active",
      });
    }

    if (role === "member") {
      await Member.create({
        user: user._id,
        membershipType: req.body.membershipType || "monthly",
        age: req.body.age || 18,
        gender: req.body.gender || "male",
        address: req.body.address || "Not provided",
        fitnessGoal: req.body.fitnessGoal || "General Fitness",
        status: "active",
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};