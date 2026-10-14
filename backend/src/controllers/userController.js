const pool = require("../config/db");

//=============// CREATE USER// ======================
exports.createUser = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }
    const check = await pool.query(
      "SELECT * FROM users WHERE phone=$1", [phone]);
    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const result = await pool.query(` INSERT INTO users(name, phone) VALUES($1,$2) RETURNING id,name,phone `,[name, phone]);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch(error){
    console.log(error);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

    // ======================
// GET ALL USERS
// ======================
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
                        AND s.status IN ('Active', 'Paused')
                    )
                    THEN 'Subscribed'
                    ELSE 'Not Subscribed'
                END AS subscription

            FROM users u

            ORDER BY u.id DESC
        `);

        res.json({
            success: true,
            totalUsers: result.rows.length,
            users: result.rows
        });

    } catch (error) {

        console.log("GET ALL USERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ======================// GET USER BY ID// ======================
exports.getUserById = async(req,res)=>{

try{
const {id}=req.params;
const result = await pool.query(
`SELECT
id,
name,
phone
FROM users
WHERE id=$1 `,[id]);
if(result.rows.length===0){
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



// ======================// GET PROFILE// ======================
exports.getProfile = async(req,res)=>{
try{
const result = await pool.query(
`SELECT
id,
name,
phone
FROM users
WHERE id=$1
`,[req.user.id]);
if(result.rows.length===0){
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
// ======================// UPDATE USER// ======================
exports.updateUser = async(req,res)=>{
try{
const {id}=req.params;
const {name,phone}=req.body;
const result = await pool.query(
`UPDATE users
SET
name=$1,
phone=$2

WHERE id=$3

RETURNING id,name,phone
`,[name,phone,id]);
if(result.rows.length===0){
return res.status(404).json({
success:false,
message:"User not found"
});
}
res.json({
success:true,
message:"User updated successfully",
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
// ======================// UPDATE PROFILE// ======================
exports.updateProfile = async(req,res)=>{
try{
const {name}=req.body;
const result = await pool.query(
`UPDATE users
SET name=$1
WHERE id=$2
RETURNING id,name,phone
`,[name,req.user.id]);
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
// ======================// DELETE USER// ======================
// exports.deleteUser = async(req,res)=>{
// try{
// const {id}=req.params;
// const result = await pool.query(
// `DELETE FROM users
// WHERE id=$1
// RETURNING *
// `,[id]);
// if(result.rows.length===0){
// return res.status(404).json({
// success:false,
// message:"User not found"
// });
// }
// res.json({
// success:true,
// message:"User deleted successfully"
// });
// }catch(error){
// console.log(error);
// res.status(500).json({
// success:false,
// message:error.message
// });
// }
// };

// ======================
// DELETE USER + ALL SUBSCRIPTION DATA
// ======================
exports.deleteUser = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        await client.query("BEGIN");

        // 1. Check user
        const userResult = await client.query(
            `
            SELECT id, name, phone
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // 2. Delete delivery items
        await client.query(
            `
            DELETE FROM delivery_items
            WHERE delivery_schedule_id IN (
                SELECT sds.id
                FROM subscription_delivery_schedule sds
                INNER JOIN subscriptions s
                    ON s.id = sds.subscription_id
                WHERE s.user_id = $1
            )
            `,
            [id]
        );


        // 3. Delete delivery schedules
        await client.query(
            `
            DELETE FROM subscription_delivery_schedule
            WHERE subscription_id IN (
                SELECT id
                FROM subscriptions
                WHERE user_id = $1
            )
            `,
            [id]
        );


        // 4. Delete subscription transactions
        await client.query(
            `
            DELETE FROM subscription_transactions
            WHERE user_id = $1
            `,
            [id]
        );


        // 5. Delete subscription items
        await client.query(
            `
            DELETE FROM subscription_items
            WHERE subscription_id IN (
                SELECT id
                FROM subscriptions
                WHERE user_id = $1
            )
            `,
            [id]
        );


        // 6. Delete subscriptions
        await client.query(
            `
            DELETE FROM subscriptions
            WHERE user_id = $1
            `,
            [id]
        );
// 7. Remove address references from this user's orders
await client.query(
    `
    UPDATE orders
    SET address_id = NULL
    WHERE address_id IN (
        SELECT id
        FROM addresses
        WHERE user_id = $1
    )
    `,
    [id]
);


// 8. Delete addresses
await client.query(
    `
    DELETE FROM addresses
    WHERE user_id = $1
    `,
    [id]
);

        // 8. Delete user locations
        await client.query(
            `
            DELETE FROM user_locations
            WHERE user_id = $1
            `,
            [id]
        );


        // 9. Delete user
        const deletedUser = await client.query(
            `
            DELETE FROM users
            WHERE id = $1
            RETURNING id, name, phone
            `,
            [id]
        );


        await client.query("COMMIT");


        res.json({
            success: true,
            message: "User and all related data deleted successfully",
            user: deletedUser.rows[0]
        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "DELETE USER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();
    }
};