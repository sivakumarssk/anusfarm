
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


// exports.createSubscription = async (req, res) => {
//     const client = await pool.connect();

//     try {

//         await client.query("BEGIN");

//         const user_id = req.user.id;

//         const {
//             plan,
//             frequency,
//             delivery_time,
//             selected_days,
//             wallet_amount,
//             payment_method,
//             next_delivery_date,
//             address_id,
//             items
//         } = req.body;

//         console.log("========== CREATE SUBSCRIPTION ==========");
//         console.log("USER ID =", user_id);
//         console.log("ADDRESS ID =", address_id);
//         console.log("ITEMS =", items);

//         // ==========================================
//         // VALIDATE ADDRESS
//         // ==========================================

//         if (!address_id) {
//             await client.query("ROLLBACK");

//             return res.status(400).json({
//                 success: false,
//                 message: "Address is required"
//             });
//         }

//         const addressResult = await client.query(
//             `
//             SELECT
//                 id,
//                 user_id,
//                 address_type,
//                 full_address,
//                 latitude,
//                 longitude,
//                 phone
//             FROM addresses
//             WHERE id = $1
//             AND user_id = $2
//             `,
//             [
//                 address_id,
//                 user_id
//             ]
//         );

//         if (addressResult.rows.length === 0) {
//             await client.query("ROLLBACK");

//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid address selected"
//             });
//         }

//         const selectedAddress = addressResult.rows[0];

//         console.log(
//             "SELECTED ADDRESS =",
//             selectedAddress
//         );

//         // ==========================================
//         // VALIDATE ITEMS
//         // ==========================================

//         if (!Array.isArray(items) || items.length === 0) {

//             await client.query("ROLLBACK");

//             return res.status(400).json({
//                 success: false,
//                 message: "At least one product is required"
//             });
//         }

//         // ==========================================
//         // CHECK SUBSCRIPTION STOCK
//         // ==========================================

//         for (const item of items) {

//             const productId = Number(item.id);
//             const requestedQuantity = Number(item.quantity);

//             if (!Number.isInteger(productId) || productId <= 0) {

//                 await client.query("ROLLBACK");

//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid product"
//                 });
//             }

//             if (
//                 !Number.isInteger(requestedQuantity) ||
//                 requestedQuantity <= 0
//             ) {

//                 await client.query("ROLLBACK");

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         `Invalid quantity for ${item.name || "product"}`
//                 });
//             }

//             // Lock the product row while checking inventory
//             const productResult = await client.query(
//                 `
//                 SELECT
//                     id,
//                     name,
//                     price,
//                     stock,
//                     subscription_stock,
//                     instant_stock
//                 FROM products
//                 WHERE id = $1
//                 FOR UPDATE
//                 `,
//                 [productId]
//             );

//             if (productResult.rows.length === 0) {

//                 await client.query("ROLLBACK");

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         `${item.name || "Product"} not found`
//                 });
//             }

//             const product = productResult.rows[0];

//             const totalStock = Number(product.stock);
//             const subscriptionStock =
//                 Number(product.subscription_stock);

//             const instantStock =
//                 Number(product.instant_stock);

//             console.log(
//                 "SUBSCRIPTION INVENTORY CHECK:",
//                 {
//                     productId,
//                     productName: product.name,
//                     totalStock,
//                     subscriptionStock,
//                     instantStock,
//                     requestedQuantity
//                 }
//             );

//             // ==========================================
//             // CHECK SUBSCRIPTION STOCK
//             // ==========================================

//             if (requestedQuantity > subscriptionStock) {

//                 await client.query("ROLLBACK");

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         `Only ${subscriptionStock} units of ${product.name} are available for subscription.`
//                 });
//             }

//             // ==========================================
//             // CHECK INVENTORY CONSISTENCY
//             // ==========================================

//             if (
//                 subscriptionStock + instantStock !== totalStock
//             ) {

//                 console.error(
//                     "INVENTORY MISMATCH:",
//                     {
//                         productId,
//                         totalStock,
//                         subscriptionStock,
//                         instantStock
//                     }
//                 );

//                 await client.query("ROLLBACK");

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         `Inventory mismatch for ${product.name}. Subscription stock + instant stock must equal total stock.`
//                 });
//             }
//         }

//         // ==========================================
//         // CREATE SUBSCRIPTION
//         // ==========================================

//         const result = await client.query(
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
//                 address_id
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
//                 $9
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
//                 address_id
//             ]
//         );

//         const subscription = result.rows[0];

