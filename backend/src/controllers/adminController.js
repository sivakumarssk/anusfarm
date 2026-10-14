const { getAdminNotifications} = require("../models/adminModel");


exports.getNotifications = async(req,res)=>{
    try{
        const notifications = await getAdminNotifications();
        res.json({ success:true,notifications});
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};