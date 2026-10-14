
const pool = require("../config/db");


const getAdminNotifications = async () => {

    const result = await pool.query(`
        SELECT *
        FROM notifications
        ORDER BY id DESC
        LIMIT 20
    `);

    return result.rows;
};



const getUnreadCount = async () => {

    const result = await pool.query(`
        SELECT COUNT(*)
        FROM notifications
        WHERE is_read = false
    `);

    return result.rows[0].count;
};



const markAsRead = async () => {

    await pool.query(`
        UPDATE notifications
        SET is_read = true
        WHERE is_read = false
    `);

};



module.exports = {
    getAdminNotifications,
    getUnreadCount,
    markAsRead
};