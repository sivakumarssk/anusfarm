const express = require("express");
const router = express.Router();

const {getSubscriptions,changeStatus,createSubscription,mySubscriptions,getSubscriptionById,pause,resume,
  cancel,calendar,updateSubscription,deleteSubscription,getPausedSubscriptions,skipDelivery,assignRider, adminCancelSubscription,} = require("../controllers/subscriptionController");

const authMiddleware = require("../middleware/authMiddleware");

// ===========================// ADMIN// ================================================

router.get("/", getSubscriptions);

router.put("/:id/status", changeStatus);

// =====================// USER - CREATE// ===============================================

router.post("/create",authMiddleware,createSubscription);

router.put("/:id/admin-cancel", adminCancelSubscription);

router.post("/create", authMiddleware, createSubscription);

// ====================// USER - MY SUBSCRIPTIONS// ========================================

router.get("/my", authMiddleware,  mySubscriptions);

// =====================// USER - PAUSED SUBSCRIPTIONS// ===================================

router.get("/paused", authMiddleware,  getPausedSubscriptions);

// =====================// USER - SINGLE SUBSCRIPTION DETAILS// ============================

router.get("/:id",authMiddleware, getSubscriptionById);

// ===================// USER - PAUSE// =====================================================

router.put( "/:id/pause", pause);

// =====================// USER - RESUME// ========================================

router.put("/:id/resume", resume);

// =====================// USER - CANCEL// ==========================================

router.put( "/:id/cancel", authMiddleware, cancel);

// =========================// USER - DELIVERY CALENDAR// ====================================

router.get("/:id/calendar", authMiddleware,calendar);

// =======================// USER - UPDATE// =====================================

router.put("/:id", authMiddleware, updateSubscription);

// ========================// USER - DELETE// ======================================

router.delete("/:id",authMiddleware,deleteSubscription);

// ======================// USER - SKIP SINGLE DELIVERY// ==========================

router.put("/delivery/:deliveryId/skip", authMiddleware, skipDelivery);

router.put( "/delivery/:deliveryId/assign-rider", authMiddleware,  assignRider);



module.exports = router;

