const express = require("express");

const router = express.Router();

const {
    getRiders,
    getSubscriptionDeliveries,
    assignRider
} = require("../controllers/adminDeliveryController");


// Get all active riders
router.get(
    "/riders",
    getRiders
);


// Get subscription deliveries
router.get(
    "/subscription-deliveries",
    getSubscriptionDeliveries
);


// Assign rider
router.put(
    "/assign-rider",
    assignRider
);


module.exports = router;