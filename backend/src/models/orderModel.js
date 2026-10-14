
const pool = require("../config/db");



const getAllOrders = async () => {
    const result = await pool.query(`
        SELECT
            o.id AS order_id,
            o.user_id,
            o.rider_id,
            o.rider_assigned_at,

            o.total_amount,
            o.status,
            o.payment_method,
            o.created_at,

            -- Instant order delivery is next day
            (o.created_at::date + INTERVAL '1 day')::date
                AS delivery_date,

            u.name AS customer_name,
            u.phone AS customer_phone,

            r.name AS rider_name,
            r.phone AS rider_phone,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', p.id,
                        'product_name', p.name,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'image', p.image
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'::json
            ) AS products,

            a.full_address AS address

        FROM orders o

        LEFT JOIN users u
            ON o.user_id = u.id

        LEFT JOIN riders r
            ON o.rider_id = r.id

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        LEFT JOIN products p
            ON oi.product_id = p.id

        LEFT JOIN addresses a
            ON o.address_id = a.id

        GROUP BY
            o.id,
            u.id,
            r.id,
            a.id

        ORDER BY o.id DESC
    `);

    return result.rows;
};

const getOrderStats = async()=>{

    const result = await pool.query(`

        SELECT

            COUNT(*) AS total,

            COUNT(*) FILTER(
                WHERE status='Delivered'
            ) AS delivered,


            COUNT(*) FILTER(
                WHERE status='Pending'
            ) AS pending,


            COUNT(*) FILTER(
                WHERE status='Cancelled'
            ) AS cancelled


        FROM orders

    `);


    return result.rows[0];

};


const getPendingStats = async () => {

    const result = await pool.query(`
        SELECT

        (
            SELECT COUNT(*)
            FROM orders
            WHERE LOWER(status) = 'pending'
        ) AS instant_pending,

        (
            SELECT COUNT(*)
            FROM subscription_delivery_schedule
            WHERE LOWER(status) = 'pending'
            AND delivery_date = CURRENT_DATE
        ) AS subscription_pending
    `);

    return {
        instant_pending: Number(result.rows[0].instant_pending),
        subscription_pending: Number(result.rows[0].subscription_pending)
    };
};
// const createOrder = async (
//     userId,
//     items,
//     paymentMethod,
//     addressId
// ) => {

//     const client = await pool.connect();

//     try {

//         await client.query("BEGIN");

//         let totalAmount = 0;

//         // ==========================================
//         // CHECK INSTANT STOCK
//         // ==========================================

//         for (const item of items) {

//             const requestedQuantity = Number(item.quantity);

//             if (
//                 !Number.isInteger(requestedQuantity) ||
//                 requestedQuantity <= 0
//             ) {
//                 throw new Error("Invalid product quantity");
//             }

//             const productResult = await client.query(
//                 `
//                 SELECT
//                     id,
//                     price,
//                     stock,
//                     subscription_stock,
//                     instant_stock
//                 FROM products
//                 WHERE id = $1
//                 FOR UPDATE
//                 `,
//                 [item.product_id]
//             );

//             if (productResult.rows.length === 0) {
//                 throw new Error("Product not found");
//             }

//             const product = productResult.rows[0];

//             const instantStock = Number(product.instant_stock);

//             console.log(
//                 "PRODUCT:",
//                 item.product_id,
//                 "TOTAL:",
//                 product.stock,
//                 "SUBSCRIPTION STOCK:",
//                 product.subscription_stock,
//                 "INSTANT STOCK:",
//                 instantStock,
//                 "REQUESTED:",
//                 requestedQuantity
//             );

//             // ==========================================
//             // CHECK INSTANT STOCK
//             // ==========================================

//             if (requestedQuantity > instantStock) {

//                 const error = new Error(
//                     `Only ${instantStock} units are available for instant order.`
//                 );

//                 error.statusCode = 400;

//                 throw error;
//             }

//             totalAmount +=
//                 Number(product.price) * requestedQuantity;
//         }

//         // ==========================================
//         // CREATE ORDER
//         // ==========================================

//         const orderResult = await client.query(
//             `
//             INSERT INTO orders
//             (
//                 user_id,
//                 total_amount,
//                 status,
//                 payment_method,
//                 address_id
//             )
//             VALUES
//             ($1, $2, $3, $4, $5)
//             RETURNING id
//             `,
//             [
//                 userId,
//                 totalAmount,
//                 "Pending",
//                 paymentMethod,
//                 addressId
//             ]
//         );

//         const orderId = orderResult.rows[0].id;

//         // ==========================================
//         // INSERT ORDER ITEMS + REDUCE INSTANT STOCK
//         // ==========================================

//         for (const item of items) {

