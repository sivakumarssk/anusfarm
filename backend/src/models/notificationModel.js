const pool = require("../config/db");


exports.getNotifications = async(userId)=>{

    console.log("FETCH NOTIFICATION USER ID =", userId);

    const result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id=$1
        ORDER BY id DESC
        `,
        [userId]
    );

    console.log("FETCHED NOTIFICATIONS =", result.rows);

    return result.rows;
};
 



exports.createNotification = async(userId,type,message)=>{

    console.log(
        "INSERT NOTIFICATION:",
        userId,
        type,
        message
    );

    const result = await pool.query(
        `
        INSERT INTO notifications
        (user_id,type,message,is_read)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
        [
            userId,
            type,
            message,
            false
        ]
    );

    console.log("CREATED NOTIFICATION:", result.rows[0]);

    return result.rows[0];
};



exports.getUnreadCount = async(userId)=>{

    const result = await pool.query(
        `
        SELECT COUNT(*)
        FROM notifications
        WHERE user_id=$1
        AND is_read=false
        `,
        [userId]
    );

    return result.rows[0].count;
};



exports.markAsRead = async(userId)=>{

    await pool.query(
        `
        UPDATE notifications
        SET is_read=true
        WHERE user_id=$1
        `,
        [userId]
    );

};