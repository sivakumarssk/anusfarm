const pool = require("../config/db");


exports.getAllSubscriptions = async () => {

    const result = await pool.query(
`
SELECT 
    s.id,
    u.name,
    u.phone,

    s.plan,
    s.frequency,
    s.delivery_time,
    s.start_date,
    s.next_delivery_date,
    s.wallet_amount,
    s.payment_method,
    s.status,

    COALESCE(
        json_agg(
            json_build_object(
                'product_name', si.product_name,
                'quantity', si.quantity
            )
        ) FILTER (WHERE si.id IS NOT NULL),
        '[]'
    ) AS items


FROM subscriptions s

JOIN users u
ON s.user_id = u.id


LEFT JOIN subscription_items si
ON s.id = si.subscription_id


GROUP BY 
s.id,
u.name,
u.phone


ORDER BY s.id DESC

`
);

return result.rows;

};


exports.updateSubscriptionStatus = async(id,status)=>{

    const result = await pool.query(
        `
        UPDATE subscriptions
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
        [status,id]
    );

    return result.rows[0];

};
exports.getUserSubscriptions = async (userId) => {

const result = await pool.query(

`
SELECT

s.id,
s.plan,
s.frequency,
s.delivery_time,
s.selected_days,
s.start_date,
s.next_delivery_date,
s.status,
s.pause_from,
s.pause_to,

COALESCE(

json_agg(

json_build_object(
'id',si.id,
'product_name',si.product_name,
'quantity',si.quantity,
'price',si.price
)

) FILTER (WHERE si.id IS NOT NULL),

'[]'

) AS items

FROM subscriptions s

LEFT JOIN subscription_items si
ON s.id=si.subscription_id

WHERE s.user_id=$1

GROUP BY s.id

ORDER BY s.id DESC
`,
[userId]

);

return result.rows;

};
exports.pauseSubscription = async (
  id,
  pause_from,
  pause_to
) => {

  const result = await pool.query(
    `
    UPDATE subscriptions

    SET
      status='Paused',
      pause_from=$1,
      pause_to=$2

    WHERE id=$3

    RETURNING *
    `,
    [
      pause_from,
      pause_to,
      id
    ]
  );


  return result.rows[0];

};
exports.resumeSubscription = async (id) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      status='Active',
      pause_from=NULL,
      pause_to=NULL
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};
exports.cancelSubscription = async (id) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      status='Cancelled',
      cancel_date=CURRENT_DATE
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};
exports.updateSubscriptionById = async (
  id,
  frequency,
  delivery_time,
  next_delivery_date
) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      frequency = $1,
      delivery_time = $2,
      next_delivery_date = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      frequency,
      delivery_time,
      next_delivery_date,
      id
    ]
  );

  return result.rows[0];

};

   exports.getSubscriptionCalendar = async (id) => {

const result = await pool.query(
`
SELECT
id,
delivery_date,
status

FROM subscription_delivery_schedule

WHERE subscription_id=$1

ORDER BY delivery_date ASC
`,
[id]
);


return result.rows;

};

exports.generateDeliverySchedule = async (
    subscriptionId,
    frequency,
    startDate,
    items = []
) => {
    try {
        const date = new Date(startDate);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid subscription start date");
        }

        const normalizedFrequency = frequency?.trim().toLowerCase();

        // Convert subscription start datetime to the intended
        // India calendar date.
        const start = new Date(
            date.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            })
        );

        for (let i = 0; i < 30; i++) {

            const deliveryDate = new Date(start);

            // ==============================
            // CALCULATE DELIVERY DATE
            // ==============================

            if (
                normalizedFrequency === "daily" ||
                normalizedFrequency === "every day"
            ) {
                deliveryDate.setDate(
                    start.getDate() + i
                );

            } else if (
                normalizedFrequency === "weekly" ||
                normalizedFrequency === "every week"
            ) {
                deliveryDate.setDate(
                    start.getDate() + (i * 7)
                );

            } else if (
                normalizedFrequency === "alternative days" ||
                normalizedFrequency === "alternate days"
            ) {
                deliveryDate.setDate(
                    start.getDate() + (i * 2)
                );

            } else if (
                normalizedFrequency === "monthly" ||
                normalizedFrequency === "every month"
            ) {
                deliveryDate.setMonth(
                    start.getMonth() + i
                );

            } else {
                throw new Error(
                    `Unsupported subscription frequency: ${frequency}`
                );
            }

            // ==============================
            // FORMAT AS YYYY-MM-DD
            // ==============================

            const year = deliveryDate.getFullYear();

            const month = String(
                deliveryDate.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                deliveryDate.getDate()
            ).padStart(2, "0");

            const formattedDate =
                `${year}-${month}-${day}`;

            console.log(
                "GENERATING DELIVERY:",
                formattedDate
            );

            // ==============================
            // CREATE / GET SCHEDULE
            // ==============================

const scheduleResult = await pool.query(
    `
    INSERT INTO subscription_delivery_schedule
    (
        subscription_id,
        delivery_date,
        status,
        rider_id
    )
    VALUES
    (
        $1,
        $2,
        'Pending',
        (
            SELECT r.id
            FROM riders r
            WHERE r.is_active = true
              AND r.status = 'Online'
            ORDER BY r.id
            LIMIT 1
        )
    )

    ON CONFLICT
    (
        subscription_id,
        delivery_date
    )

    DO UPDATE SET
        status =
        CASE
            WHEN subscription_delivery_schedule.status = 'Skipped'
            THEN 'Skipped'
            ELSE subscription_delivery_schedule.status
        END

    RETURNING id, rider_id
    `,
    [
        subscriptionId,
        formattedDate
    ]
);

if (scheduleResult.rows.length === 0) {
    throw new Error(
        `Unable to create delivery schedule for ${formattedDate}`
    );
}


const deliveryScheduleId = scheduleResult.rows[0].id;

console.log(
    "Delivery Schedule:",
    deliveryScheduleId,
    formattedDate,
    "Rider:",
    scheduleResult.rows[0].rider_id
);
            // ==============================
            // INSERT DELIVERY ITEMS
            // ==============================

            for (const item of items) {

                await pool.query(
                    `
                    INSERT INTO delivery_items
                    (
                        delivery_schedule_id,
                        product_id,
                        product_name,
                        quantity,
                        price,
                        image
                    )

                    SELECT
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6

                    WHERE NOT EXISTS
                    (
                        SELECT 1
                        FROM delivery_items
                        WHERE delivery_schedule_id = $1
                        AND product_id = $2
                    )
                    `,
                    [
                        deliveryScheduleId,
                        item.id,
                        item.name,
                        item.quantity,
                        item.price,
                        item.image
                    ]
                );
            }
        }

    } catch (error) {

        console.error(
            "GENERATE DELIVERY SCHEDULE ERROR:",
            error
        );

        throw error;
    }
};


exports.deleteSubscription = async (id) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // Delete delivery items
        await client.query(
            `
            DELETE FROM delivery_items
            WHERE delivery_schedule_id IN
            (
                SELECT id
                FROM subscription_delivery_schedule
                WHERE subscription_id = $1
            )
            `,
            [id]
        );


        // Delete delivery schedules
        await client.query(
            `
            DELETE FROM subscription_delivery_schedule
            WHERE subscription_id = $1
            `,
            [id]
        );


        // Delete subscription items
        await client.query(
            `
            DELETE FROM subscription_items
            WHERE subscription_id = $1
            `,
            [id]
        );


        // Delete subscription
        const result = await client.query(
            `
            DELETE FROM subscriptions
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );


        await client.query("COMMIT");


        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }

};

