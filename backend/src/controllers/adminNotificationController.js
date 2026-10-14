const {getAdminNotifications,getUnreadCount,markAsRead} = require("../models/adminNotificationModel");



exports.getNotifications = async(req,res)=>{
    try{
        const notifications = await getAdminNotifications();
        res.json({ success:true, notifications});
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
exports.getUnreadCount = async(req,res)=>{
    try{
        const count = await getUnreadCount();
        res.json({
            success:true,
            count:Number(count)
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
exports.markRead = async(req,res)=>{
    try{
        await markAsRead();
        res.json({
            success:true,
            message:"Marked as read"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};