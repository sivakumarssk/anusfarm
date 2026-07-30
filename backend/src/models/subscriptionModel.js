const pool = require("../config/db");


exports.getAllSubscriptions = async () => {

    const result = await pool.query(
        `
        SELECT 
            s.id,
            u.name,
            u.phone,
            s.plan,
            s.start_date,
            s.status

        FROM subscriptions s

        JOIN users u
        ON s.user_id = u.id

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