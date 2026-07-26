const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AnusFarm Backend Running"
  });
});

module.exports = app;