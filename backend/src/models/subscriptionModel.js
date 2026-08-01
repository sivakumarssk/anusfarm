const pool = require("../config/db");


exports.getAllSubscriptions = async () => {

    const result = await pool.query(
`
SELECT 
    s.id,
    u.name,
    u.phone,

    s.plan,
    s.frequency,
    s.delivery_time,
    s.start_date,
    s.next_delivery_date,
    s.wallet_amount,
    s.payment_method,
    s.status,

    COALESCE(
        json_agg(
            json_build_object(
                'product_name', si.product_name,
                'quantity', si.quantity
            )
        ) FILTER (WHERE si.id IS NOT NULL),
        '[]'
    ) AS items


FROM subscriptions s

JOIN users u
ON s.user_id = u.id


LEFT JOIN subscription_items si
ON s.id = si.subscription_id


GROUP BY 
s.id,
u.name,
u.phone


ORDER BY s.id DESC

`
);

return result.rows;

};


exports.updateSubscriptionStatus = async(id,status)=>{

    const result = await pool.query(
        `
        UPDATE subscriptions
        SET status=$1
        WHERE id=$2
        RETURNING *
        `,
        [status,id]
    );

    return result.rows[0];

};
exports.getUserSubscriptions = async (userId) => {

const result = await pool.query(

`
SELECT

s.id,
s.plan,
s.frequency,
s.delivery_time,
s.selected_days,
s.start_date,
s.next_delivery_date,
s.status,
s.pause_from,
s.pause_to,

COALESCE(

json_agg(

json_build_object(
'id',si.id,
'product_name',si.product_name,
'quantity',si.quantity,
'price',si.price
)

) FILTER (WHERE si.id IS NOT NULL),

'[]'

) AS items

FROM subscriptions s

LEFT JOIN subscription_items si
ON s.id=si.subscription_id

WHERE s.user_id=$1

GROUP BY s.id

ORDER BY s.id DESC
`,
[userId]

);

return result.rows;

};
exports.resumeSubscription = async (id) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      status='Active',
      pause_from=NULL,
      pause_to=NULL
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};
exports.cancelSubscription = async (id) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      status='Cancelled',
      cancel_date=CURRENT_DATE
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};
exports.updateSubscriptionById = async (
  id,
  frequency,
  delivery_time,
  next_delivery_date
) => {

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET
      frequency = $1,
      delivery_time = $2,
      next_delivery_date = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      frequency,
      delivery_time,
      next_delivery_date,
      id
    ]
  );

  return result.rows[0];

};
// exports.getSubscriptionCalendar = async (id) => {

//   const result = await pool.query(
//     `
//     SELECT
//       id,
//       frequency,

//       TO_CHAR(start_date,'YYYY-MM-DD') 
//       AS start_date,

//       TO_CHAR(next_delivery_date,'YYYY-MM-DD') 
//       AS next_delivery_date,

//       TO_CHAR(pause_from,'YYYY-MM-DD') 
//       AS pause_from,

//       TO_CHAR(pause_to,'YYYY-MM-DD') 
//       AS pause_to,

//       status

//     FROM subscriptions

//     WHERE id=$1

//     `,
//     [id]
//   );


//   return result.rows[0];

// };

exports.getSubscriptionCalendar = async (id) => {

  const result = await pool.query(
    `
    SELECT
      id,
      frequency,
      start_date,
      next_delivery_date,
      pause_from,
      pause_to,
      status
    FROM subscriptions
    WHERE id=$1
    `,
    [id]
  );


  const subscription = result.rows[0];


  if(!subscription){
    return null;
  }


  let deliveries = [];


  let currentDate =
    new Date(subscription.next_delivery_date);


  const today = new Date();


  // generate next 30 days

  for(let i=0;i<30;i++){


    let date =
      new Date(currentDate);


    date.setDate(
      currentDate.getDate()+i
    );


    let dateString =
      date.toISOString()
      .split("T")[0];



    // skip paused dates

    if(
      subscription.pause_from &&
      subscription.pause_to
    ){

      let pauseFrom =
        new Date(subscription.pause_from);

      let pauseTo =
        new Date(subscription.pause_to);


      if(
        date >= pauseFrom &&
        date <= pauseTo
      ){
        continue;
      }

    }



    if(subscription.frequency==="Daily"){

      deliveries.push(dateString);

    }



    else if(
      subscription.frequency==="Weekly"
    ){

      if(date.getDay() === currentDate.getDay()){
        deliveries.push(dateString);
      }

    }



    else if(
      subscription.frequency==="Monthly"
    ){

      if(date.getDate() === currentDate.getDate()){
        deliveries.push(dateString);
      }

    }


  }



  return {

    ...subscription,

    deliveries

  };


};

exports.generateDeliverySchedule = async (
  subscriptionId,
  frequency,
  startDate,
  items=[]
) => {

  let dates = [];

  let date = new Date(startDate);


  for(let i=0;i<30;i++){

    let deliveryDate = new Date(date);


    if(frequency === "Daily"){

      deliveryDate.setDate(
        date.getDate()+i
      );

    }


    else if(frequency === "Weekly"){

      deliveryDate.setDate(
        date.getDate()+(i*7)
      );

    }


    else if(frequency === "Monthly"){

      deliveryDate.setMonth(
        date.getMonth()+i
      );

    }


    dates.push(
      deliveryDate
      .toISOString()
      .split("T")[0]
    );

  }



  for(let d of dates){


    const scheduleResult =
    await pool.query(
      `
      INSERT INTO delivery_schedule
      (
        subscription_id,
        delivery_date,
        status
      )

      VALUES
      ($1,$2,'Pending')

      RETURNING id
      `,
      [
        subscriptionId,
        d
      ]
    );


    const deliveryScheduleId =
    scheduleResult.rows[0].id;



    // insert delivery products

    for(const item of items){


      await pool.query(
      `
      INSERT INTO delivery_items
      (
        delivery_schedule_id,
        product_id,
        product_name,
        quantity,
        price,
        image
      )

      VALUES
      ($1,$2,$3,$4,$5,$6)

      `,
      [
        deliveryScheduleId,
        item.id,
        item.name,
        item.quantity,
        item.price,
        item.image
      ]

      );

    }


  }


};