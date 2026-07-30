const { getAllOrders,getOrderStats} = require("../models/orderModel");



exports.getOrders = async(req,res)=>{
    try{
        const orders = await getAllOrders();
        const stats = await getOrderStats();
        res.json({
            success:true,
            summary:{
                total: Number(stats.total),
                delivered:Number(stats.delivered),
                pending:Number(stats.pending),
                cancelled:Number(stats.cancelled)
            },
            orders:orders
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};