const pool = require("../config/db");

// Get notifications
exports.getNotifications = async()=>{
    const result = await pool.query(
        `SELECT *
        FROM notifications
        ORDER BY id DESC`);
    return result.rows;
};
// Create notification

exports.createNotification = async(type, message)=>{
    const result = await pool.query(
        `INSERT INTO notifications(type,message, is_read ) VALUES($1,$2,$3)RETURNING *`,
        [ type,message,false ]
    );
    return result.rows[0];
};