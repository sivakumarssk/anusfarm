
// const {
//   getAllSubscriptions,
//   updateSubscriptionStatus,
//   getUserSubscriptions,
//   pauseSubscription,
//   resumeSubscription,
//   cancelSubscription,
//   getSubscriptionCalendar,
//   generateDeliverySchedule,
//   updateSubscriptionById
// } = require("../models/subscriptionModel");


// exports.getSubscriptions = async(req,res)=>{
//     try{
//         const data = await getAllSubscriptions();
//         res.json({
//             success:true,
//             subscriptions:data
//         });
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//             message:"Server Error"
//         });
//     }
// };
// exports.changeStatus = async(req,res)=>{
//     try{
//         const {id}=req.params;
//         const {status}=req.body;
//         const result =
//         await updateSubscriptionStatus(id,status);
//         res.json({
//             success:true,
//             subscription:result
//         });
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//             message:"Server Error"
//         });
//     }
// };
// exports.createSubscription = async(req,res)=>{
// try{
// const user_id = req.user.id;
// const {plan,frequency,delivery_time,selected_days,wallet_amount,payment_method,next_delivery_date,items}=req.body;
// const result = await pool.query(
// `INSERT INTO subscriptions
// (user_id,plan,frequency,delivery_time,selected_days,wallet_amount,payment_method,start_date,next_delivery_date,status)
// VALUES($1,$2,$3,$4,$5,$6,$7,CURRENT_DATE,$8,'Active')
// RETURNING *
// `,
// [user_id,plan,frequency,delivery_time,selected_days,wallet_amount,payment_method,next_delivery_date]
// );
// const subscription = result.rows[0];
// await generateDeliverySchedule(
//   subscription.id,
//   frequency,
//   subscription.start_date,
//   items
// );
// // SAVE SUBSCRIPTION ITEMS HERE
// for(let item of items || []){
// await pool.query(
// `INSERT INTO subscription_items
// (subscription_id,product_id,product_name,quantity,price)
// VALUES($1,$2,$3,$4,$5)
// `,
// [subscription.id,item.id,item.name,item.quantity,item.price]
// );
// }
// res.json({
// success:true,
// subscription:subscription
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
// exports.mySubscriptions = async (req, res) => {

//   try {

//     const data =
//       await getUserSubscriptions(req.user.id);

//     res.json({
//       success: true,
//       subscriptions: data,
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }

// };
// exports.pause = async (req, res) => {

//   const { id } = req.params;

//   const {
//     pause_from,
//     pause_to,
//   } = req.body;

//   const data =
//     await pauseSubscription(
//       id,
//       pause_from,
//       pause_to
//     );

//   res.json({
//     success: true,
//     subscription: data,
//   });

// };
// exports.resume = async (req, res) => {

//   const data =
//     await resumeSubscription(
//       req.params.id
//     );

//   res.json({
//     success: true,
//     subscription: data,
//   });

// };
// exports.cancel = async (req, res) => {

//   const data =
//     await cancelSubscription(
//       req.params.id
//     );

//   res.json({
//     success: true,
//     subscription: data,
//   });

// };
// exports.updateSubscription = async (req, res) => {

//   try {

//     const { id } = req.params;

//     const {
//       frequency,
//       delivery_time,
//       next_delivery_date
//     } = req.body;

//     const data = await updateSubscriptionById(
//       id,
//       frequency,
//       delivery_time,
//       next_delivery_date
//     );

//     res.json({
//       success: true,
//       subscription: data
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }

// };
// exports.calendar = async (req, res) => {

//   try {

//     const data =
//       await getSubscriptionCalendar(
//         req.params.id
//       );

//     res.json({
//       success: true,
//       calendar: data
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }

// };

const pool = require("../config/db");

const {
  getAllSubscriptions,
  updateSubscriptionStatus,
  getUserSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getSubscriptionCalendar,
  generateDeliverySchedule,
  updateSubscriptionById
} = require("../models/subscriptionModel");


// ADMIN - Get All Subscriptions
exports.getSubscriptions = async (req, res) => {
  try {

    const data = await getAllSubscriptions();

    res.json({
      success: true,
      subscriptions: data
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};



// ADMIN - Change Subscription Status
exports.changeStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;


    const result =
      await updateSubscriptionStatus(
        id,
        status
      );


    res.json({
      success: true,
      subscription: result
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};




// USER - Create Subscription
exports.createSubscription = async (req,res)=>{

try{


const user_id = req.user.id;


const {
plan,
frequency,
delivery_time,
selected_days,
wallet_amount,
payment_method,
next_delivery_date,
items
}=req.body;



const result = await pool.query(

`
INSERT INTO subscriptions
(
user_id,
plan,
frequency,
delivery_time,
selected_days,
wallet_amount,
payment_method,
start_date,
next_delivery_date,
status
)

VALUES
(
$1,$2,$3,$4,$5,$6,$7,
CURRENT_DATE,
$8,
'Active'
)

RETURNING *
`,

[
user_id,
plan,
frequency,
delivery_time,
selected_days,
wallet_amount,
payment_method,
next_delivery_date
]

);



const subscription = result.rows[0];



// Generate delivery dates

await generateDeliverySchedule(

subscription.id,
frequency,
subscription.start_date,
items || []

);



// Save subscription products

for(const item of items || []){


await pool.query(

`
INSERT INTO subscription_items
(
subscription_id,
product_id,
product_name,
quantity,
price
)

VALUES
($1,$2,$3,$4,$5)

`,

[
subscription.id,
item.id,
item.name,
item.quantity,
item.price
]

);


}



res.status(201).json({

success:true,

subscription

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





// USER - My Subscriptions

exports.mySubscriptions = async(req,res)=>{

try{


const data =
await getUserSubscriptions(
req.user.id
);



res.json({

success:true,

subscriptions:data

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});


}


};





// PAUSE SUBSCRIPTION

exports.pause = async(req,res)=>{

try{
const {pause_from,pause_to}=req.body;



const data =
await pauseSubscription(

req.params.id,

pause_from,

pause_to

);



res.json({

success:true,

subscription:data

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};






// RESUME SUBSCRIPTION

exports.resume = async(req,res)=>{


try{


const data =
await resumeSubscription(

req.params.id

);



res.json({

success:true,

subscription:data

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});


}


};






// CANCEL SUBSCRIPTION

exports.cancel = async(req,res)=>{


try{


const data =
await cancelSubscription(

req.params.id

);



res.json({

success:true,

subscription:data

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message

});


}


};






// UPDATE SUBSCRIPTION

exports.updateSubscription = async(req,res)=>{


try{


const {
frequency,
delivery_time,
next_delivery_date
}=req.body;



const data =
await updateSubscriptionById(

req.params.id,

frequency,

delivery_time,

next_delivery_date

);



res.json({

success:true,

subscription:data

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







// DELIVERY CALENDAR

exports.calendar = async(req,res)=>{


try{


const data =
await getSubscriptionCalendar(

req.params.id

);



res.json({

success:true,

calendar:data

});


}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};