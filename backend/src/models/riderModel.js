const pool = require("../config/db");

// ============================================================
// GET RIDER BY PHONE
// ============================================================

exports.getRiderByPhone = async (phone) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        FROM riders
        WHERE phone = $1
        AND is_active = true
        `,
        [phone]
    );

    return result.rows[0];
};


// ============================================================
// GET RIDER BY ID
// ============================================================

exports.getRiderById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        FROM riders
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};


// ============================================================
// UPDATE RIDER STATUS
// ============================================================

exports.updateRiderStatus = async (id, status) => {
    const result = await pool.query(
        `
        UPDATE riders
        SET status = $1
        WHERE id = $2
        RETURNING
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active,
            created_at
        `,
        [status, id]
    );

    return result.rows[0];
};


// ============================================================
// GET RIDER ORDERS
// ============================================================

// exports.getRiderOrders = async (riderId) => {
//     const result = await pool.query(
//         `
//         SELECT
//             o.id,
//             o.user_id,
//             o.total_amount,
//             o.status,
//             o.payment_method,
//             o.created_at,
//             o.address_id,
//             o.rider_id,
//             o.rider_assigned_at,

//             u.name AS customer_name,
//             u.phone AS customer_phone,

//             a.full_address AS address,

//             COALESCE(
//                 json_agg(
//                     json_build_object(
//                         'product_id', p.id,
//                         'product_name', p.name,
//                         'quantity', oi.quantity,
//                         'price', oi.price,
//                         'image', p.image
//                     )
//                 ) FILTER (
//                     WHERE oi.id IS NOT NULL
//                 ),
//                 '[]'::json
//             ) AS products

//         FROM orders o

//         LEFT JOIN users u
//             ON o.user_id = u.id

//         LEFT JOIN addresses a
//             ON o.address_id = a.id

//         LEFT JOIN order_items oi
//             ON o.id = oi.order_id

//         LEFT JOIN products p
//             ON oi.product_id = p.id

//         WHERE o.rider_id = $1

//         GROUP BY
//             o.id,
//             u.id,
//             a.id

//         ORDER BY
//             o.created_at DESC
//         `,
//         [riderId]
//     );

//     return result.rows;
// };
exports.getRiderOrders = async (riderId) => {

    const result = await pool.query(
        `
        SELECT
            o.id,
            o.user_id,
            o.total_amount,
            o.status,
            o.payment_method,
            o.created_at,
            o.address_id,
            o.rider_id,
            o.rider_assigned_at,

            u.name AS customer_name,
            u.phone AS customer_phone,

            a.full_address AS address,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', p.id,
                        'product_name', p.name,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'image', p.image
                    )
                ) FILTER (
                    WHERE oi.id IS NOT NULL
                ),
                '[]'::json
            ) AS products

        FROM orders o

        LEFT JOIN users u
            ON o.user_id = u.id

        LEFT JOIN addresses a
            ON o.address_id = a.id

        LEFT JOIN order_items oi
            ON o.id = oi.order_id

        LEFT JOIN products p
            ON oi.product_id = p.id

        WHERE
            o.rider_id = $1
            OR (
                o.rider_id IS NULL
                AND o.status = 'Pending'
            )

        GROUP BY
            o.id,
            u.id,
            a.id

        ORDER BY
            o.created_at DESC
        `,
        [riderId]
    );

    return result.rows;
};

// ============================================================
// UPDATE RIDER ORDER STATUS
// ============================================================

exports.updateRiderOrderStatus = async (
    orderId,
    riderId,
    status
) => {
    const result = await pool.query(
        `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        AND rider_id = $3
        RETURNING *
        `,
        [status, orderId, riderId]
    );

    return result.rows[0];
};


// ============================================================
// GET ORDER FOR RIDER
// ============================================================

