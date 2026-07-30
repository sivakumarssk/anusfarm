const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const orderRoutes=require("./routes/orderRoutes");


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
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin",notificationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/orders",orderRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AnusFarm Backend Running"
  });
});


module.exports = app;
