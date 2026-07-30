const notificationModel = require("../models/notificationModel");

// GET notifications
exports.getNotifications = async(req,res)=>{
try{
const notifications =await notificationModel.getNotifications();
res.json({
success:true,
notifications
});
}
catch(error){
res.status(500).json({
success:false,
message:error.message
});
}
};
// CREATE notification

exports.createNotification = async(req,res)=>{
try{
const {type,message}=req.body;
const notification =await notificationModel.createNotification(type,message);
res.json({
success:true,
notification
});
}
catch(error){
res.status(500).json({
success:false,
message:error.message
});
}
};