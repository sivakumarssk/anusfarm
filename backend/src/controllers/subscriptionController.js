const {getAllSubscriptions,updateSubscriptionStatus}=require("../models/subscriptionModel");

exports.getSubscriptions = async(req,res)=>{

    try{
 const data = await getAllSubscriptions();
        res.json({
            success:true,
            subscriptions:data
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

exports.changeStatus = async(req,res)=>{
    try{
        const {id}=req.params;
        const {status}=req.body;
        const result =await updateSubscriptionStatus(id,status);
        res.json({
            success:true,
            subscription:result
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }

};