//         console.log(
//             "CREATED SUBSCRIPTION =",
//             subscription
//         );

//         // ==========================================
//         // SAVE PRODUCTS + REDUCE SUBSCRIPTION STOCK
//         // ==========================================

//         for (const item of items) {

//             const productId = Number(item.id);
//             const requestedQuantity = Number(item.quantity);

//             // Insert subscription item
//             await client.query(
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
//                     productId,
//                     item.name,
//                     requestedQuantity,
//                     item.price
//                 ]
//             );

//             // Reduce ONLY subscription stock + total stock
//             const stockUpdate = await client.query(
//                 `
//                 UPDATE products
//                 SET
//                     subscription_stock =
//                         subscription_stock - $1,

//                     stock =
//                         stock - $1,

//                     updated_at = CURRENT_TIMESTAMP

//                 WHERE id = $2
//                 AND subscription_stock >= $1

//                 RETURNING
//                     id,
//                     name,
//                     stock,
//                     subscription_stock,
//                     instant_stock
//                 `,
//                 [
//                     requestedQuantity,
//                     productId
//                 ]
//             );

//             if (stockUpdate.rows.length === 0) {

//                 throw new Error(
//                     `Unable to reduce subscription stock for ${item.name || "product"}`
//                 );
//             }

//             console.log(
//                 "SUBSCRIPTION STOCK UPDATED:",
//                 stockUpdate.rows[0]
//             );
//         }

//         // ==========================================
//         // GENERATE DELIVERY SCHEDULE
//         // ==========================================

//         await generateDeliverySchedule(
//             subscription.id,
//             frequency,
//             subscription.next_delivery_date,
//             items || []
//         );

//         // ==========================================
//         // CREATE TRANSACTION
//         // ==========================================

//         await transactionModel.createTransaction({

//             subscription_id:
//                 subscription.id,

//             user_id:
//                 user_id,

//             transaction_type:
//                 "Initial Payment",

//             amount:
//                 wallet_amount,

//             payment_method:
//                 payment_method,

//             payment_status:
//                 "Success",

//             transaction_id:
//                 "SUB" + Date.now(),

//             description:
//                 `${plan} Subscription Payment`
//         });

//         // ==========================================
//         // COMMIT
//         // ==========================================

//         await client.query("COMMIT");

//         console.log(
//             "SUBSCRIPTION CREATED SUCCESSFULLY:",
//             subscription.id
//         );

//         // ==========================================
//         // RESPONSE
//         // ==========================================

//         res.status(201).json({
//             success: true,
//             subscription,
//             address: selectedAddress
//         });

//     } catch (error) {

//         await client.query("ROLLBACK");

//         console.error(
//             "CREATE SUBSCRIPTION ERROR:",
//             error
//         );

//         res.status(error.statusCode || 500).json({
//             success: false,
//             message: error.message
//         });

//     } finally {

//         client.release();
//     }
// };

