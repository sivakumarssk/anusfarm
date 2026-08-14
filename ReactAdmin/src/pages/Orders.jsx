// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Orders() {

//   const [data, setData] = useState({
//     summary: {},
//     orders: []
//   });

//   // Store all riders
//   const [riders, setRiders] = useState([]);


//   // ============================================================
//   // LOAD ORDERS + RIDERS
//   // ============================================================

//   useEffect(() => {

//     fetchOrders();
//     fetchRiders();

//   }, []);


//   // ============================================================
//   // FETCH ORDERS
//   // ============================================================

//   const fetchOrders = async () => {

//     try {

//       const res = await axios.get(
//         `${API_URL}/api/orders`
//       );

//       console.log(
//         "ADMIN ORDERS =",
//         res.data
//       );

//       setData(res.data);

//     } catch (error) {

//       console.log(
//         "FETCH ORDERS ERROR =",
//         error
//       );

//     }

//   };


//   // ============================================================
//   // FETCH RIDERS
//   // ============================================================

//   const fetchRiders = async () => {

//     try {

//       const res = await axios.get(
//         `${API_URL}/api/riders/all`
//       );

//       console.log(
//         "ADMIN RIDERS =",
//         res.data
//       );

//       setRiders(
//         res.data.riders || []
//       );

//     } catch (error) {

//       console.log(
//         "FETCH RIDERS ERROR =",
//         error.response?.data || error
//       );

//     }

//   };


//   // ============================================================
//   // ASSIGN RIDER
//   // ============================================================

//   const assignRider = async (
//     orderId,
//     riderId
//   ) => {

//     try {

//       if (!riderId) {
//         return;
//       }

//       console.log(
//         "ASSIGNING RIDER:",
//         riderId,
//         "TO ORDER:",
//         orderId
//       );


//       const res = await axios.put(
//         `${API_URL}/api/orders/${orderId}/assign-rider`,
//         {
//           rider_id: Number(riderId)
//         }
//       );


//       console.log(
//         "ASSIGN RIDER RESPONSE =",
//         res.data
//       );


//       alert(
//         "Rider assigned successfully"
//       );


//       // Refresh orders
//       fetchOrders();


//     } catch (error) {

//       console.log(
//         "ASSIGN RIDER ERROR =",
//         error.response?.data || error
//       );


//       alert(
//         error.response?.data?.message ||
//         "Failed to assign rider"
//       );

//     }

//   };


//   // ============================================================
//   // UPDATE ORDER STATUS
//   // ============================================================

//   const updateStatus = async (
//     id,
//     status
//   ) => {

//     try {

//       await axios.put(
//         `${API_URL}/api/orders/${id}/status`,
//         {
//           status
//         }
//       );


//       alert(
//         "Order status updated"
//       );


//       fetchOrders();


//     } catch (error) {

//       console.log(
//         "UPDATE ERROR =",
//         error
//       );


//       alert(
//         "Status update failed"
//       );

//     }

//   };


//   // ============================================================
//   // UI
//   // ============================================================

//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">


//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Orders
//       </h1>


//       {/* =====================================================
//           SUMMARY
//       ====================================================== */}

//       <div className="grid grid-cols-4 gap-6 mb-8">


//         <div className="bg-white shadow rounded-xl p-5">

//           <h3>
//             Total Orders
//           </h3>

//           <p className="text-3xl font-bold">
//             {data.summary?.total || 0}
//           </p>

//         </div>


//         <div className="bg-white shadow rounded-xl p-5">

//           <h3>
//             Delivered
//           </h3>

//           <p className="text-3xl font-bold">
//             {data.summary?.delivered || 0}
//           </p>

//         </div>


//         <div className="bg-white shadow rounded-xl p-5">

//           <h3>
//             Pending
//           </h3>

//           <p className="text-3xl font-bold">
//             {data.summary?.pending || 0}
//           </p>

//         </div>


//         <div className="bg-white shadow rounded-xl p-5">

//           <h3>
//             Cancelled
//           </h3>

//           <p className="text-3xl font-bold">
//             {data.summary?.cancelled || 0}
//           </p>

//         </div>


//       </div>


//       {/* =====================================================
//           TABLE
//       ====================================================== */}

//       <div className="bg-white rounded-xl shadow overflow-x-auto">


//         <table className="w-full">


//           <thead className="bg-gray-100">

//             <tr className="text-left">


//               <th className="p-4">
//                 Order ID
//               </th>


//               <th className="p-4">
//                 Customer
//               </th>


//               <th className="p-4">
//                 Products
//               </th>


//               <th className="p-4">
//                 Price
//               </th>


//               <th className="p-4">
//                 Address
//               </th>


