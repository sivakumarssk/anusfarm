const { generateOTP } = require("../services/otpService");
const { generateToken } = require("../services/jwtService");
const { findUserByPhone, createUser } = require("../models/authModel");
const notificationModel = require("../models/notificationModel");
const pool = require("../config/db");


// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({
                success:false,
                message:"Phone number required"
            });
        }
        const otp = generateOTP();
        res.json({
            success:true,
            message:"OTP sent successfully",
            otp:otp
        });
    } 
    catch(err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};
// Verify OTP
exports.verifyOTP = async (req,res)=>{
     console.log("VERIFY OTP API HIT");
    console.log(req.body);
    try{
        const {name,phone,otp} = req.body;
        const userName = name || "New User";
        if(otp !== "123456"){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            });
        }
        let user = await findUserByPhone(phone);
        // New User
        if(!user){
            user = await createUser(
                userName,
                phone
            );
           await pool.query(
`
INSERT INTO wallets
(user_id, balance)
VALUES($1,$2)
ON CONFLICT (user_id) DO NOTHING
`,
[
    user.id,
    0
]
);
            // Create notification for admin
          await notificationModel.createNotification(
    user.id,
    "user",
    `Welcome ${user.name}! Your account has been created successfully.`
);
        }
        const token = generateToken(user);
        res.json({
            success:true,
            message:"Login successful",
            token,
            user
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

// Get Profile
exports.getProfile = async(req,res)=>{
    try{
        const result = await pool.query(
            "SELECT id,name,phone FROM users WHERE id=$1",
            [ req.user.id]);
        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        res.json({
            success:true,
            user:result.rows[0]
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};