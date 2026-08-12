const {
    getAllRiders,
    getSubscriptionDeliveriesForAdmin,
    assignRiderToDelivery
} = require("../models/adminDeliveryModel");


// ============================================================
// GET RIDERS
// ============================================================

exports.getRiders = async (req, res) => {

    try {

        const riders = await getAllRiders();

        res.json({
            success: true,
            riders
        });

    } catch (error) {

        console.error("GET RIDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get riders"
        });

    }
};


// ============================================================
// GET SUBSCRIPTION DELIVERIES
// ============================================================

exports.getSubscriptionDeliveries = async (req, res) => {

    try {

        const deliveries =
            await getSubscriptionDeliveriesForAdmin();

        res.json({
            success: true,
            deliveries
        });

    } catch (error) {

        console.error(
            "GET SUBSCRIPTION DELIVERIES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to get subscription deliveries"
        });

    }
};


// ============================================================
// ASSIGN RIDER
// ============================================================

exports.assignRider = async (req, res) => {

    try {

        const { deliveryId, riderId } = req.body;

        if (!deliveryId || !riderId) {

            return res.status(400).json({
                success: false,
                message: "deliveryId and riderId are required"
            });

        }

        const delivery =
            await assignRiderToDelivery(
                deliveryId,
                riderId
            );

        if (!delivery) {

            return res.status(404).json({
                success: false,
                message: "Delivery not found"
            });

        }

        res.json({
            success: true,
            message: "Rider assigned successfully",
            delivery
        });

    } catch (error) {

        console.error(
            "ASSIGN RIDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to assign rider"
        });

    }
};