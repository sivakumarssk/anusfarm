
const transactionModel = require("../models/subscriptionTransactionModel");
const pool = require("../config/db");

const {
    getAllSubscriptions,
    updateSubscriptionStatus,
    getUserSubscriptions,
    getSubscriptionById,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getSubscriptionCalendar,
    generateDeliverySchedule,
    updateSubscriptionById,
    deleteSubscription,
    skipDelivery: skipDeliveryModel,
    assignSubscriptionDeliveryRider,
} = require("../models/subscriptionModel");


// ============================================================
// ADMIN - GET ALL SUBSCRIPTIONS
// ============================================================

exports.getSubscriptions = async (req, res) => {
    try {

        const data = await getAllSubscriptions();

        res.json({
            success: true,
            subscriptions: data
        });

    } catch (error) {

        console.log("GET ALL SUBSCRIPTIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// ADMIN - CHANGE SUBSCRIPTION STATUS
// ============================================================

exports.changeStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const result = await updateSubscriptionStatus(
            id,
            status
        );

        res.json({
            success: true,
            subscription: result
        });

    } catch (error) {

        console.log(
            "CHANGE SUBSCRIPTION STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - CREATE SUBSCRIPTION
// ============================================================

// exports.createSubscription = async (req, res) => {

//     try {

//         const user_id = req.user.id;

//         const {
//             plan,
//             frequency,
//             delivery_time,
//             selected_days,
//             wallet_amount,
//             payment_method,
//             next_delivery_date,
//               address_id,
//             items
//         } = req.body;

// const addressResult = await pool.query(
//     `
//     SELECT id
//     FROM addresses
//     WHERE id = $1
//     AND user_id = $2
//     `,
//     [address_id, user_id]
// );

// if (addressResult.rows.length === 0) {
//     return res.status(400).json({
//         success: false,
//         message: "Invalid address selected"
//     });
// }
//         // ------------------------------------------------------
//         // CREATE SUBSCRIPTION
//         // ------------------------------------------------------

//         const result = await pool.query(
//             `
//             INSERT INTO subscriptions
//             (
//                 user_id,
//                 plan,
//                 frequency,
//                 delivery_time,
//                 selected_days,
//                 wallet_amount,
//                 payment_method,
//                 start_date,
//                 next_delivery_date,
//                 status,
//                    address_id
//             )
//             VALUES
//             (
//                 $1,
//                 $2,
//                 $3,
//                 $4,
//                 $5,
//                 $6,
//                 $7,
//                 CURRENT_DATE,
//                 $8,
//                 'Active',
//                  $9
//             )
//             RETURNING *
//             `,
//             [
//                 user_id,
//                 plan,
//                 frequency,
//                 delivery_time,
//                 selected_days,
//                 wallet_amount,
//                 payment_method,
//                 next_delivery_date,
//                  address_id
//             ]
//         );


//         const subscription = result.rows[0];


//         // ------------------------------------------------------
//         // GENERATE DELIVERY SCHEDULE
//         // ------------------------------------------------------

//         // await generateDeliverySchedule(
//         //     subscription.id,
//         //     frequency,
//         //     subscription.start_date,
//         //     items || []
//         // );
// await generateDeliverySchedule(
//     subscription.id,
//     frequency,
//     subscription.next_delivery_date,
//     items || []
// );

//         // ------------------------------------------------------
//         // SAVE SUBSCRIPTION PRODUCTS
//         // ------------------------------------------------------

//         for (const item of items || []) {

//             await pool.query(
//                 `
//                 INSERT INTO subscription_items
//                 (
//                     subscription_id,
//                     product_id,
//                     product_name,
//                     quantity,
//                     price
//                 )
//                 VALUES
//                 (
//                     $1,
//                     $2,
//                     $3,
//                     $4,
//                     $5
//                 )
//                 `,
//                 [
//                     subscription.id,
//                     item.id,
//                     item.name,
//                     item.quantity,
//                     item.price
//                 ]
//             );

//         }


//         // ------------------------------------------------------
//         // CREATE TRANSACTION
//         // ------------------------------------------------------

//         await transactionModel.createTransaction({

//             subscription_id: subscription.id,

//             user_id: user_id,

//             transaction_type: "Initial Payment",

//             amount: wallet_amount,

//             payment_method: payment_method,

//             payment_status: "Success",

//             transaction_id:
//                 "SUB" + Date.now(),

//             description:
//                 `${plan} Subscription Payment`
//         });


//         // ------------------------------------------------------
//         // RESPONSE
//         // ------------------------------------------------------

//         res.status(201).json({
//             success: true,
//             subscription
//         });


//     } catch (error) {

//         console.log(
//             "CREATE SUBSCRIPTION ERROR:",
//             error
//         );

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
exports.createSubscription = async (req, res) => {
    try {

        const user_id = req.user.id;

        const {
            plan,
            frequency,
            delivery_time,
            selected_days,
            wallet_amount,
            payment_method,
            next_delivery_date,
            address_id,
            items
        } = req.body;

        console.log("========== CREATE SUBSCRIPTION ==========");
        console.log("USER ID =", user_id);
        console.log("ADDRESS ID =", address_id);
        console.log("ITEMS =", items);

        // ==========================================
        // VALIDATE ADDRESS
        // ==========================================

        if (!address_id) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }

        const addressResult = await pool.query(
            `
            SELECT
                id,
                user_id,
                address_type,
                full_address,
                latitude,
                longitude,
                phone
            FROM addresses
            WHERE id = $1
            AND user_id = $2
            `,
            [
                address_id,
                user_id
            ]
        );

        if (addressResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid address selected"
            });
        }

        const selectedAddress = addressResult.rows[0];

        console.log(
            "SELECTED ADDRESS =",
            selectedAddress
        );

        // ==========================================
        // CREATE SUBSCRIPTION
        // ==========================================

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
                status,
                address_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                CURRENT_DATE,
                $8,
                'Active',
                $9
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
                next_delivery_date,
                address_id
            ]
        );

        const subscription = result.rows[0];

        console.log(
            "CREATED SUBSCRIPTION =",
            subscription
        );

        // ==========================================
        // SAVE SUBSCRIPTION PRODUCTS
        // ==========================================

        for (const item of items || []) {

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
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
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

        // ==========================================
        // GENERATE DELIVERY SCHEDULE
        // ==========================================

        await generateDeliverySchedule(
            subscription.id,
            frequency,
            subscription.next_delivery_date,
            items || []
        );

        // ==========================================
        // CREATE TRANSACTION
        // ==========================================

        await transactionModel.createTransaction({

            subscription_id:
                subscription.id,

            user_id:
                user_id,

            transaction_type:
                "Initial Payment",

            amount:
                wallet_amount,

            payment_method:
                payment_method,

            payment_status:
                "Success",

            transaction_id:
                "SUB" + Date.now(),

            description:
                `${plan} Subscription Payment`
        });

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({
            success: true,
            subscription,
            address: selectedAddress
        });

    } catch (error) {

        console.log(
            "CREATE SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// USER - MY SUBSCRIPTIONS
// ============================================================

exports.mySubscriptions = async (req, res) => {

    try {

        const data =
            await getUserSubscriptions(
                req.user.id
            );

        res.json({
            success: true,
            subscriptions: data
        });

    } catch (error) {

        console.log(
            "MY SUBSCRIPTIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - GET SINGLE SUBSCRIPTION DETAILS
// ============================================================

exports.getSubscriptionById = async (req, res) => {

    try {

        const { id } = req.params;

        console.log(
            "GET SUBSCRIPTION DETAILS ID:",
            id
        );


        // ------------------------------------------------------
        // VALIDATE ID
        // ------------------------------------------------------

        if (!id || isNaN(Number(id))) {

            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID"
            });
        }


        // ------------------------------------------------------
        // GET SUBSCRIPTION
        // ------------------------------------------------------

        const data =
            await getSubscriptionById(
                Number(id)
            );


        // ------------------------------------------------------
        // NOT FOUND
        // ------------------------------------------------------

        if (!data) {

            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        console.log(
            "SUBSCRIPTION DETAILS:",
            JSON.stringify(
                data,
                null,
                2
            )
        );

        res.json({
            success: true,
            subscription: data
        });


    } catch (error) {

        console.error(
            "GET SUBSCRIPTION DETAILS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - PAUSE SUBSCRIPTION
// ============================================================

exports.pause = async (req, res) => {

    try {

        const {
            pause_from,
            pause_to
        } = req.body;


        if (!pause_from || !pause_to) {

            return res.status(400).json({
                success: false,
                message:
                    "pause_from and pause_to are required"
            });
        }


        const data =
            await pauseSubscription(
                req.params.id,
                pause_from,
                pause_to
            );


        res.json({
            success: true,
            subscription: data
        });


    } catch (error) {

        console.log(
            "PAUSE SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - RESUME SUBSCRIPTION
// ============================================================

exports.resume = async (req, res) => {

    try {

        const data =
            await resumeSubscription(
                req.params.id
            );


        res.json({
            success: true,
            subscription: data
        });


    } catch (error) {

        console.log(
            "RESUME SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - CANCEL SUBSCRIPTION
// ============================================================

exports.cancel = async (req, res) => {

    try {

        const data =
            await cancelSubscription(
                req.params.id
            );


        res.json({
            success: true,
            subscription: data
        });


    } catch (error) {

        console.log(
            "CANCEL SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - UPDATE SUBSCRIPTION
// ============================================================

exports.updateSubscription = async (req, res) => {

    try {

        const {
            frequency,
            delivery_time,
            next_delivery_date
        } = req.body;


        const data =
            await updateSubscriptionById(
                req.params.id,
                frequency,
                delivery_time,
                next_delivery_date
            );


        res.json({
            success: true,
            subscription: data
        });


    } catch (error) {

        console.log(
            "UPDATE SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - DELIVERY CALENDAR
// ============================================================

exports.calendar = async (req, res) => {

    try {

        const { id } = req.params;

        console.log(
            "CALENDAR SUBSCRIPTION ID:",
            id
        );


        if (!id || isNaN(Number(id))) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid subscription ID"
            });
        }


        const data =
            await getSubscriptionCalendar(
                Number(id)
            );


        res.json({
            success: true,
            calendar: data
        });


    } catch (error) {

        console.log(
            "CALENDAR ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - DELETE SUBSCRIPTION
// ============================================================

exports.deleteSubscription = async (req, res) => {

    try {

        const { id } = req.params;


        const data =
            await deleteSubscription(id);


        if (!data) {

            return res.status(404).json({
                success: false,
                message:
                    "Subscription not found"
            });
        }


        res.json({
            success: true,
            message:
                "Subscription deleted successfully",
            subscription: data
        });


    } catch (error) {

        console.log(
            "DELETE SUBSCRIPTION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - GET PAUSED SUBSCRIPTIONS
// ============================================================

exports.getPausedSubscriptions = async (
    req,
    res
) => {

    try {

        console.log(
            "USER FROM TOKEN:",
            req.user
        );


        const userId =
            req.user.id;


        const result =
            await pool.query(
                `
                SELECT

                    s.id,
                    s.plan,
                    s.frequency,
                    s.delivery_time,
                    s.selected_days,
                    s.wallet_amount,
                    s.payment_method,
                    s.status,
                    s.start_date,
                    s.next_delivery_date,
                    s.pause_from,
                    s.pause_to,

                    COALESCE(
                        json_agg(
                            json_build_object(

                                'product_name',
                                si.product_name,

                                'quantity',
                                si.quantity,

                                'price',
                                si.price,

                                'image',
                                p.image
                            )
                        )
                        FILTER (
                            WHERE si.id IS NOT NULL
                        ),
                        '[]'
                    ) AS items


                FROM subscriptions s

                LEFT JOIN subscription_items si
                    ON s.id = si.subscription_id

                LEFT JOIN products p
                    ON si.product_id = p.id


                WHERE s.user_id = $1
                AND s.status = 'Paused'


                GROUP BY s.id

                ORDER BY s.id DESC
                `,
                [userId]
            );


        res.json({
            success: true,
            subscriptions:
                result.rows
        });


    } catch (error) {

        console.log(
            "GET PAUSED SUBSCRIPTIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// USER - SKIP SINGLE DELIVERY
// ============================================================

exports.skipDelivery = async (
    req,
    res
) => {

    try {

        const {
            deliveryId
        } = req.params;

        const {
            subscriptionId
        } = req.body;


        console.log(
            "SKIP DELIVERY:",
            {
                deliveryId,
                subscriptionId
            }
        );


        // ------------------------------------------------------
        // VALIDATE IDs
        // ------------------------------------------------------

        if (
            !deliveryId ||
            isNaN(Number(deliveryId))
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid delivery ID"
            });
        }


        if (
            !subscriptionId ||
            isNaN(Number(subscriptionId))
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid subscription ID"
            });
        }


        // ------------------------------------------------------
        // SKIP DELIVERY
        // ------------------------------------------------------

        const delivery =
            await skipDeliveryModel(
                Number(deliveryId),
                Number(subscriptionId)
            );


        if (!delivery) {

            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or cannot be skipped"
            });
        }


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        res.json({
            success: true,
            message:
                "Delivery skipped successfully",
            delivery
        });


    } catch (error) {

        console.error(
            "SKIP DELIVERY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ============================================================
// ADMIN - ASSIGN RIDER TO SUBSCRIPTION DELIVERY
// ============================================================

exports.assignRider = async (req, res) => {

    try {

        const { deliveryId } = req.params;
        const { rider_id } = req.body;


        // ------------------------------------------------------
        // VALIDATE DELIVERY ID
        // ------------------------------------------------------

        if (
            !deliveryId ||
            isNaN(Number(deliveryId))
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid delivery ID"
            });

        }


        // ------------------------------------------------------
        // VALIDATE RIDER ID
        // ------------------------------------------------------

        if (
            !rider_id ||
            isNaN(Number(rider_id))
        ) {

            return res.status(400).json({
                success: false,
                message: "Valid rider_id is required"
            });

        }


        console.log(
            "ASSIGN RIDER:",
            {
                deliveryId,
                rider_id
            }
        );


        // ------------------------------------------------------
        // ASSIGN RIDER
        // ------------------------------------------------------

        const delivery =
            await assignSubscriptionDeliveryRider(
                Number(deliveryId),
                Number(rider_id)
            );


        // ------------------------------------------------------
        // DELIVERY / RIDER NOT FOUND
        // ------------------------------------------------------

        if (!delivery) {

            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or rider is inactive"
            });

        }


        // ------------------------------------------------------
        // RESPONSE
        // ------------------------------------------------------

        res.json({

            success: true,

            message:
                "Rider assigned successfully",

            delivery

        });


    } catch (error) {

        console.error(
            "ASSIGN RIDER ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};