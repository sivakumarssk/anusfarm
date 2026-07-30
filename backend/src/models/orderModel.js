const pool = require("../config/db");


const getAllOrders = async()=>{
    const result = await pool.query(`
SELECT 

    o.id AS order_id,
    o.total_amount,
    o.status,
    o.payment_method,
    o.created_at,

    u.name AS customer_name,

    p.name AS product_name,

    oi.quantity,
    oi.price,

    a.address AS address


FROM orders o


LEFT JOIN users u
ON o.user_id = u.id


LEFT JOIN order_items oi
ON o.id = oi.order_id


LEFT JOIN products p
ON oi.product_id = p.id


LEFT JOIN LATERAL (
    SELECT address
    FROM user_locations
    WHERE user_id = o.user_id
    ORDER BY updated_at DESC
    LIMIT 1
) a ON true

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
        FROM orders`);
    return result.rows[0];
};
module.exports={
    getAllOrders,
    getOrderStats
};