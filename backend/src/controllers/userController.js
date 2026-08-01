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
// ======================// GET ALL USERS// ======================
exports.getAllUsers = async(req,res)=>{
try{
const result = await pool.query(`
SELECT
u.id,
u.name,
u.phone,
CASE
WHEN EXISTS(
SELECT 1
FROM subscriptions s
WHERE s.user_id=u.id
)
THEN 'Subscribed'
ELSE 'Not Subscribed'
END AS subscription

FROM users u
ORDER BY u.id DESC
`);
res.json({
success:true,
totalUsers:result.rows.length,
users:result.rows
});
}catch(error){
console.log(error);
res.status(500).json({
success:false,
message:error.message
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
exports.deleteUser = async(req,res)=>{
try{
const {id}=req.params;
const result = await pool.query(
`DELETE FROM users
WHERE id=$1
RETURNING *
`,[id]);
if(result.rows.length===0){
return res.status(404).json({
success:false,
message:"User not found"
});
}
res.json({
success:true,
message:"User deleted successfully"
});
}catch(error){
console.log(error);
res.status(500).json({
success:false,
message:error.message
});
}
};