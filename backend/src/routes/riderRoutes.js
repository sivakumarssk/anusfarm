
const express = require("express");

const router = express.Router();

const riderController = require("../controllers/riderController");

const riderAuthMiddleware = require("../middleware/riderAuthMiddleware");


// ============================================================
// RIDER LOGIN
// ============================================================

router.post(
    "/login",
    riderController.loginRider
);

router.get(
    "/all",
    riderController.getAllRiders
);
// ============================================================
// RIDER PROFILE
// ============================================================

router.get(
    "/profile",
    riderAuthMiddleware,
    riderController.getProfile
);


// ============================================================
// RIDER ONLINE / OFFLINE
// ============================================================

router.put(
    "/status",
    riderAuthMiddleware,
    riderController.updateStatus
);


// ============================================================
// RIDER ORDERS
// ============================================================

// Get rider orders
router.get(
    "/orders",
    riderAuthMiddleware,
    riderController.getOrders
);

// Update rider order status
router.put(
    "/orders/:orderId/status",
    riderAuthMiddleware,
    riderController.updateOrderStatus
);


// ============================================================
// RIDER SUBSCRIPTION DELIVERIES
// ============================================================

// Get all subscription deliveries
router.get(
    "/subscription-deliveries",
    riderAuthMiddleware,
    riderController.getSubscriptionDeliveries
);


// Get today's subscription deliveries
router.get(
    "/subscription-deliveries/today",
    riderAuthMiddleware,
    riderController.getTodaySubscriptionDeliveries
);


// Get single subscription delivery
router.get(
    "/subscription-deliveries/:deliveryId",
    riderAuthMiddleware,
    riderController.getSubscriptionDeliveryById
);


// Update subscription delivery status
router.put(
    "/subscription-deliveries/:deliveryId/status",
    riderAuthMiddleware,
    riderController.updateSubscriptionDeliveryStatus
);


// ============================================================
// MY DELIVERIES
// ============================================================

router.get(
    "/my-deliveries",
    riderAuthMiddleware,
    riderController.getMyDeliveries
);


module.exports = router;