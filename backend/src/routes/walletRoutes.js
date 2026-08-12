const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {getWallet,addMoney,getTransactions,payUsingWallet} = require("../controllers/walletController");


router.get( "/",authMiddleware,getWallet);


router.post( "/add-money", authMiddleware, addMoney);


router.get( "/transactions",authMiddleware,getTransactions);


router.post("/pay",authMiddleware,payUsingWallet);


module.exports = router;