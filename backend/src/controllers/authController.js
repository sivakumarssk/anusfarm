const { generateOTP } = require("../services/otpService");
const { generateToken } = require("../services/jwtService");
const {findUserByPhone,createUser} = require("../models/authModel");


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
            otp: otp
        });
    } catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};
// Verify OTP
// exports.verifyOTP = async (req,res)=>{
//     try{
//         const { phone, otp } = req.body;
//         if(otp !== "123456"){

//             return res.status(400).json({
//                 success:false,
//                 message:"Invalid OTP"
//             });

//         }
//         let user = await findUserByPhone(phone);
//         if(!user){
//             user = await createUser(phone);
//         }
//         const token = generateToken(user);
//         res.json({
//             success:true,
//             message:"Login successful",
//             token,
//             user
//         });
//     }catch(err){
//         res.status(500).json({
//             success:false,
//             message:err.message
//         });
//     }
exports.verifyOTP = async (req, res) => {
    try {
        console.log("Verify OTP API called");
        console.log(req.body);

        const { phone, otp } = req.body;

        if (otp !== "123456") {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        let user = await findUserByPhone(phone);

        if (!user) {
            user = await createUser(phone);
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
