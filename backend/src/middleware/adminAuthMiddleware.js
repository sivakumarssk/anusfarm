
const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Admin token required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Admin token required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (error) {

        console.log("ADMIN AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid admin token"
        });
    }
};

module.exports = adminAuthMiddleware;

