const pool = require("../config/db");

const getAdminNotifications = async () => {

    const result = await pool.query(`
    
    SELECT 
        'order' AS type,
        CONCAT('New order #', id, ' placed') AS message,
        created_at
    FROM orders

    UNION ALL

    SELECT
        'user' AS type,
        CONCAT('New user registered: ', name) AS message,
        created_at
    FROM users

    ORDER BY created_at DESC
    LIMIT 20

    `);

    return result.rows;
};


module.exports = {
    getAdminNotifications
};