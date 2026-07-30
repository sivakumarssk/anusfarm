const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            phone: user.phone,
            name: user.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};

module.exports = {
    generateToken
};