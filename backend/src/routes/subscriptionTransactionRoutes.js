const express = require("express");

const router = express.Router();


const {

getMyTransactions,

getAllTransactions,

createTransaction


} = require("../controllers/subscriptionTransactionController");


const authMiddleware = require("../middleware/authMiddleware");



// User transaction history

router.get(
"/my",
authMiddleware,
getMyTransactions
);



// Admin all transactions

router.get(
"/admin",
authMiddleware,
getAllTransactions
);



// Create transaction

router.post(
"/create",
authMiddleware,
createTransaction
);



module.exports = router;