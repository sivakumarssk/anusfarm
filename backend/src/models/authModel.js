
const pool = require("../config/db");

const findUserByPhone = async (phone) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE phone=$1",
        [phone]
    );
    return result.rows[0];
};
const createUser = async (name, phone) => {
    const result = await pool.query(
        `INSERT INTO users(name, phone)
         VALUES($1,$2)
         RETURNING *`,
        [name, phone]
    );
    return result.rows[0];
};
module.exports = {
    findUserByPhone,
    createUser
};