

const jwt = require("jsonwebtoken");
const riderModel = require("../models/riderModel");

// ============================================================
// RIDER LOGIN
// ============================================================

exports.loginRider = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const rider = await riderModel.getRiderByPhone(phone);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        const token = jwt.sign(
            {
                riderId: rider.id,
                role: "rider"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Rider login successful",
            token,
            rider
        });

    } catch (error) {
        console.error("RIDER LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// GET RIDER PROFILE
// ============================================================

exports.getProfile = async (req, res) => {
    try {
        const riderId = req.rider.riderId;

        const rider = await riderModel.getRiderById(riderId);

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        return res.status(200).json({
            success: true,
            rider
        });

    } catch (error) {
        console.error("GET RIDER PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// UPDATE RIDER ONLINE / OFFLINE STATUS
// ============================================================

exports.updateStatus = async (req, res) => {
    try {
        const riderId = req.rider.riderId;
        const { status } = req.body;

        if (!["Online", "Offline"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be Online or Offline"
            });
        }

        const rider = await riderModel.updateRiderStatus(
            riderId,
            status
        );

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Rider is now ${status}`,
            rider
        });

    } catch (error) {
        console.error("UPDATE RIDER STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// GET RIDER ORDERS
// ============================================================

exports.getOrders = async (req, res) => {
    try {
        const riderId = req.rider.riderId;

        console.log("GET RIDER ORDERS - RIDER ID:", riderId);

        const orders = await riderModel.getRiderOrders(riderId);

        console.log("RIDER ORDERS:", orders);

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("GET RIDER ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// UPDATE RIDER ORDER STATUS
// ============================================================

exports.updateOrderStatus = async (req, res) => {
    try {
        const riderId = req.rider.riderId;
        const orderId = req.params.orderId;
        const { status } = req.body;

        const statusFlow = {
            "Assigned": "Accepted",
            "Pending": "Accepted",
            "Accepted": "Picked Up",
            "Picked Up": "Out for Delivery",
            "Out for Delivery": "Delivered"
        };

        const allowedStatuses = [
            "Accepted",
            "Picked Up",
            "Out for Delivery",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery status"
            });
        }

        const order = await riderModel.getOrderByIdForRider(
            orderId,
            riderId
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found or not assigned to this rider"
            });
        }

        const expectedNextStatus = statusFlow[order.status];

        if (expectedNextStatus !== status) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid status transition. Current status is "${order.status}". ` +
                    `Next status must be "${expectedNextStatus || "none"}".`
            });
        }

        const updatedOrder =
            await riderModel.updateRiderOrderStatus(
                orderId,
                riderId,
                status
            );

        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("RIDER ORDER STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// GET RIDER SUBSCRIPTION DELIVERIES
// ============================================================

exports.getSubscriptionDeliveries = async (req, res) => {
    try {
        const riderId = req.rider.riderId;

        console.log(
            "RIDER SUBSCRIPTION DELIVERIES:",
            riderId
        );

        const deliveries =
            await riderModel.getRiderSubscriptionDeliveries(
                riderId
            );

        console.log(
            "RIDER DELIVERIES DATA:",
            deliveries
        );

        return res.status(200).json({
            success: true,
            deliveries
        });

    } catch (error) {
        console.error(
            "GET RIDER SUBSCRIPTION DELIVERIES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// GET SINGLE SUBSCRIPTION DELIVERY
// ============================================================

exports.getSubscriptionDeliveryById = async (req, res) => {
    try {
        const riderId = req.rider.riderId;
        const deliveryId = req.params.deliveryId;

        console.log("RIDER ID:", riderId);
        console.log("DELIVERY ID:", deliveryId);

        const delivery =
            await riderModel.getSubscriptionDeliveryByIdForRider(
                deliveryId,
                riderId
            );

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or not assigned to this rider"
            });
        }

        return res.status(200).json({
            success: true,
            delivery
        });

    } catch (error) {
        console.error(
            "GET SUBSCRIPTION DELIVERY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// UPDATE SUBSCRIPTION DELIVERY STATUS
// ============================================================

exports.updateSubscriptionDeliveryStatus = async (req, res) => {
    try {
        const riderId = req.rider.riderId;
        const deliveryId = req.params.deliveryId;
        const { status } = req.body;

        const allowedStatuses = [
            "Accepted",
            "Picked Up",
            "Out for Delivery",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery status"
            });
        }

        const delivery =
            await riderModel.getSubscriptionDeliveryByIdForRider(
                deliveryId,
                riderId
            );

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or not assigned to this rider"
            });
        }

        const statusFlow = {
            "Pending": "Accepted",
            "Accepted": "Picked Up",
            "Picked Up": "Out for Delivery",
            "Out for Delivery": "Delivered"
        };

        const expectedNextStatus =
            statusFlow[delivery.delivery_status];

        if (expectedNextStatus !== status) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid status transition. ` +
                    `Current status is "${delivery.delivery_status}". ` +
                    `Next status must be "${expectedNextStatus || "none"}".`
            });
        }

        const updatedDelivery =
            await riderModel.updateSubscriptionDeliveryStatus(
                deliveryId,
                riderId,
                status
            );

        if (!updatedDelivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery update failed"
            });
        }

        return res.status(200).json({
            success: true,
            message:
                `Delivery status updated to ${status}`,
            delivery: updatedDelivery
        });

    } catch (error) {
        console.error(
            "UPDATE SUBSCRIPTION DELIVERY STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ============================================================
// GET MY DELIVERIES
// ============================================================

exports.getMyDeliveries = async (req, res) => {
    try {
        const riderId = req.rider.riderId;

        console.log(
            "MY DELIVERIES RIDER ID:",
            riderId
        );

        const deliveries =
            await riderModel.getMyDeliveries(
                riderId
            );

        console.log(
            "MY DELIVERIES COUNT:",
            deliveries.length
        );

        return res.status(200).json({
            success: true,
            deliveries
        });

    } catch (error) {
        console.error(
            "GET MY DELIVERIES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch my deliveries"
        });
    }
};


// ============================================================
// GET TODAY'S SUBSCRIPTION DELIVERIES
// ============================================================

exports.getTodaySubscriptionDeliveries = async (req, res) => {
    try {
        const riderId = req.rider.riderId;

        const deliveries =
            await riderModel.getTodaySubscriptionDeliveries(
                riderId
            );

        return res.status(200).json({
            success: true,
            deliveries
        });

    } catch (error) {
        console.error(
            "GET TODAY SUBSCRIPTION DELIVERIES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch today's subscription deliveries"
        });
    }
};
exports.getAllRiders = async (req, res) => {

    try {

        const riders =
            await riderModel.getAllRiders();

        res.json({
            success: true,
            riders
        });

    } catch (error) {

        console.error(
            "GET ALL RIDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch riders"
        });

    }
};