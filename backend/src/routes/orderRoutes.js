const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {placeOrder,} = require("../controllers/orderController");
const { myOrders } = require("../controllers/orderController");
const { getOrders}=require("../controllers/orderController");
const {getSingleOrder}=require("../controllers/orderController")
const {updateOrderStatus}=require("../controllers/orderController")
const {deleteOrder}=require("../controllers/orderController");
const { assignRider } = require("../controllers/orderController");
const {getPendingStats}=require("../controllers/orderController");
const { cancelMyOrder } = require("../controllers/orderController");
const {
    cancelOrderByAdmin
} = require("../controllers/orderController");
router.get("/",getOrders);
router.get("/pending-stats", getPendingStats);
router.post("/", authMiddleware, placeOrder);
router.get("/my",authMiddleware,myOrders);
router.get("/:id",authMiddleware,getSingleOrder);
router.put("/:id/status",updateOrderStatus);
router.put("/:id/assign-rider", assignRider);
router.put(
    "/:id/admin-cancel",
    cancelOrderByAdmin
);
router.delete("/:id",deleteOrder);
router.post("/:id/cancel", authMiddleware, cancelMyOrder);


module.exports=router;