const pool = require("../config/db");

exports.getAllSubscriptions = async () => {

    const result = await pool.query(
        `
        SELECT 
            s.id,
            s.user_id,
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
            s.cancel_date,

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

        WHERE
            (
                -- ACTIVE / PAUSED SUBSCRIPTIONS
                -- Show only when tomorrow has a pending delivery
                LOWER(s.status) <> 'cancelled'

                AND EXISTS (
                    SELECT 1
                    FROM subscription_delivery_schedule sds
                    WHERE
                        sds.subscription_id = s.id
                        AND sds.delivery_date =
                            CURRENT_DATE + INTERVAL '1 day'
                        AND LOWER(sds.status) = 'pending'
                )
            )

            OR

            (
                -- SHOW ALL CANCELLED SUBSCRIPTIONS
                LOWER(s.status) = 'cancelled'
            )

        GROUP BY
            s.id,
            s.user_id,
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
  try {
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

        COALESCE(p.products, '[]'::json) AS products,
        COALESCE(p.products, '[]'::json) AS items,
        COALESCE(d.deliveries, '[]'::json) AS deliveries

      FROM subscriptions s

      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', si.id,
            'product_id', si.product_id,
            'product_name', si.product_name,
            'name', si.product_name,
            'quantity', si.quantity,
            'price', si.price,
            'image', pr.image
          )
        ) AS products

        FROM subscription_items si

        LEFT JOIN products pr
          ON pr.id = si.product_id

        WHERE si.subscription_id = s.id
      ) p ON TRUE

      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', sds.id,
            'delivery_date', sds.delivery_date,
            'status', sds.status,
            'rider_id', sds.rider_id
          )
          ORDER BY sds.delivery_date ASC
        ) AS deliveries

        FROM subscription_delivery_schedule sds

        WHERE sds.subscription_id = s.id
      ) d ON TRUE

      WHERE s.user_id = $1

      ORDER BY s.id DESC
      `,
      [userId]
    );

    return result.rows;

  } catch (error) {
    console.error(
      "GET USER SUBSCRIPTIONS MODEL ERROR:",
      error
    );

    throw error;
  }
};