//               <th className="p-4">
//                 Rider
//               </th>


//               <th className="p-4">
//                 Status
//               </th>


//             </tr>

//           </thead>


//           <tbody>


//             {data.orders?.map(
//               (order) => (

//                 <tr
//                   key={order.order_id}
//                   className="border-t"
//                 >


//                   {/* ORDER ID */}

//                   <td className="p-4">

//                     #{order.order_id}

//                   </td>


//                   {/* CUSTOMER */}

//                   <td className="p-4">

//                     <div>
//                       {order.customer_name}
//                     </div>

//                     <div className="text-sm text-gray-500">
//                       {order.customer_phone}
//                     </div>

//                   </td>


//                   {/* PRODUCTS */}

//                   <td className="p-4">

//                     {order.products?.map(
//                       (product, index) => (

//                         <div
//                           key={index}
//                           className="mb-1"
//                         >

//                           {product.product_name}

//                           {" x "}

//                           {product.quantity}

//                         </div>

//                       )
//                     )}

//                   </td>


//                   {/* PRICE */}

//                   <td className="p-4">

//                     <div className="font-semibold">

//                       ₹{order.total_amount}

//                     </div>

//                   </td>


//                   {/* ADDRESS */}

//                   <td className="p-4">

//                     {order.address ||
//                       "No Address"}

//                   </td>


//                   {/* =================================================
//                       RIDER
//                   ================================================== */}

//                   <td className="p-4">


//                     <select

//                       value={
//                         order.rider_id || ""
//                       }

//                       onChange={(e) =>
//                         assignRider(
//                           order.order_id,
//                           e.target.value
//                         )
//                       }

//                       className="
//                         border
//                         border-gray-300
//                         rounded-lg
//                         px-3
//                         py-2
//                         bg-white
//                         min-w-[180px]
//                       "
//                     >


//                       <option value="">

//                         Select Rider

//                       </option>


//                       {riders.map(
//                         (rider) => (

//                           <option
//                             key={rider.id}
//                             value={rider.id}
//                           >

//                             {rider.name}

//                             {" - "}

//                             {rider.phone}

//                           </option>

//                         )
//                       )}


//                     </select>


//                     {/* SHOW ASSIGNED RIDER */}

//                     {order.rider_name && (

//                       <div className="
//                         mt-2
//                         text-sm
//                         text-green-600
//                         font-medium
//                       ">

//                         Assigned:

//                         {" "}

//                         {order.rider_name}

//                       </div>

//                     )}


//                   </td>


//                   {/* =================================================
//                       STATUS
//                   ================================================== */}

//                   <td className="p-4">


//                     <span
//                       className={`
//                         px-3
//                         py-1
//                         rounded-full
//                         text-sm

//                         ${
//                           order.status
//                             ?.toLowerCase() ===
//                           "delivered"

//                             ? "bg-green-100 text-green-700"

//                             : order.status
//                                 ?.toLowerCase() ===
//                               "pending"

//                             ? "bg-yellow-100 text-yellow-700"

//                             : order.status
//                                 ?.toLowerCase() ===
//                               "cancelled"

//                             ? "bg-red-100 text-red-700"

//                             : "bg-blue-100 text-blue-700"
//                         }
//                       `}
//                     >

//                       {order.status}

//                     </span>


//                     {/* STATUS BUTTONS */}

//                     <div className="
//                       flex
//                       gap-2
//                       mt-4
//                       flex-wrap
//                     ">


//                       <button

//                         className="
//                           bg-blue-500
//                           text-white
//                           px-3
//                           py-1
//                           rounded
//                         "

//                         onClick={() =>
//                           updateStatus(
//                             order.order_id,
//                             "Accepted"
//                           )
//                         }

//                       >

//                         Accept

//                       </button>


//                       <button

//                         className="
//                           bg-purple-500
//                           text-white
//                           px-3
//                           py-1
//                           rounded
//                         "

//                         onClick={() =>
//                           updateStatus(
//                             order.order_id,
//                             "Packed"
//                           )
//                         }

//                       >

//                         Packed

//                       </button>


//                       <button

//                         className="
//                           bg-orange-500
//                           text-white
//                           px-3
//                           py-1
//                           rounded
//                         "

//                         onClick={() =>
//                           updateStatus(
//                             order.order_id,
//                             "Out for Delivery"
//                           )
//                         }

//                       >

//                         Out For Delivery

//                       </button>


//                       <button

//                         className="
//                           bg-green-600
//                           text-white
//                           px-3
//                           py-1
//                           rounded
//                         "

//                         onClick={() =>
//                           updateStatus(
//                             order.order_id,
//                             "Delivered"
//                           )
//                         }

