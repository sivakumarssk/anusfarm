// const { getDistance } = require("../utils/distance");
const { getDistance } = require("../utils/distance");
const { getLatLngFromAddress } = require("../utils/geocode");
const { getAllOrders,   getOrderStats, getPendingStats, createOrder, getMyOrders,
  getOrderById,updateOrderStatus,deleteOrder, assignRiderToOrder,cancelMyOrder, cancelOrderByAdmin,} = require("../models/orderModel");

const notificationModel = require("../models/notificationModel");
const pool = require("../config/db");

exports.getOrders = async (req, res) => {
    try {

        const orders = await getAllOrders();
        const stats = await getOrderStats();
        const pendingStats = await getPendingStats();

        res.json({
            success: true,

            summary: {
                total: Number(stats.total),
                delivered: Number(stats.delivered),
                pending: Number(stats.pending),
                cancelled: Number(stats.cancelled),

                instant_pending: pendingStats.instant_pending,
                subscription_pending: pendingStats.subscription_pending
            },

            orders: orders
        });

    } catch (error) {

        console.log("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPendingStats = async (req, res) => {
    try {

        const stats = await getPendingStats();

        res.json({
            success: true,
            instant_pending: stats.instant_pending,
            subscription_pending: stats.subscription_pending
        });

    } catch (error) {

        console.error("GET PENDING STATS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {items,payment_method,address_id} = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({
        success:false,
        message:"Cart is empty"
      });
    }

  
// Get selected address
const addressResult = await pool.query(
  `
  SELECT
    id,
    full_address,
    latitude,
    longitude
  FROM addresses
  WHERE id = $1
  AND user_id = $2
  `,
  [
    address_id,
    userId
  ]
);

if (addressResult.rows.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Address not found"
  });
}

const selectedAddress = addressResult.rows[0];

let latitude = selectedAddress.latitude;
let longitude = selectedAddress.longitude;

// If saved address does not have coordinates,
// geocode the saved address.
if (latitude == null || longitude == null) {
  console.log("Saved address has no coordinates. Geocoding...");

  try {
    const { getLatLngFromAddress } = require("../utils/geocode");

    const location = await getLatLngFromAddress(
      selectedAddress.full_address
    );

    latitude = location.lat;
    longitude = location.lng;

    // Save coordinates for future orders
    await pool.query(
      `
      UPDATE addresses
      SET
        latitude = $1,
        longitude = $2
      WHERE id = $3
      AND user_id = $4
      `,
      [
        latitude,
        longitude,
        address_id,
        userId
      ]
    );

    console.log("Geocoded Latitude =", latitude);
    console.log("Geocoded Longitude =", longitude);

  } catch (error) {
    console.log("GEOCODING ERROR =", error);

    return res.status(400).json({
      success: false,
      message:
        "Unable to verify delivery location. Please edit the address and try again."
    });
  }
}

const FARM_LAT = 16.9947802;
const FARM_LNG = 79.9749826;

const distance = getDistance(
  FARM_LAT,
  FARM_LNG,
  Number(latitude),
  Number(longitude)
);

console.log("========== DISTANCE CHECK ==========");
console.log("FARM LAT =", FARM_LAT);
console.log("FARM LNG =", FARM_LNG);
console.log("CUSTOMER LAT =", latitude);
console.log("CUSTOMER LNG =", longitude);
console.log("DISTANCE =", distance, "KM");
console.log("====================================");

if (distance > 20) {
  return res.status(400).json({
    success: false,
    message: "Sorry! Delivery is available only within 20 KM of our farm."
  });
}


    
    const orderId = await createOrder(
      userId,
      items,
      payment_method,
      address_id
    );


    await notificationModel.createNotification(
      userId,
      "Order",
      `Your order #${orderId} has been placed successfully`
    );


    res.status(201).json({
      success:true,
      message:"Order placed successfully",
      order_id:orderId
    });

} catch(error){

    console.log("PLACE ORDER ERROR:", error);

    if (error.message.includes("available for instant purchase")) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success: false,
        message: error.message
    });

}
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await getMyOrders(req.user.id);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.cancelMyOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.user.id;

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await cancelMyOrder(orderId, userId);

        try {
            await notificationModel.createNotification(
                userId,
                "Order",
                `Your order #${order.id} has been cancelled successfully.`
            );
        } catch (notificationError) {
            console.error(
                "CANCELLATION NOTIFICATION ERROR:",
                notificationError
            );
        }

        return res.json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {
        console.error("CANCEL ORDER ERROR:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Unable to cancel order",
        });
    }
};
exports.getSingleOrder = async(req,res)=>{

try{

const order = await getOrderById(req.params.id);


if(!order){
return res.status(404).json({
success:false,
message:"Order not found"
});
}


res.json({
success:true,
order
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
exports.updateOrderStatus = async(req,res)=>{

try{

const {status}=req.body;

const orderId=req.params.id;


const order = await updateOrderStatus(
    orderId,
    status
);
if(!order){
return res.status(404).json({
success:false,
message:"Order not found"
});
}
await notificationModel.createNotification(
    order.user_id,
    "Order Status",
    `Your order #${order.id} has been ${status}.`
);

res.json({
success:true,
message:"Order status updated",
order

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
exports.deleteOrder = async(req,res)=>{

    try{

        const orderId = req.params.id;


        const order = await deleteOrder(orderId);


        if(!order){

            return res.status(404).json({
                success:false,
                message:"Order not found"
            });

        }


        res.json({

            success:true,
            message:"Order deleted successfully",
            order

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
exports.assignRider = async (req, res) => {
    try {

        const orderId = req.params.id;
        const { rider_id } = req.body;

        if (!rider_id) {
            return res.status(400).json({
                success: false,
                message: "Rider ID is required"
            });
        }

        // Check rider exists and is active
        const riderResult = await pool.query(
            `
            SELECT id, name, phone, vehicle_type, vehicle_number, status
            FROM riders
            WHERE id = $1
            AND is_active = true
            `,
            [rider_id]
        );

        if (riderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Rider not found or inactive"
            });
        }

        // Assign rider to order
        const order = await assignRiderToOrder(
            orderId,
            rider_id
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Notify customer
        await notificationModel.createNotification(
            order.user_id,
            "Order",
            `Rider has been assigned to your order #${order.id}`
        );

        res.json({
            success: true,
            message: "Rider assigned successfully",
            order,
            rider: riderResult.rows[0]
        });

    } catch (error) {

        console.error("ASSIGN RIDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getRiders = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                id,
                name,
                phone,
                vehicle_type,
                vehicle_number,
                status
            FROM riders
            WHERE is_active = true
            ORDER BY id
        `);

        res.json({
            success: true,
            riders: result.rows
        });

    } catch (error) {

        console.error("GET RIDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch riders"
        });
    }
};
// ==========================================
// ADMIN CANCEL ORDER
// ==========================================

exports.cancelOrderByAdmin = async (req, res) => {
    try {

        const orderId = Number(req.params.id);

        if (
            !Number.isInteger(orderId) ||
            orderId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await cancelOrderByAdmin(
            orderId
        );

        // ==========================================
        // NOTIFY CUSTOMER
        // ==========================================

        try {

            await notificationModel.createNotification(
                order.user_id,
                "Order",
                `Your order #${order.id} has been cancelled by admin.`
            );

        } catch (notificationError) {

            console.error(
                "ADMIN CANCELLATION NOTIFICATION ERROR:",
                notificationError
            );
        }

        return res.json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });

    } catch (error) {

        console.error(
            "ADMIN CANCEL ORDER ERROR:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Unable to cancel order",
        });
    }
};