const express = require("express");
const router = express.Router();

const { checkDelivery } = require("../controllers/deliveryController");

router.post("/check", checkDelivery);

module.exports = router;