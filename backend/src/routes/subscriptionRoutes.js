const express=require("express");

const router=express.Router();


const {getSubscriptions,changeStatus}=require("../controllers/subscriptionController");


router.get("/",getSubscriptions);

router.put("/:id/status",changeStatus);



module.exports=router;