//             const product = await client.query(
//                 `
//                 SELECT price
//                 FROM products
//                 WHERE id = $1
//                 `,
//                 [item.product_id]
//             );

//             await client.query(
//                 `
//                 INSERT INTO order_items
//                 (
//                     order_id,
//                     product_id,
//                     quantity,
//                     price
//                 )
//                 VALUES
//                 ($1, $2, $3, $4)
//                 `,
//                 [
//                     orderId,
//                     item.product_id,
//                     item.quantity,
//                     product.rows[0].price
//                 ]
//             );

//             // ==========================================
//             // REDUCE INSTANT STOCK
//             // ==========================================

//             await client.query(
//                 `
//                 UPDATE products
//                 SET
//                     instant_stock = instant_stock - $1,
//                     stock = stock - $1
//                 WHERE id = $2
//                 `,
//                 [
//                     item.quantity,
//                     item.product_id
//                 ]
//             );
//         }

//         await client.query("COMMIT");

//         console.log("ORDER CREATED:", orderId);

//         return orderId;

//     } catch (error) {

//         await client.query("ROLLBACK");

//         throw error;

//     } finally {

//         client.release();

//     }
// };

const createOrder = async (
    userId,
    items,
    paymentMethod,
    addressId
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        let totalAmount = 0;

        // ==========================================
        // CHECK INSTANT STOCK
        // ==========================================

        for (const item of items) {

            const requestedQuantity = Number(item.quantity);

            if (
                !Number.isInteger(requestedQuantity) ||
                requestedQuantity <= 0
            ) {
                throw new Error("Invalid product quantity");
            }

            // ==========================================
            // LOCK PRODUCT
            // ==========================================

            const productResult = await client.query(
                `
                SELECT
                    id,
                    price,
                    stock
                FROM products
                WHERE id = $1
                FOR UPDATE
                `,
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                throw new Error("Product not found");
            }

            const product = productResult.rows[0];

            const totalStock = Number(product.stock);

            // ==========================================
            // CALCULATE ACTIVE SUBSCRIPTION QUANTITY
            // ==========================================

            const subscriptionResult = await client.query(
                `
                SELECT
                    COALESCE(SUM(si.quantity), 0) AS reserved_quantity

                FROM subscription_items si

                INNER JOIN subscriptions s
                    ON s.id = si.subscription_id

                WHERE si.product_id = $1

                AND LOWER(s.status) = 'active'
                `,
                [item.product_id]
            );

            const subscriptionReserved = Number(
                subscriptionResult.rows[0].reserved_quantity || 0
            );

            // ==========================================
            // CALCULATE INSTANT AVAILABLE
            // ==========================================

            const availableForInstant = Math.max(
                0,
                totalStock - subscriptionReserved
            );

            console.log(
                "================================="
            );

            console.log(
                "PRODUCT:",
                item.product_id
            );

            console.log(
                "TOTAL STOCK:",
                totalStock
            );

            console.log(
                "SUBSCRIPTION RESERVED:",
                subscriptionReserved
            );

            console.log(
                "INSTANT AVAILABLE:",
                availableForInstant
            );

            console.log(
                "REQUESTED:",
                requestedQuantity
            );

            console.log(
                "================================="
            );

            // ==========================================
            // CHECK INSTANT ORDER
            // ==========================================

            if (
                requestedQuantity >
                availableForInstant
            ) {

                const error = new Error(
                    `Only ${availableForInstant} units are available for instant order.`
                );

                error.statusCode = 400;

                throw error;
            }

            totalAmount +=
                Number(product.price) *
                requestedQuantity;
        }

        // ==========================================
        // CREATE ORDER
        // ==========================================

        const orderResult = await client.query(
            `
            INSERT INTO orders
            (
                user_id,
                total_amount,
                status,
                payment_method,
                address_id
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [
                userId,
                totalAmount,
                "Pending",
                paymentMethod,
                addressId
            ]
        );

        const orderId =
            orderResult.rows[0].id;

        // ==========================================
        // INSERT ORDER ITEMS
        // ==========================================

        for (const item of items) {

            const product = await client.query(
                `
                SELECT price
                FROM products
                WHERE id = $1
                `,
                [item.product_id]
            );

            await client.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES
                ($1, $2, $3, $4)
                `,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    product.rows[0].price
                ]
            );

            // ==========================================
            // REDUCE TOTAL STOCK
            // ==========================================

            await client.query(
                `
                UPDATE products
                SET
                    stock = stock - $1
                WHERE id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        await client.query("COMMIT");

        console.log(
            "ORDER CREATED:",
            orderId
        );

        return orderId;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};

const getMyOrders = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,

      COALESCE(
        json_agg(
          json_build_object(
    'product_name', p.name,
    'quantity', oi.quantity,
    'price', oi.price,
    'image', p.image
)
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS products

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    LEFT JOIN products p
      ON oi.product_id = p.id

    WHERE o.user_id = $1

    GROUP BY
      o.id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};
const getOrderById = async (orderId) => {

  const result = await pool.query(
    `
    SELECT
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,

      COALESCE(
        json_agg(
          json_build_object(
            'product_id', p.id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', p.image
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS products,

      a.full_address AS address

    FROM orders o

    LEFT JOIN addresses a
      ON o.address_id = a.id

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    LEFT JOIN products p
      ON oi.product_id = p.id

    WHERE o.id = $1

    GROUP BY
      o.id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,
      a.full_address
    `,
    [orderId]
  );

  return result.rows[0];
};

// Update Order Status (Admin)
const updateOrderStatus = async (orderId, status) => {

    const result = await pool.query(
        `
        UPDATE orders
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
        [
            status,
            orderId
        ]
    );

    return result.rows[0];
};

const deleteOrder = async (id) => {
    const result = await pool.query(
        "DELETE FROM orders WHERE id=$1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
const assignRiderToOrder = async (orderId, riderId) => {
    const result = await pool.query(
        `
        UPDATE orders
        SET
            rider_id = $1,
            rider_assigned_at = CURRENT_TIMESTAMP,
            status = 'Assigned'
        WHERE id = $2
        RETURNING *
        `,
        [riderId, orderId]
    );

    return result.rows[0];
};

const cancelMyOrder = async (orderId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Find and lock this user's order
        const orderResult = await client.query(
            `
            SELECT id, user_id, status
            FROM orders
            WHERE id = $1 AND user_id = $2
            FOR UPDATE
            `,
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        const order = orderResult.rows[0];

        // Allow cancellation only while Pending
        if (String(order.status).toLowerCase() !== "pending") {
            const error = new Error(
                "This order can no longer be cancelled."
            );
            error.statusCode = 400;
            throw error;
        }

        // Restore the stock deducted when the order was placed
        const itemsResult = await client.query(
            `
            SELECT product_id, quantity
            FROM order_items
            WHERE order_id = $1
            `,
            [orderId]
        );

        for (const item of itemsResult.rows) {
            await client.query(
                `
                UPDATE products
                SET stock = stock + $1
                WHERE id = $2
                `,
                [item.quantity, item.product_id]
            );
        }

        // Update status only if the order is still Pending
        const updateResult = await client.query(
            `
            UPDATE orders
            SET status = 'Cancelled'
            WHERE id = $1
              AND user_id = $2
              AND LOWER(status) = 'pending'
            RETURNING *
            `,
            [orderId, userId]
        );

        if (updateResult.rows.length === 0) {
            throw new Error(
                "Order could not be cancelled. Please refresh and try again."
            );
        }

        await client.query("COMMIT");

        return updateResult.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const cancelOrderByAdmin = async (orderId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // ==========================================
        // FIND AND LOCK ORDER
        // ==========================================

        const orderResult = await client.query(
            `
            SELECT
                id,
                user_id,
                status
            FROM orders
            WHERE id = $1
            FOR UPDATE
            `,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            const error = new Error("Order not found");
            error.statusCode = 404;
            throw error;
        }

        const order = orderResult.rows[0];

        // ==========================================
        // ADMIN CAN CANCEL ONLY PENDING ORDERS
        // ==========================================

        if (
            String(order.status || "")
                .trim()
                .toLowerCase() !== "pending"
        ) {
            const error = new Error(
                "Only pending orders can be cancelled."
            );

            error.statusCode = 400;

            throw error;
        }

        // ==========================================
        // GET ORDER ITEMS
        // ==========================================

        const itemsResult = await client.query(
            `
            SELECT
                product_id,
                quantity
            FROM order_items
            WHERE order_id = $1
            `,
            [orderId]
        );

        // ==========================================
        // RESTORE PRODUCT STOCK
        // ==========================================

        for (const item of itemsResult.rows) {
            await client.query(
                `
                UPDATE products
                SET stock = stock + $1
                WHERE id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        // ==========================================
        // CANCEL ORDER
        // ==========================================

        const updateResult = await client.query(
            `
            UPDATE orders
            SET status = 'Cancelled'
            WHERE id = $1
              AND LOWER(status) = 'pending'
            RETURNING *
            `,
            [orderId]
        );

        if (updateResult.rows.length === 0) {
            throw new Error(
                "Order could not be cancelled. Please refresh and try again."
            );
        }

        await client.query("COMMIT");

        return updateResult.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};

module.exports = {
    getAllOrders,
    getOrderStats,
     getPendingStats,
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
     assignRiderToOrder,
     cancelMyOrder,
      cancelOrderByAdmin,
};

