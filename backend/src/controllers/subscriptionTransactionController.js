const transactionModel = require("../models/subscriptionTransactionModel");

// USER TRANSACTION HISTORY

exports.getMyTransactions = async(req,res)=>{
    try{
        const userId = req.user.id;
        const transactions =await transactionModel.getUserTransactions(userId);
        res.json({
            success:true,
            transactions
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch transactions"
        });
    }
};
// ADMIN ALL TRANSACTIONS

exports.getAllTransactions = async(req,res)=>{
    try{
        const transactions =await transactionModel.getAllTransactions();
        res.json({
            success:true,
            transactions
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch transactions"
        });
    }
};
// CREATE TRANSACTION

exports.createTransaction = async(req,res)=>{
    try{
        const transaction =await transactionModel.createTransaction(req.body);
        res.json({
            success:true,
            message:"Transaction created",
            transaction
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Transaction failed"
        });
    }
};