const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminRoutes = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const supplementRoutes = require("./routes/supplementRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Royal Fitness Gym Backend API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/supplements", supplementRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});