const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const productRoutes = require("./routes/productRoutes");


const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Image folder access
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/products", productRoutes);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AnusFarm Backend Running"
  });
});


module.exports = app;