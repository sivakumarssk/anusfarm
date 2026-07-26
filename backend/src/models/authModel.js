const pool = require("../config/db");


const findUserByPhone = async (phone) => {

    const result = await pool.query(
        "SELECT * FROM users WHERE phone=$1",
        [phone]
    );

    return result.rows[0];

};


const createUser = async (phone) => {

    const result = await pool.query(
        `
        INSERT INTO users(phone)
        VALUES($1)
        RETURNING *
        `,
        [phone]
    );

    return result.rows[0];

};


module.exports = {
    findUserByPhone,
    createUser
};