//                       >

//                         Delivered

//                       </button>


//                       <button

//                         className="
//                           bg-red-600
//                           text-white
//                           px-3
//                           py-1
//                           rounded
//                         "

//                         onClick={() =>
//                           updateStatus(
//                             order.order_id,
//                             "Cancelled"
//                           )
//                         }

//                       >

//                         Cancel

//                       </button>


//                     </div>


//                   </td>


//                 </tr>

//               )
//             )}


//           </tbody>


//         </table>


//       </div>


//     </div>

//   );

// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Orders() {

  const [data, setData] = useState({
    summary: {},
    orders: []
  });

  // All riders
  const [riders, setRiders] = useState([]);


  // ============================================================
  // LOAD ORDERS + RIDERS
  // ============================================================

  useEffect(() => {

    fetchOrders();
    fetchRiders();

  }, []);


  // ============================================================
  // FETCH ORDERS
  // ============================================================

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/orders`
      );

      console.log(
        "ADMIN ORDERS =",
        res.data
      );

      setData(res.data);

    } catch (error) {

      console.log(
        "FETCH ORDERS ERROR =",
        error.response?.data || error
      );

    }

  };


  // ============================================================
  // FETCH RIDERS
  // ============================================================

  const fetchRiders = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/riders/all`
      );

      console.log(
        "ADMIN RIDERS =",
        res.data
      );

      setRiders(
        res.data.riders || []
      );

    } catch (error) {

      console.log(
        "FETCH RIDERS ERROR =",
        error.response?.data || error
      );

    }

  };


  // ============================================================
  // ASSIGN / CHANGE RIDER
  // ============================================================

  const assignRider = async (
    orderId,
    riderId
  ) => {

    try {

      if (!riderId) {
        return;
      }

      console.log(
        "ASSIGNING RIDER:",
        riderId,
        "TO ORDER:",
        orderId
      );


      const res = await axios.put(
        `${API_URL}/api/orders/${orderId}/assign-rider`,
        {
          rider_id: Number(riderId)
        }
      );


      console.log(
        "ASSIGN RIDER RESPONSE =",
        res.data
      );


      if (res.data.success) {

        alert(
          "Rider assigned successfully"
        );

        // Refresh orders
        await fetchOrders();

      } else {

        alert(
          res.data.message ||
          "Failed to assign rider"
        );

      }


    } catch (error) {

      console.log(
        "ASSIGN RIDER ERROR =",
        error.response?.data || error
      );


      alert(
        error.response?.data?.message ||
        "Failed to assign rider"
      );

    }

  };


  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusStyle = (status) => {

    const currentStatus =
      status?.toLowerCase();


    switch (currentStatus) {

      case "delivered":

        return {
          badge:
            "bg-green-100 text-green-700 border-green-200",
          icon: "✓"
        };


      case "cancelled":

        return {
          badge:
            "bg-red-100 text-red-700 border-red-200",
          icon: "✕"
        };


      case "out for delivery":

        return {
          badge:
            "bg-orange-100 text-orange-700 border-orange-200",
          icon: "🚚"
        };


      case "picked up":

        return {
          badge:
            "bg-purple-100 text-purple-700 border-purple-200",
          icon: "📦"
        };


      case "accepted":

        return {
          badge:
            "bg-blue-100 text-blue-700 border-blue-200",
          icon: "✓"
        };


      case "packed":

        return {
          badge:
            "bg-indigo-100 text-indigo-700 border-indigo-200",
          icon: "📦"
        };


      case "assigned":

        return {
          badge:
            "bg-cyan-100 text-cyan-700 border-cyan-200",
          icon: "🚴"
        };


      case "pending":

        return {
          badge:
            "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: "⏳"
        };


      default:

        return {
          badge:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: "•"
        };

    }

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="p-6 bg-gray-50 min-h-screen">


      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage orders and assign riders
        </p>

      </div>


      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


        {/* TOTAL */}

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            {data.summary?.total || 0}
          </p>

        </div>


        {/* DELIVERED */}

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Delivered
          </p>

          <p className="text-3xl font-bold text-green-600 mt-1">
            {data.summary?.delivered || 0}
          </p>

        </div>


        {/* PENDING */}

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {data.summary?.pending || 0}
          </p>

        </div>


        {/* CANCELLED */}

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Cancelled
          </p>

          <p className="text-3xl font-bold text-red-600 mt-1">
            {data.summary?.cancelled || 0}
          </p>

        </div>

      </div>


      {/* ======================================================
          ORDERS TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">


        <table className="w-full">


          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead className="bg-gray-50 border-b">

            <tr className="text-left">


              <th className="p-4 text-sm font-semibold text-gray-600">
                Order ID
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Customer
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Products
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Price
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Address
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Rider
              </th>


              <th className="p-4 text-sm font-semibold text-gray-600">
                Status
              </th>


            </tr>

          </thead>


          {/* ==================================================
              TABLE BODY
          ================================================== */}

          <tbody>


            {data.orders?.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-12 text-gray-500"
                >

                  No orders found

                </td>

              </tr>

            ) : (

              data.orders?.map(
                (order) => (

                  <tr
                    key={order.order_id}
                    className="border-b hover:bg-gray-50 transition"
                  >


                    {/* =========================================
                        ORDER ID
                    ========================================== */}

                    <td className="p-4">

                      <span className="font-semibold text-gray-800">

                        #{order.order_id}

                      </span>

                    </td>


                    {/* =========================================
                        CUSTOMER
                    ========================================== */}

                    <td className="p-4">

                      <div className="font-medium text-gray-800">

                        {order.customer_name ||
                          "Unknown"}

                      </div>

                      <div className="text-sm text-gray-500 mt-1">

                        {order.customer_phone ||
                          "No phone"}

                      </div>

                    </td>


                    {/* =========================================
                        PRODUCTS
                    ========================================== */}

                    <td className="p-4">

                      {order.products?.length > 0 ? (

                        <div className="space-y-1">

                          {order.products.map(
                            (product, index) => (

                              <div
                                key={index}
                                className="text-sm text-gray-700"
                              >

                                <span className="font-medium">

                                  {product.product_name}

                                </span>

                                <span className="text-gray-500">

                                  {" × "}
                                  {product.quantity}

                                </span>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <span className="text-gray-400">
                          No products
                        </span>

                      )}

                    </td>


                    {/* =========================================
                        PRICE
                    ========================================== */}

                    <td className="p-4">

                      <span className="font-semibold text-gray-800">

                        ₹
                        {Number(
                          order.total_amount || 0
                        ).toFixed(2)}

                      </span>

                    </td>


                    {/* =========================================
                        ADDRESS
                    ========================================== */}

                    <td className="p-4 max-w-xs">

                      {order.address ? (

                        <div className="flex items-start gap-2">

                          <span>
                            📍
                          </span>

                          <span className="text-sm text-gray-600">

                            {order.address}

                          </span>

                        </div>

                      ) : (

                        <span className="text-sm text-gray-400">

                          No Address

                        </span>

                      )}

                    </td>


                    {/* =========================================
                        RIDER
                    ========================================== */}

                    <td className="p-4">


                      <div className="min-w-[190px]">


                        {/* RIDER SELECT */}

                        <select
                          value={
                            order.rider_id || ""
                          }

                          onChange={(e) =>
                            assignRider(
                              order.order_id,
                              e.target.value
                            )
                          }

                          className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            px-3
                            py-2
                            bg-white
                            text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                          "
                        >


                          <option value="">

                            Select Rider

                          </option>


                          {riders.map(
                            (rider) => (

                              <option
                                key={rider.id}
                                value={rider.id}
                              >

                                {rider.name}
                                {" - "}
                                {rider.phone}

                              </option>

                            )
                          )}

                        </select>


                        {/* CURRENT RIDER */}

                        {order.rider_name && (

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mt-2
                              text-sm
                              text-green-600
                              font-medium
                            "
                          >

                            <span>
                              🚴
                            </span>

                            <span>

                              {order.rider_name}

                            </span>

                          </div>

                        )}


                        {!order.rider_id && (

                          <div className="text-xs text-orange-500 mt-2">

                            ⚠ Rider not assigned

                          </div>

                        )}

                      </div>

                    </td>


                    {/* =========================================
                        STATUS
                    ========================================== */}

                    <td className="p-4">

                      {(() => {

                        const statusStyle =
                          getStatusStyle(
                            order.status
                          );

                        return (

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1.5
                              rounded-full
                              border
                              text-xs
                              font-semibold
                              whitespace-nowrap
                              ${statusStyle.badge}
                            `}
                          >

                            <span>
                              {statusStyle.icon}
                            </span>

                            <span>
                              {order.status ||
                                "Pending"}
                            </span>

                          </span>

                        );

                      })()}

                    </td>


                  </tr>

                )

              )

            )}

          </tbody>

        </table>

      </div>


      {/* ======================================================
          INFORMATION
      ====================================================== */}

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

        <p className="text-sm text-blue-700">

          <span className="font-semibold">
            Note:
          </span>{" "}

          Order status is updated by the rider from the
          Rider App. Admin can only assign or change the
          rider.

        </p>

      </div>


    </div>

  );

}