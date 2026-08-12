const pool = require("../config/db");


// Get user subscription transaction history

exports.getUserTransactions = async (userId) => {

    const result = await pool.query(
        `
        SELECT

        st.id,
        st.transaction_type,
        st.amount,
        st.payment_method,
        st.payment_status,
        st.transaction_id,
        st.description,
        st.created_at,

        s.plan

        FROM subscription_transactions st

        JOIN subscriptions s
        ON st.subscription_id = s.id

        WHERE st.user_id = $1

        ORDER BY st.id DESC

        `,
        [userId]
    );


    return result.rows;

};



// Admin get all transactions

exports.getAllTransactions = async () => {

    const result = await pool.query(
        `
        SELECT

        st.id,
        st.transaction_type,
        st.amount,
        st.payment_method,
        st.payment_status,
        st.transaction_id,
        st.description,
        st.created_at,

        u.name,
        u.phone,

        s.plan


        FROM subscription_transactions st


        JOIN users u
        ON st.user_id=u.id


        JOIN subscriptions s
        ON st.subscription_id=s.id


        ORDER BY st.id DESC

        `
    );


    return result.rows;

};



// Create transaction

// exports.createTransaction = async(data)=>{
//  console.log("MODEL RECEIVED:", data);

//     const {

//         subscription_id,
//         user_id,
//         transaction_type,
//         amount,
//         payment_method,
//         payment_status,
//         transaction_id,
//         description


//     } = data;

// console.log("CREATING SUBSCRIPTION TRANSACTION");
// console.log({
//   subscription_id: subscription.id,
//   user_id,
//   transaction_type: "Initial Payment",
//   amount: wallet_amount,
//   payment_method,
// });

//     const result = await pool.query(

//         `
//         INSERT INTO subscription_transactions

//         (
//         subscription_id,
//         user_id,
//         transaction_type,
//         amount,
//         payment_method,
//         payment_status,
//         transaction_id,
//         description
//         )


//         VALUES
//         ($1,$2,$3,$4,$5,$6,$7,$8)


//         RETURNING *

//         `,


//         [
//             subscription_id,
//             user_id,
//             transaction_type,
//             amount,
//             payment_method,
//             payment_status,
//             transaction_id,
//             description
//         ]

//     );


//     return result.rows[0];

// };
exports.createTransaction = async (data) => {

    console.log("MODEL RECEIVED:", data);

    const {
        subscription_id,
        user_id,
        transaction_type,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        description
    } = data;

    try {

        const result = await pool.query(
            `
            INSERT INTO subscription_transactions
            (
                subscription_id,
                user_id,
                transaction_type,
                amount,
                payment_method,
                payment_status,
                transaction_id,
                description
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                subscription_id,
                user_id,
                transaction_type,
                amount,
                payment_method,
                payment_status,
                transaction_id,
                description
            ]
        );

        console.log("TRANSACTION INSERTED:", result.rows[0]);

        return result.rows[0];

    } catch (err) {

        console.log("INSERT ERROR:", err);

        throw err;
    }
};