exports.pauseSubscription = async (
    id,
    pause_from,
    pause_to
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // ============================================================
        // PAUSE SUBSCRIPTION
        // ============================================================

        const result = await client.query(
            `
            UPDATE subscriptions

            SET
                status = 'Paused',
                pause_from = $1,
                pause_to = $2

            WHERE id = $3

            RETURNING *
            `,
            [
                pause_from,
                pause_to,
                id
            ]
        );


        if (result.rows.length === 0) {

            throw new Error(
                "Subscription not found"
            );

        }


        // ============================================================
        // PAUSE DELIVERY SCHEDULES
        // ============================================================

        await client.query(
            `
            UPDATE subscription_delivery_schedule

            SET status = 'Paused'

            WHERE subscription_id = $1

            AND delivery_date >= $2

            AND delivery_date <= $3

            AND LOWER(status) = 'pending'
            `,
            [
                id,
                pause_from,
                pause_to
            ]
        );


        await client.query("COMMIT");


        return result.rows[0];


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "PAUSE SUBSCRIPTION MODEL ERROR:",
            error
        );

        throw error;


    } finally {

        client.release();

    }

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

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // Cancel subscription
    const result = await client.query(
      `
      UPDATE subscriptions
      SET
        status = 'Cancelled',
        cancel_date = CURRENT_DATE
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {

      await client.query("ROLLBACK");

      return null;
    }

    // Cancel all future pending deliveries
    await client.query(
      `
      UPDATE subscription_delivery_schedule
      SET status = 'Cancelled'
      WHERE subscription_id = $1
      AND delivery_date >= CURRENT_DATE
      AND LOWER(status) = 'pending'
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

// exports.generateDeliverySchedule = async (
//     subscriptionId,
//     frequency,
//     startDate,
//     items = []
// ) => {
//     try {

exports.generateDeliverySchedule = async (
    subscriptionId,
    frequency,
    startDate,
    items = [],
    client = pool
) => {
    const db = client;

    try {



        const date = new Date(startDate);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid subscription start date");
        }

        const normalizedFrequency =
            frequency?.trim().toLowerCase();

        // ============================================================
        // GET CUSTOM SELECTED DAYS FROM SUBSCRIPTION
        // ============================================================

        let selectedDays = [];

        if (
            normalizedFrequency === "custom days" ||
            normalizedFrequency === "custom day"
        ) {

            // const subscriptionResult = await pool.query(
            const subscriptionResult = await db.query(
                `
                SELECT selected_days
                FROM subscriptions
                WHERE id = $1
                `,
                [subscriptionId]
            );

            if (subscriptionResult.rows.length === 0) {
                throw new Error(
                    `Subscription ${subscriptionId} not found`
                );
            }

            selectedDays =
                subscriptionResult.rows[0].selected_days || [];

            // Convert PostgreSQL array / JSON / string into normal array
            if (typeof selectedDays === "string") {

                try {
                    selectedDays = JSON.parse(selectedDays);
                } catch (error) {

                    selectedDays = selectedDays
                        .replace(/[{}]/g, "")
                        .split(",")
                        .map(day => day.trim());
                }
            }

            if (!Array.isArray(selectedDays)) {
                selectedDays = [];
            }

            // Normalize selected days
            selectedDays = selectedDays.map(day =>
                String(day).trim().toLowerCase()
            );

            console.log(
                "CUSTOM SELECTED DAYS:",
                selectedDays
            );

            if (selectedDays.length === 0) {
                throw new Error(
                    "Custom Days selected but no days were provided"
                );
            }
        }

        // ============================================================
        // CONVERT START DATE TO INDIA DATE
        // ============================================================

        const start = new Date(
            date.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            })
        );

        // ============================================================
        // DAY NAME HELPER
        // ============================================================

        const getDayName = (date) => {

            const days = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday"
            ];

            return days[date.getDay()];
        };

        // ============================================================
        // CHECK WHETHER A DAY IS SELECTED
        // ============================================================

        const isSelectedCustomDay = (date) => {

            const dayName =
                getDayName(date);

            const shortDay =
                dayName.substring(0, 3);

            return selectedDays.some(day => {

                const normalizedDay =
                    day
                        .replace(/[^a-z]/g, "")
                        .toLowerCase();

                return (
                    normalizedDay === dayName ||
                    normalizedDay === shortDay
                );
            });
        };

        // ============================================================
        // GENERATE 30 DELIVERIES
        // ============================================================

        let generatedDeliveries = 0;

        let currentDate = new Date(start);

        for (
            let i = 0;
            generatedDeliveries < 30;
            i++
        ) {

            let deliveryDate = new Date(start);

            // ========================================================
            // DAILY
            // ========================================================

            if (
                normalizedFrequency === "daily" ||
                normalizedFrequency === "every day"
            ) {

                deliveryDate.setDate(
                    start.getDate() + i
                );
            }

            // ========================================================
            // WEEKLY
            // ========================================================

            else if (
                normalizedFrequency === "weekly" ||
                normalizedFrequency === "every week"
            ) {

                deliveryDate.setDate(
                    start.getDate() + (i * 7)
                );
            }

            // ========================================================
            // ALTERNATIVE DAYS
            // ========================================================

            else if (
                normalizedFrequency === "alternative days" ||
                normalizedFrequency === "alternate days"
            ) {

                deliveryDate.setDate(
                    start.getDate() + (i * 2)
                );
            }

            // ========================================================
            // MONTHLY
            // ========================================================

            else if (
                normalizedFrequency === "monthly" ||
                normalizedFrequency === "every month"
            ) {

                deliveryDate.setMonth(
                    start.getMonth() + i
                );
            }

            // ========================================================
            // WEEKDAYS - MONDAY TO FRIDAY
            // ========================================================

            else if (
                normalizedFrequency === "weekdays" ||
                normalizedFrequency === "weekday"
            ) {

                if (i === 0) {

                    deliveryDate =
                        new Date(start);

                    const startDay =
                        deliveryDate.getDay();

                    // Saturday → Monday
                    if (startDay === 6) {

                        deliveryDate.setDate(
                            deliveryDate.getDate() + 2
                        );
                    }

                    // Sunday → Monday
                    else if (startDay === 0) {

                        deliveryDate.setDate(
                            deliveryDate.getDate() + 1
                        );
                    }

                } else {

                    let foundWeekdays = 0;

                    let current =
                        new Date(start);

                    while (
                        foundWeekdays < i
                    ) {

                        current.setDate(
                            current.getDate() + 1
                        );

                        const day =
                            current.getDay();

                        // Monday - Friday
                        if (
                            day >= 1 &&
                            day <= 5
                        ) {

                            foundWeekdays++;
                        }
                    }

                    deliveryDate =
                        current;
                }
            }

            // ========================================================
            // CUSTOM DAYS
            // ========================================================

            else if (
                normalizedFrequency === "custom days" ||
                normalizedFrequency === "custom day"
            ) {

                // Start searching from the subscription start date
                // and find the next selected day.

                let found = false;

                while (!found) {

                    if (
                        isSelectedCustomDay(
                            currentDate
                        )
                    ) {

                        deliveryDate =
                            new Date(currentDate);

                        found = true;

                    } else {

                        currentDate.setDate(
                            currentDate.getDate() + 1
                        );
                    }
                }

                // Move to the next day so the same
                // delivery date is not selected again.
                currentDate.setDate(
                    currentDate.getDate() + 1
                );
            }

            // ========================================================
            // INVALID FREQUENCY
            // ========================================================

            else {

                throw new Error(
                    `Unsupported subscription frequency: ${frequency}`
                );
            }

            // ========================================================
            // FORMAT YYYY-MM-DD
            // ========================================================

            const year =
                deliveryDate.getFullYear();

            const month =
                String(
                    deliveryDate.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    deliveryDate.getDate()
                ).padStart(2, "0");

            const formattedDate =
                `${year}-${month}-${day}`;

            console.log(
                "GENERATING DELIVERY:",
                formattedDate
            );

            // ========================================================
            // CREATE / GET DELIVERY SCHEDULE
            // ========================================================

const verifyScheduleSubscription = await db.query(
  "SELECT id FROM subscriptions WHERE id = $1",
  [subscriptionId]
);

console.log("SCHEDULE SUBSCRIPTION ID:", subscriptionId);

console.log(
  "SUBSCRIPTION EXISTS BEFORE SCHEDULE INSERT:",
  verifyScheduleSubscription.rows
);
           const scheduleResult =
    await db.query(
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

            if (
                scheduleResult.rows.length === 0
            ) {

                throw new Error(
                    `Unable to create delivery schedule for ${formattedDate}`
                );
            }

            const deliveryScheduleId =
                scheduleResult.rows[0].id;

            console.log(
                "Delivery Schedule:",
                deliveryScheduleId,
                formattedDate,
                "Rider:",
                scheduleResult.rows[0].rider_id
            );

            // ========================================================
            // INSERT DELIVERY ITEMS
            // ========================================================

            for (const item of items) {

               await db.query(
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

            // Count only actual generated deliveries.
            generatedDeliveries++;
        }

        console.log(
            `SUCCESS: Generated ${generatedDeliveries} deliveries for subscription ${subscriptionId}`
        );

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
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', si.id,
                            'product_id', si.product_id,
                            'product_name', si.product_name,
                            'name', si.product_name,
                            'quantity', si.quantity,
                            'price', si.price,
                            'image', p.image
                        )
                    )
                    FROM subscription_items si
                    LEFT JOIN products p
                        ON si.product_id = p.id
                    WHERE si.subscription_id = s.id
                ),
                '[]'::json
            ) AS products,

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', sds.id,
                            'subscription_id', sds.subscription_id,
                            'delivery_date', sds.delivery_date,
                            'status', sds.status,
                            'rider_id', sds.rider_id
                        )
                        ORDER BY sds.delivery_date ASC
                    )
                    FROM subscription_delivery_schedule sds
                    WHERE sds.subscription_id = s.id
                ),
                '[]'::json
            ) AS deliveries

        FROM subscriptions s

        WHERE s.id = $1
        `,
        [id]
    );

    return result.rows[0];
};
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