exports.getOrderByIdForRider = async (
    orderId,
    riderId
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM orders
        WHERE id = $1
        AND rider_id = $2
        `,
        [orderId, riderId]
    );

    return result.rows[0];
};


// ============================================================
// GET ALL SUBSCRIPTION DELIVERIES FOR RIDER
// ============================================================
exports.getRiderSubscriptionDeliveries = async (riderId) => {

    const result = await pool.query(
        `
        SELECT
            sds.id AS delivery_id,
            sds.subscription_id,
            sds.delivery_date,
            sds.status AS delivery_status,
            sds.rider_id,

            s.plan,
            s.frequency,
            s.delivery_time,

            u.id AS user_id,
            u.name AS customer_name,
            u.phone AS customer_phone,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', di.product_id,
                        'product_name', di.product_name,
                        'quantity', di.quantity,
                        'price', di.price,
                        'image', di.image
                    )
                ) FILTER (
                    WHERE di.id IS NOT NULL
                ),
                '[]'::json
            ) AS products

        FROM subscription_delivery_schedule sds

        JOIN subscriptions s
            ON sds.subscription_id = s.id

        JOIN users u
            ON s.user_id = u.id

        LEFT JOIN delivery_items di
            ON sds.id = di.delivery_schedule_id

        WHERE sds.rider_id = $1
        AND sds.delivery_date::date = CURRENT_DATE

        GROUP BY
            sds.id,
            s.id,
            u.id

        ORDER BY
            sds.delivery_date ASC,
            sds.id ASC
        `,
        [riderId]
    );

    return result.rows;
};

// ============================================================
// GET TODAY'S SUBSCRIPTION DELIVERIES
// ============================================================

exports.getTodaySubscriptionDeliveries = async (
    riderId
) => {
    const result = await pool.query(
        `
        SELECT
            sds.id AS delivery_id,
            sds.subscription_id,
            sds.delivery_date,
            sds.status AS delivery_status,
            sds.rider_id,

            s.plan,
            s.frequency,
            s.delivery_time,

            u.id AS user_id,
            u.name AS customer_name,
            u.phone AS customer_phone,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', di.product_id,
                        'product_name', di.product_name,
                        'quantity', di.quantity,
                        'price', di.price,
                        'image', di.image
                    )
                ) FILTER (
                    WHERE di.id IS NOT NULL
                ),
                '[]'::json
            ) AS products

        FROM subscription_delivery_schedule sds

        INNER JOIN subscriptions s
            ON sds.subscription_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        LEFT JOIN delivery_items di
            ON sds.id = di.delivery_schedule_id

        WHERE sds.rider_id = $1

        AND DATE(
            sds.delivery_date
            AT TIME ZONE 'Asia/Kolkata'
        ) = CURRENT_DATE

        GROUP BY
            sds.id,
            s.id,
            u.id

        ORDER BY
            sds.delivery_date ASC,
            sds.id ASC
        `,
        [riderId]
    );

    return result.rows;
};


// ============================================================
// GET SUBSCRIPTION DELIVERY BY ID FOR RIDER
// ============================================================

exports.getSubscriptionDeliveryByIdForRider = async (
    deliveryId,
    riderId
) => {
    try {
        const result = await pool.query(
            `
            SELECT
                sds.id AS delivery_id,
                sds.subscription_id,
                sds.delivery_date,
                sds.status AS delivery_status,
                sds.rider_id,

                s.plan,
                s.frequency,
                s.delivery_time,

                u.id AS user_id,
                u.name AS customer_name,
                u.phone AS customer_phone,

                -- SUBSCRIPTION SELECTED ADDRESS
                a.full_address AS customer_address,
                a.latitude AS customer_latitude,
                a.longitude AS customer_longitude,
                a.phone AS address_phone,

                -- PRODUCTS
                COALESCE(
                    json_agg(
                        json_build_object(
                            'product_id', p.id,
                            'product_name', p.name,
                            'quantity', si.quantity,
                            'price', p.price,
                            'image', p.image
                        )
                    ) FILTER (
                        WHERE si.id IS NOT NULL
                    ),
                    '[]'::json
                ) AS products

            FROM subscription_delivery_schedule sds

            INNER JOIN subscriptions s
                ON sds.subscription_id = s.id

            INNER JOIN users u
                ON s.user_id = u.id

            -- IMPORTANT:
            -- Get the address selected for this subscription
            LEFT JOIN addresses a
                ON a.id = s.address_id

            LEFT JOIN subscription_items si
                ON si.subscription_id = s.id

            LEFT JOIN products p
                ON p.id = si.product_id

            WHERE
                sds.id = $1
                AND sds.rider_id = $2

            GROUP BY
                sds.id,
                sds.subscription_id,
                sds.delivery_date,
                sds.status,
                sds.rider_id,

                s.plan,
                s.frequency,
                s.delivery_time,

                u.id,
                u.name,
                u.phone,

                a.id,
                a.full_address,
                a.latitude,
                a.longitude,
                a.phone
            `,
            [
                deliveryId,
                riderId
            ]
        );

        return result.rows[0];

    } catch (error) {
        console.error(
            "GET SUBSCRIPTION DELIVERY BY ID MODEL ERROR:",
            error
        );

        throw error;
    }
};
// ============================================================
// UPDATE SUBSCRIPTION DELIVERY STATUS
// ============================================================

exports.updateSubscriptionDeliveryStatus = async (
    deliveryId,
    riderId,
    status
) => {
    const result = await pool.query(
        `
        UPDATE subscription_delivery_schedule
        SET status = $1
        WHERE id = $2
        AND rider_id = $3
        RETURNING *
        `,
        [
            status,
            deliveryId,
            riderId
        ]
    );

    return result.rows[0];
};


// ============================================================
// GET MY DELIVERIES
// ============================================================

// exports.getMyDeliveries = async (riderId) => {
//     const result = await pool.query(
//         `
//         SELECT
//             sds.id AS delivery_id,
//             sds.subscription_id,
//             sds.delivery_date,
//             sds.status AS delivery_status,
//             sds.rider_id,

