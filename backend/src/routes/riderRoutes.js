
const express = require("express");

const router = express.Router();

const riderController = require("../controllers/riderController");

const riderAuthMiddleware = require("../middleware/riderAuthMiddleware");



router.post( "/login",riderController.loginRider);

router.get( "/all", riderController.getAllRiders);

router.get( "/profile", riderAuthMiddleware, riderController.getProfile);

router.put(  "/status", riderAuthMiddleware, riderController.updateStatus);

router.get( "/orders", riderAuthMiddleware,riderController.getOrders);

router.put( "/orders/:orderId/status",riderAuthMiddleware,riderController.updateOrderStatus);

router.get("/subscription-deliveries", riderAuthMiddleware,riderController.getSubscriptionDeliveries);

router.get( "/subscription-deliveries/today", riderAuthMiddleware, riderController.getTodaySubscriptionDeliveries);

router.get( "/subscription-deliveries/:deliveryId",  riderAuthMiddleware, riderController.getSubscriptionDeliveryById);

router.put( "/subscription-deliveries/:deliveryId/status", riderAuthMiddleware, riderController.updateSubscriptionDeliveryStatus);

router.get("/my-deliveries", riderAuthMiddleware, riderController.getMyDeliveries);


module.exports = router;