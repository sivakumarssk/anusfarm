// const walletModel = require("../models/walletModel");
// const {createOrder} = require("../models/orderModel");
// // Wallet Balance
// exports.getWallet = async (req, res) => {
//   try {
//     const wallet = await walletModel.getWallet(req.user.id);

//     res.json({
//       success: true,
//       wallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Add Money
// exports.addMoney = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const wallet = await walletModel.addMoney(
//       req.user.id,
//       amount
//     );

//     res.json({
//       success: true,
//       wallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Transactions
// exports.getTransactions = async (req, res) => {
//   try {
//     const transactions =
//       await walletModel.getTransactions(req.user.id);

//     res.json({
//       success: true,
//       transactions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // Wallet Balance
// exports.getWallet = async (req, res) => {
//   try {
//     const wallet = await walletModel.getWallet(req.user.id);

//     res.json({
//       success: true,
//       wallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Add Money
// exports.addMoney = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const wallet = await walletModel.addMoney(
//       req.user.id,
//       amount
//     );

//     res.json({
//       success: true,
//       wallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Transactions
// exports.getTransactions = async (req, res) => {
//   try {
//     const transactions =
//       await walletModel.getTransactions(req.user.id);

//     res.json({
//       success: true,
//       transactions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// exports.payUsingWallet = async(req,res)=>{

// try{

// const userId = req.user.id;

// const {
//  amount,
//  items
// }=req.body;


// if(!items || items.length===0){

// return res.status(400).json({
//  success:false,
//  message:"No products found"
// });

// }


// // 1. Check wallet balance
// const wallet = await walletModel.getWallet(userId);


// if(!wallet){

// return res.status(400).json({
//  success:false,
//  message:"Wallet not found"
// });

// }


// if(Number(wallet.balance) < Number(amount)){

// return res.status(400).json({
//  success:false,
//  message:"Insufficient wallet balance"
// });

// }


// // 2. Create Order
// const orderId = await createOrder(
//  userId,
//  items,
//  "wallet"
// );


// // 3. Deduct wallet money
// await walletModel.deductMoney(
//  userId,
//  amount
// );


// // 4. Add wallet transaction history
// await walletModel.createTransaction(
//  userId,
//  amount,
//  "debit",
//  `Order Payment #${orderId}`
// );



// res.json({

// success:true,

// message:"Wallet payment successful",

// order_id:orderId

// });


// }
// catch(error){

// console.log(error);

// res.status(500).json({

// success:false,

// message:error.message

// });

// }

// };

const walletModel = require("../models/walletModel");
const { createOrder } = require("../models/orderModel");


// Get Wallet Balance
exports.getWallet = async (req, res) => {
  try {

    const wallet = await walletModel.getWallet(req.user.id);

    res.json({
      success:true,
      wallet
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};


// Add Money
exports.addMoney = async(req,res)=>{

try{

const {amount}=req.body;

const wallet = await walletModel.addMoney(
  req.user.id,
  amount
);


res.json({
 success:true,
 wallet
});


}
catch(error){

res.status(500).json({
 success:false,
 message:error.message
});

}

};


// Transaction History
exports.getTransactions = async(req,res)=>{

try{

const transactions =
await walletModel.getTransactions(req.user.id);


res.json({
 success:true,
 transactions
});


}
catch(error){

res.status(500).json({
 success:false,
 message:error.message
});

}

};



// Pay Using Wallet
exports.payUsingWallet = async(req,res)=>{

try{

const userId = req.user.id;

console.log("TOKEN USER ID =", userId);


const {
 amount,
 items
}=req.body;



if(!items || items.length===0){

return res.status(400).json({
 success:false,
 message:"No products found"
});

}



// Check wallet balance
const wallet =
await walletModel.getWallet(userId);

console.log("FOUND WALLET =", wallet);



if(!wallet){

return res.status(400).json({
 success:false,
 message:"Wallet not found"
});

}



if(Number(wallet.balance) < Number(amount)){

return res.status(400).json({
 success:false,
 message:"Insufficient wallet balance"
});

}



// Create order
const orderId =
await createOrder(
 userId,
 items,
 "wallet"
);



// Deduct wallet balance
await walletModel.deductMoney(
 userId,
 amount
);



// Create transaction history
await walletModel.createTransaction(
 userId,
 amount,
 "debit",
 `Order Payment #${orderId}`
);



res.json({

success:true,

message:"Wallet payment successful",

order_id:orderId

});


}
catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};