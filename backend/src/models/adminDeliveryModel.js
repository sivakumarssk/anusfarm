const pool = require("../config/db");

// ============================================================
// GET RIDERS
// ============================================================

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
        ORDER BY name ASC
    `);

    return result.rows;
};


// ============================================================
// GET SUBSCRIPTION DELIVERIES FOR ADMIN
// ============================================================

exports.getSubscriptionDeliveriesForAdmin = async () => {
    const result = await pool.query(`
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

            a.full_address AS customer_address,
            a.latitude AS customer_latitude,
            a.longitude AS customer_longitude,
            a.phone AS address_phone,

            r.name AS rider_name,
            r.phone AS rider_phone,

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

        LEFT JOIN addresses a
            ON a.id = s.address_id

        LEFT JOIN riders r
            ON r.id = sds.rider_id

        LEFT JOIN delivery_items di
            ON di.delivery_schedule_id = sds.id

        GROUP BY
            sds.id,
            s.id,
            u.id,
            a.id,
            r.id

        ORDER BY
            sds.delivery_date ASC,
            sds.id ASC
    `);

    return result.rows;
};


// ============================================================
// ASSIGN RIDER
// ============================================================

exports.assignRiderToDelivery = async (
    deliveryId,
    riderId
) => {

    const result = await pool.query(`
        UPDATE subscription_delivery_schedule
        SET
            rider_id = $1
        WHERE id = $2
        RETURNING *
    `, [
        riderId,
        deliveryId
    ]);

    return result.rows[0];
};