exports.getPausedSubscriptions = async (userId) => {

    const result = await pool.query(
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


            COALESCE(
                json_agg(
                    json_build_object(
                        'product_name', si.product_name,
                        'quantity', si.quantity,
                        'price', si.price,
                        'image', p.image
                    )
                )
                FILTER (WHERE si.id IS NOT NULL),
                '[]'
            ) AS items


        FROM subscriptions s


        LEFT JOIN subscription_items si
        ON s.id = si.subscription_id


        LEFT JOIN products p
        ON si.product_id = p.id


        WHERE s.user_id=$1
        AND s.status='Paused'


        GROUP BY s.id

        ORDER BY s.id DESC
        `,
        [userId]
    );


    return result.rows;

};
exports.skipDelivery = async (deliveryId, subscriptionId) => {
    const result = await pool.query(
        `
        UPDATE subscription_delivery_schedule
        SET status = 'Skipped'
        WHERE id = $1
          AND subscription_id = $2
          AND status = 'Pending'
        RETURNING *
        `,
        [deliveryId, subscriptionId]
    );

    return result.rows[0];
};
exports.getSubscriptionById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.user_id,
      s.plan,
      s.frequency,
      s.delivery_time,
      s.selected_days,
      s.start_date,
      s.next_delivery_date,
      s.wallet_amount,
      s.payment_method,
      s.status,
      s.pause_from,
      s.pause_to,
      s.cancel_date,

      COALESCE(
        json_agg(
          json_build_object(
            'id', si.id,
            'product_id', si.product_id,
            'product_name', si.product_name,
            'name', si.product_name,
            'quantity', si.quantity,
            'price', si.price,
            'image', p.image
          )
        ) FILTER (WHERE si.id IS NOT NULL),
        '[]'
      ) AS products

    FROM subscriptions s

    LEFT JOIN subscription_items si
      ON s.id = si.subscription_id

    LEFT JOIN products p
      ON si.product_id = p.id

    WHERE s.id = $1

    GROUP BY s.id
    `,
    [id]
  );

  return result.rows[0];
};