exports.createSubscription = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

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
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }

        const addressResult = await client.query(
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
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Invalid address selected"
            });
        }

        const selectedAddress = addressResult.rows[0];

        // ==========================================
        // VALIDATE ITEMS
        // ==========================================

        if (!Array.isArray(items) || items.length === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "At least one product is required"
            });
        }

        // ==========================================
        // CHECK PRODUCT INVENTORY
        // ==========================================

        for (const item of items) {

            const productId = Number(item.id);
            const requestedQuantity = Number(item.quantity);

            if (
                !Number.isInteger(productId) ||
                productId <= 0
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    message: "Invalid product"
                });
            }

            if (
                !Number.isInteger(requestedQuantity) ||
                requestedQuantity <= 0
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid quantity for ${
                            item.name || "product"
                        }`
                });
            }

            // ==========================================
            // LOCK PRODUCT
            // ==========================================

            const productResult = await client.query(
                `
                SELECT
                    id,
                    name,
                    price,
                    stock
                FROM products
                WHERE id = $1
                FOR UPDATE
                `,
                [productId]
            );

            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    message:
                        `${item.name || "Product"} not found`
                });
            }

            const product = productResult.rows[0];

            const totalStock = Number(product.stock);

            // ==========================================
            // GET CURRENT ACTIVE SUBSCRIPTION REQUIREMENT
            // ==========================================

            const subscriptionResult = await client.query(
                `
                SELECT
                    COALESCE(
                        SUM(si.quantity),
                        0
                    ) AS subscription_required
                FROM subscription_items si

                INNER JOIN subscriptions s
                    ON s.id = si.subscription_id

                WHERE si.product_id = $1
                AND LOWER(s.status) = 'active'
                `,
                [productId]
            );

            const existingSubscriptionRequired =
                Number(
                    subscriptionResult.rows[0]
                        .subscription_required || 0
                );

            // ==========================================
            // CHECK AVAILABLE STOCK FOR THIS NEW
            // SUBSCRIPTION
            // ==========================================

            const availableForSubscription =
                Math.max(
                    0,
                    totalStock -
                    existingSubscriptionRequired
                );

            console.log(
                "SUBSCRIPTION INVENTORY CHECK:",
                {
                    productId,
                    productName: product.name,
                    totalStock,
                    existingSubscriptionRequired,
                    availableForSubscription,
                    requestedQuantity
                }
            );

            if (
                requestedQuantity >
                availableForSubscription
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    message:
                        `Only ${availableForSubscription} units of ${product.name} are available for subscription.`
                });
            }
        }

        // ==========================================
        // CREATE SUBSCRIPTION
        // ==========================================

        const result = await client.query(
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
        
console.log("NEW SUBSCRIPTION ID:", subscription.id);

const verifySubscription = await client.query(
  "SELECT id FROM subscriptions WHERE id = $1",
  [subscription.id]
);

console.log(
  "VERIFY SUBSCRIPTION IN SAME TRANSACTION:",
  verifySubscription.rows
);

        console.log(
            "CREATED SUBSCRIPTION =",
            subscription
        );

        // ==========================================
        // SAVE SUBSCRIPTION PRODUCTS
        // ==========================================

        for (const item of items) {

            const productId = Number(item.id);
            const requestedQuantity =
                Number(item.quantity);

            // ==========================================
            // INSERT SUBSCRIPTION ITEM
            // ==========================================

            await client.query(
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
                    productId,
                    item.name,
                    requestedQuantity,
                    item.price
                ]
            );

            // ==========================================
            // REDUCE TOTAL STOCK ONLY
            // ==========================================

            const stockUpdate = await client.query(
                `
                UPDATE products
                SET
                    stock = stock - $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                AND stock >= $1
                RETURNING
                    id,
                    name,
                    stock
                `,
                [
                    requestedQuantity,
                    productId
                ]
            );

            if (stockUpdate.rows.length === 0) {
                throw new Error(
                    `Unable to reduce stock for ${
                        item.name || "product"
                    }`
                );
            }

            console.log(
                "TOTAL STOCK UPDATED:",
                stockUpdate.rows[0]
            );
        }

        // ==========================================
        // GENERATE DELIVERY SCHEDULE
        // ==========================================

        
        
await generateDeliverySchedule(
    subscription.id,
    frequency,
    subscription.next_delivery_date,
    items || [],
    client
);



        // ==========================================
        // CREATE TRANSACTION
        // ==========================================

        // await transactionModel.createTransaction({

        //     subscription_id:
        //         subscription.id,

        //     user_id:
        //         user_id,

        //     transaction_type:
        //         "Initial Payment",

        //     amount:
        //         wallet_amount,

        //     payment_method:
        //         payment_method,

        //     payment_status:
        //         "Success",

        //     transaction_id:
        //         "SUB" + Date.now(),

        //     description:
        //         `${plan} Subscription Payment`
        // });

await transactionModel.createTransaction(
  {
    subscription_id: subscription.id,
    user_id,
    transaction_type: "Initial Payment",
    amount: wallet_amount,
    payment_method,
    payment_status: "Success",
    transaction_id: "SUB" + Date.now(),
    description: `${plan} Subscription Payment`,
  },
  client
);
        // ==========================================
        // COMMIT
        // ==========================================

        await client.query("COMMIT");

        console.log(
            "SUBSCRIPTION CREATED SUCCESSFULLY:",
            subscription.id
        );

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({
            success: true,
            subscription,
            address: selectedAddress
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "CREATE SUBSCRIPTION ERROR:",
            error
        );

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();
    }
};

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
// ============================================================
// ADMIN - CANCEL SUBSCRIPTION
// ============================================================

exports.adminCancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("ADMIN CANCEL SUBSCRIPTION ID:", id);

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID"
            });
        }

        const data = await cancelSubscription(Number(id));

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        console.log("ADMIN SUBSCRIPTION CANCELLED:", data.id);

        res.json({
            success: true,
            message: "Subscription cancelled successfully",
            subscription: data
        });

    } catch (error) {
        console.error("ADMIN CANCEL SUBSCRIPTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};