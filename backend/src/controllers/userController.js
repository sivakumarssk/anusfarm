// const pool = require("../config/db");


// // CREATE USER (POST)
// exports.createUser = async (req, res) => {
//   try {
//     const { phone, name } = req.body;

//     const result = await pool.query(
//       `INSERT INTO users(phone, name)
//        VALUES($1, $2)
//        RETURNING id, phone, name, created_at`,
//       [phone, name]
//     );

//     res.status(201).json({
//       success: true,
//       user: result.rows[0],
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



// // GET USER PROFILE (GET)
// exports.getProfile = async (req, res) => {
//   try {
//      console.log("TOKEN USER:", req.user);
//     const userId = req.user.id;


//     const user = await pool.query(
//       `SELECT id, phone, name, created_at
//        FROM users
//        WHERE id = $1`,
//       [userId]
//     );


//     if(user.rows.length === 0){

//       return res.status(404).json({
//         success:false,
//         message:"User not found"
//       });

//     }


//     const location = await pool.query(
//       `SELECT address
//        FROM user_locations
//        WHERE user_id = $1
//        ORDER BY id DESC
//        LIMIT 1`,
//       [userId]
//     );


//     res.json({

//       success:true,

//       user:user.rows[0],

//       location:
//         location.rows.length > 0
//         ? location.rows[0].address
//         : ""

//     });


//   } catch(error){

//     console.log(error);

//     res.status(500).json({
//       success:false,
//       message:"Server Error"
//     });

//   }
// };




// // UPDATE PROFILE (PUT)
// exports.updateProfile = async (req,res)=>{

//   try{

//     const userId = req.user.id;

//     const { name } = req.body;


//     const result = await pool.query(
//       `UPDATE users
//        SET name=$1
//        WHERE id=$2
//        RETURNING id, phone, name, created_at`,
//       [name,userId]
//     );


//     res.json({

//       success:true,

//       user:result.rows[0]

//     });


//   }catch(error){

//     console.log(error);

//     res.status(500).json({
//       success:false,
//       message:"Server Error"
//     });

//   }

// };




// // DELETE USER (DELETE)
// exports.deleteProfile = async(req,res)=>{

//   try{

//     const userId=req.user.id;


//     await pool.query(
//       `DELETE FROM users
//        WHERE id=$1`,
//        [userId]
//     );


//     res.json({

//       success:true,

//       message:"User deleted successfully"

//     });


//   }catch(error){

//     console.log(error);

//     res.status(500).json({
//       success:false,
//       message:"Server Error"
//     });

//   }
// };
// exports.getAllUsers = async(req,res)=>{
//     try{

//         const result = await pool.query(
//             "SELECT id,name,phone FROM users ORDER BY id"
//         );

//         res.json({
//             success:true,
//             users:result.rows
//         });

//     }catch(error){

//         console.log(error);

//         res.status(500).json({
//             success:false,
//             message:error.message
//         });

//     }
// };
const pool = require("../config/db");


// GET PROFILE
exports.getProfile = async (req,res)=>{
    try{
        const result = await pool.query(
            "SELECT id,name,phone FROM users WHERE id=$1",
            [req.user.id]
        );
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
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

// UPDATE PROFILE NAME
exports.updateProfile = async(req,res)=>{
    try{
        const {name} = req.body;
        if(!name){
            return res.status(400).json({
                success:false,
                message:"Name required"
            });
        }
        const result = await pool.query(
            `
            UPDATE users
            SET name=$1
            WHERE id=$2
            RETURNING id,name,phone
            `,
            [
                name,
                req.user.id
            ]
        );
        if(result.rows.length === 0){

            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        }
        res.json({
            success:true,
            message:"Profile updated successfully",
            user:result.rows[0]
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.phone,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM subscriptions s
            WHERE s.user_id = u.id
          )
          THEN 'Subscribed'
          ELSE 'Not Subscribed'
        END AS subscription
      FROM users u
      ORDER BY u.id DESC;
    `);

    res.json({
      success: true,
      totalUsers: result.rows.length,
      users: result.rows,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};