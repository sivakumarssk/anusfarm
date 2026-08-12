const notificationModel = require("../models/notificationModel");


// GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {

    console.log("CONTROLLER USER =", req.user);

    try {

        const notifications = await notificationModel.getNotifications(
            req.user.id
        );

        res.json({
            success: true,
            notifications
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// CREATE notification API
exports.createNotification = async (req, res) => {

    try {

        const { type, message } = req.body;

        const notification = await notificationModel.createNotification(
            req.user.id,
            type,
            message
        );

        res.json({
            success: true,
            notification
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};




// INTERNAL FUNCTION
// Use this from orderController and authController
exports.addNotification = async (
    user_id,
    type,
    message
) => {

    try {

        const notification =
            await notificationModel.createNotification(
                user_id,
                type,
                message
            );

        return notification;


    } catch (error) {

        console.log(
            "Notification Error:",
            error.message
        );

    }

};




// GET UNREAD COUNT
exports.unreadCount = async (req, res) => {

    try {

        const count =
            await notificationModel.getUnreadCount(
                req.user.id
            );


        res.json({
            success: true,
            count: Number(count)
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};




// MARK AS READ
exports.readNotifications = async (req, res) => {

    try {

        await notificationModel.markAsRead(
            req.user.id
        );


        res.json({
            success: true,
            message: "Notifications marked as read"
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};