
const pool = require("../config/db");

// const getAllOrders = async()=>{

//   const result = await pool.query(`
//     SELECT
//     o.id AS order_id,
//     o.total_amount,
//     o.status,
//     o.payment_method,
//     o.created_at,

//     u.name AS customer_name,

//     COALESCE(
//       json_agg(
//         json_build_object(
//           'product_name', p.name,
//           'quantity', oi.quantity,
//           'price', oi.price,
//           'image', p.image
//         )
//       ) FILTER (WHERE oi.id IS NOT NULL),
//       '[]'::json
//     ) AS products,

//     a.full_address AS address

//     FROM orders o

//     LEFT JOIN users u
//     ON o.user_id = u.id

//     LEFT JOIN order_items oi
//     ON o.id = oi.order_id

//     LEFT JOIN products p
//     ON oi.product_id = p.id

//     LEFT JOIN addresses a
//     ON o.address_id = a.id

//     GROUP BY
//     o.id,
//     u.name,
//     a.full_address,
//     o.total_amount,
//     o.status,
//     o.payment_method,
//     o.created_at

//     ORDER BY o.id DESC;
//   `);


//   return result.rows;   // IMPORTANT
// };

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

        // Calculate total
        for (const item of items) {

            console.log("ITEM =", item);
            console.log("PRODUCT ID =", item.product_id);

            const product = await client.query(
                `
                SELECT price
                FROM products
                WHERE id = $1
                `,
                [item.product_id]
            );

            if (product.rows.length === 0) {
                throw new Error("Product not found");
            }

            totalAmount +=
                Number(product.rows[0].price) *
                item.quantity;
        }


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
    (
        $1,
        $2,
        $3,
        $4,
        $5
    )
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

        }


        await client.query("COMMIT");


      console.log(
    "ORDER CREATED:",
    orderId,
    "RIDER: Not Assigned"
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

module.exports = {
    getAllOrders,
    getOrderStats,
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
     assignRiderToOrder,
};

