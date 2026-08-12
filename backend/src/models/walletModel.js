const pool = require("../config/db");


// Get Wallet Balance
const getWallet = async (userId) => {

  const result = await pool.query(
    `
    SELECT *
    FROM wallets
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};



// Add Money
const addMoney = async (userId, amount) => {

  await pool.query(
    `
    UPDATE wallets
    SET balance = balance + $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    `,
    [amount, userId]
  );


  const wallet = await getWallet(userId);


  await pool.query(
    `
    INSERT INTO wallet_transactions
    (wallet_id, user_id, type, amount, description)
    VALUES ($1,$2,$3,$4,$5)
    `,
    [
      wallet.id,
      userId,
      "credit",
      amount,
      "Money Added"
    ]
  );


  return wallet;

};




// Deduct Wallet Money
const deductMoney = async(userId, amount)=>{


const result = await pool.query(
`
UPDATE wallets
SET balance = balance - $1,
updated_at = CURRENT_TIMESTAMP
WHERE user_id=$2
RETURNING *
`,
[
amount,
userId
]
);


return result.rows[0];

};




// Create Transaction History
const createTransaction = async(
userId,
amount,
type,
description
)=>{


const wallet = await getWallet(userId);


const result = await pool.query(
`
INSERT INTO wallet_transactions
(
wallet_id,
user_id,
type,
amount,
description
)
VALUES($1,$2,$3,$4,$5)
RETURNING *
`,
[
wallet.id,
userId,
type,
amount,
description
]
);


return result.rows[0];

};




// Transaction History
const getTransactions = async (userId) => {


  const result = await pool.query(
    `
    SELECT *
    FROM wallet_transactions
    WHERE user_id = $1
    ORDER BY id DESC
    `,
    [userId]
  );


  return result.rows;

};




module.exports = {

getWallet,

addMoney,

deductMoney,

createTransaction,

getTransactions,

};