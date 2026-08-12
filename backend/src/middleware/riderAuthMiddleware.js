// const jwt = require("jsonwebtoken");


// const riderAuthMiddleware = (req, res, next) => {

//     try {

//         const authHeader = req.headers.authorization;


//         // No Authorization header
//         if (!authHeader) {

//             return res.status(401).json({
//                 success: false,
//                 message: "No token provided"
//             });

//         }


//         // Expected:
//         // Authorization: Bearer TOKEN

//         const parts = authHeader.split(" ");


//         if (parts.length !== 2 || parts[0] !== "Bearer") {

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid authorization format"
//             });

//         }


//         const token = parts[1];


//         if (!token) {

//             return res.status(401).json({
//                 success: false,
//                 message: "Token missing"
//             });

//         }


//         // Verify JWT
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );


//         // Make sure this is a rider token
//         if (decoded.role !== "rider") {

//             return res.status(403).json({
//                 success: false,
//                 message: "Rider access only"
//             });

//         }


//         // Store decoded rider information
//         req.rider = decoded;


//         next();


//     } catch (error) {

//         console.error("RIDER AUTH ERROR:", error.message);

//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired rider token"
//         });

//     }

// };


// module.exports = riderAuthMiddleware;
const jwt = require("jsonwebtoken");

const riderAuthMiddleware = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message:
                    "Authorization token required"
            });
        }


        const token =
            authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;


        if (!token) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization format"
            });
        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        if (
            decoded.role !== "rider"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Rider access required"
            });
        }


        req.rider = decoded;


        console.log(
            "RIDER FROM TOKEN:",
            req.rider
        );


        next();

    } catch (error) {

        console.error(
            "RIDER AUTH ERROR:",
            error
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired rider token"
        });
    }
};


module.exports =
    riderAuthMiddleware;