const {
    getAllRiders,
    addRider,
    updateRider,
    updateRiderActiveStatus
} = require("../models/riderAdminModel");

// ============================================================
// GET ALL RIDERS
// ============================================================

exports.getAllAdminRiders = async (req, res) => {

    try {

        const riders = await getAllRiders();

        res.json({
            success: true,
            riders
        });

    } catch (error) {

        console.error(
            "GET ADMIN RIDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// ADD RIDER
// ============================================================

exports.createAdminRider = async (req, res) => {

    try {

        const {
            name,
            phone,
            vehicle_type,
            vehicle_number
        } = req.body;

        if (!name || !phone) {

            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }

        // Check duplicate phone

        const existingRider = await getAllRiders();

        const alreadyExists = existingRider.find(
            rider => rider.phone === phone
        );

        if (alreadyExists) {

            return res.status(400).json({
                success: false,
                message: "Rider with this phone already exists"
            });
        }

        const rider = await addRider(
            name,
            phone,
            vehicle_type || null,
            vehicle_number || null
        );

        res.status(201).json({
            success: true,
            message: "Rider added successfully",
            rider
        });

    } catch (error) {

        console.error(
            "ADD RIDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// UPDATE RIDER
// ============================================================

exports.editAdminRider = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            phone,
            vehicle_type,
            vehicle_number
        } = req.body;

        if (!name || !phone) {

            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }

        const rider = await updateRider(
            id,
            name,
            phone,
            vehicle_type || null,
            vehicle_number || null
        );

        if (!rider) {

            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        res.json({
            success: true,
            message: "Rider updated successfully",
            rider
        });

    } catch (error) {

        console.error(
            "UPDATE RIDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// ACTIVATE / DEACTIVATE RIDER
// ============================================================

exports.toggleAdminRider = async (req, res) => {

    try {

        const { id } = req.params;

        const { is_active } = req.body;

        const rider = await updateRiderActiveStatus(
            id,
            is_active
        );

        if (!rider) {

            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        res.json({
            success: true,
            message: is_active
                ? "Rider activated successfully"
                : "Rider deactivated successfully",
            rider
        });

    } catch (error) {

        console.error(
            "TOGGLE RIDER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};