//             s.plan,
//             s.frequency,
//             s.delivery_time,

//             u.name AS customer_name,
//             u.phone AS customer_phone

//         FROM subscription_delivery_schedule sds

//         INNER JOIN subscriptions s
//             ON s.id = sds.subscription_id

//         INNER JOIN users u
//             ON u.id = s.user_id

//         WHERE sds.rider_id = $1

//         ORDER BY
//             sds.delivery_date ASC,
//             sds.id ASC
//         `,
//         [riderId]
//     );

//     return result.rows;
// };
// ============================================================
// GET MY DELIVERIES
// ============================================================

exports.getMyDeliveries = async (riderId) => {

    const result = await pool.query(
        `
        SELECT
            sds.id AS delivery_id,
            sds.subscription_id,
            sds.delivery_date,
            sds.status AS delivery_status,
            sds.rider_id,

            s.plan,
            s.frequency,
            s.delivery_time,

            u.id AS user_id,
            u.name AS customer_name,
            u.phone AS customer_phone,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', di.product_id,
                        'product_name', di.product_name,
                        'quantity', di.quantity,
                        'price', di.price,
                        'image', di.image
                    )
                ) FILTER (
                    WHERE di.id IS NOT NULL
                ),
                '[]'::json
            ) AS products

        FROM subscription_delivery_schedule sds

        INNER JOIN subscriptions s
            ON s.id = sds.subscription_id

        INNER JOIN users u
            ON u.id = s.user_id

        LEFT JOIN delivery_items di
            ON sds.id = di.delivery_schedule_id

        WHERE sds.rider_id = $1

        GROUP BY
            sds.id,
            s.id,
            u.id

        ORDER BY
            sds.delivery_date ASC,
            sds.id ASC
        `,
        [riderId]
    );

    return result.rows;
};
exports.getAllRiders = async () => {

    const result = await pool.query(`
        SELECT
            id,
            name,
            phone,
            vehicle_type,
            vehicle_number,
            status,
            is_active
        FROM riders
        WHERE is_active = true
        ORDER BY id
    `);

    return result.rows;
};