// ============================================================
// ASSIGN RIDER TO SUBSCRIPTION DELIVERY
// ============================================================
// exports.getSubscriptionDeliveryByIdForRider = async (
//     deliveryId,
//     riderId
// ) => {
//     try {
//         const result = await pool.query(
//             `
//             SELECT
//                 sds.id AS delivery_id,
//                 sds.subscription_id,
//                 sds.delivery_date,
//                 sds.status AS delivery_status,
//                 sds.rider_id,

//                 s.plan,
//                 s.frequency,
//                 s.delivery_time,

//                 u.id AS user_id,
//                 u.name AS customer_name,
//                 u.phone AS customer_phone,

//                 -- ADDRESS
//                 a.full_address AS customer_address,
//                 a.latitude AS customer_latitude,
//                 a.longitude AS customer_longitude,
//                 a.phone AS address_phone,

//                 -- PRODUCTS
//                 COALESCE(
//                     json_agg(
//                         json_build_object(
//                             'product_id', p.id,
//                             'product_name', p.name,
//                             'quantity', si.quantity,
//                             'price', p.price,
//                             'image', p.image
//                         )
//                     ) FILTER (
//                         WHERE si.id IS NOT NULL
//                     ),
//                     '[]'::json
//                 ) AS products

//             FROM subscription_delivery_schedule sds

//             INNER JOIN subscriptions s
//                 ON sds.subscription_id = s.id

//             INNER JOIN users u
//                 ON s.user_id = u.id

//             LEFT JOIN addresses a
//                 ON a.user_id = u.id

//             LEFT JOIN subscription_items si
//                 ON si.subscription_id = s.id

//             LEFT JOIN products p
//                 ON p.id = si.product_id

//             WHERE
//                 sds.id = $1
//                 AND sds.rider_id = $2

//             GROUP BY
//                 sds.id,
//                 sds.subscription_id,
//                 sds.delivery_date,
//                 sds.status,
//                 sds.rider_id,

//                 s.plan,
//                 s.frequency,
//                 s.delivery_time,

//                 u.id,
//                 u.name,
//                 u.phone,

//                 a.full_address,
//                 a.latitude,
//                 a.longitude,
//                 a.phone
//             `,
//             [deliveryId, riderId]
//         );

//         return result.rows[0];

//     } catch (error) {
//         console.error(
//             "GET SUBSCRIPTION DELIVERY BY ID MODEL ERROR:",
//             error
//         );

//         throw error;
//     }
// };

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

                -- SUBSCRIPTION ADDRESS
                a.id AS address_id,
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

            -- GET THE ADDRESS SELECTED FOR THIS SUBSCRIPTION
            LEFT JOIN addresses a
                ON a.id = s.address_id
                AND a.user_id = u.id

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