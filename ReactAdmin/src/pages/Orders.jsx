


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Orders() {

//   const [data, setData] = useState({
//     summary: {},
//     orders: [],
//   });

//   const [riders, setRiders] = useState([]);

//   // ACTIVE / OLD ORDERS
//   const [orderType, setOrderType] = useState("active");

//   // LOAD ORDERS + RIDERS
//   useEffect(() => {
//     fetchOrders();
//     fetchRiders();
//   }, []);

//   // FETCH ORDERS
//   const fetchOrders = async () => {
//     try {

//       const res = await axios.get(
//         `${API_URL}/api/orders`
//       );

//       console.log("ADMIN ORDERS =", res.data);

//       setData(res.data);

//     } catch (error) {

//       console.log(
//         "FETCH ORDERS ERROR =",
//         error.response?.data || error
//       );

//     }
//   };

//   // FETCH RIDERS
//   const fetchRiders = async () => {
//     try {

//       const res = await axios.get(
//         `${API_URL}/api/riders/all`
//       );

//       console.log("ADMIN RIDERS =", res.data);

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

//   // ASSIGN / CHANGE RIDER
//   const assignRider = async (
//     orderId,
//     riderId
//   ) => {

//     try {

//       if (!riderId) return;

//       console.log(
//         "ASSIGNING RIDER:",
//         riderId,
//         "TO ORDER:",
//         orderId
//       );

//       const res = await axios.put(
//         `${API_URL}/api/orders/${orderId}/assign-rider`,
//         {
//           rider_id: Number(riderId),
//         }
//       );

//       console.log(
//         "ASSIGN RIDER RESPONSE =",
//         res.data
//       );

//       if (res.data.success) {

//         alert(
//           "Rider assigned successfully"
//         );

//         await fetchOrders();

//       } else {

//         alert(
//           res.data.message ||
//           "Failed to assign rider"
//         );

//       }

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

//   // =====================================================
//   // GET DATE FROM ORDER
//   // =====================================================

//   const getOrderDate = (order) => {

//     return (
//       order.created_at ||
//       order.order_date ||
//       order.createdAt ||
//       order.date ||
//       null
//     );

//   };

//   // =====================================================
//   // FILTER ORDERS
//   // =====================================================

//   const filteredOrders =
//     data.orders?.filter((order) => {

//       const rawDate =
//         getOrderDate(order);

//       // If order has no date
//       if (!rawDate) {
//         return false;
//       }

//       const orderDate =
//         new Date(rawDate);

//       if (
//         Number.isNaN(
//           orderDate.getTime()
//         )
//       ) {
//         return false;
//       }

//       // Today's date
//       const today =
//         new Date();

//       today.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       // Order date
//       orderDate.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       // ACTIVE = TODAY
//       if (orderType === "active") {

//         return (
//           orderDate.getTime() ===
//           today.getTime()
//         );

//       }

//       // OLD = BEFORE TODAY
//       return (
//         orderDate.getTime() <
//         today.getTime()
//       );

//     }) || [];

//   // =====================================================
//   // STATUS BADGE
//   // =====================================================

//   const getStatusStyle = (
//     status
//   ) => {

//     const currentStatus =
//       status?.toLowerCase();

//     switch (currentStatus) {

//       case "delivered":

//         return {
//           badge:
//             "bg-green-100 text-green-700 border-green-200",
//           icon: "✓",
//         };

//       case "cancelled":

//         return {
//           badge:
//             "bg-red-100 text-red-700 border-red-200",
//           icon: "✕",
//         };

//       case "out for delivery":

//         return {
//           badge:
//             "bg-orange-100 text-orange-700 border-orange-200",
//           icon: "🚚",
//         };

//       case "picked up":

//         return {
//           badge:
//             "bg-purple-100 text-purple-700 border-purple-200",
//           icon: "📦",
//         };

//       case "accepted":

//         return {
//           badge:
//             "bg-blue-100 text-blue-700 border-blue-200",
//           icon: "✓",
//         };

//       case "packed":

//         return {
//           badge:
//             "bg-indigo-100 text-indigo-700 border-indigo-200",
//           icon: "📦",
//         };

//       case "assigned":

//         return {
//           badge:
//             "bg-cyan-100 text-cyan-700 border-cyan-200",
//           icon: "🚴",
//         };

//       case "pending":

//         return {
//           badge:
//             "bg-yellow-100 text-yellow-700 border-yellow-200",
//           icon: "⏳",
//         };

//       default:

//         return {
//           badge:
//             "bg-gray-100 text-gray-700 border-gray-200",
//           icon: "•",
//         };

//     }

//   };

//   // =====================================================
//   // STATUS BADGE COMPONENT
//   // =====================================================

//   const StatusBadge = ({
//     status
//   }) => {

//     const statusStyle =
//       getStatusStyle(status);

//     return (

//       <span
//         className={`
//           inline-flex
//           items-center
//           gap-1.5
//           px-3
//           py-1.5
//           rounded-full
//           border
//           text-xs
//           font-semibold
//           whitespace-nowrap
//           ${statusStyle.badge}
//         `}
//       >

//         <span>
//           {statusStyle.icon}
//         </span>

//         <span>
//           {status || "Pending"}
//         </span>

//       </span>

//     );

//   };

//   // =====================================================
//   // RIDER SELECT COMPONENT
//   // =====================================================

//   const RiderSelect = ({
//     order
//   }) => {

//     return (

//       <div className="min-w-0">

//         <select

//           value={
//             order.rider_id || ""
//           }

//           onChange={(e) =>
//             assignRider(
//               order.order_id,
//               e.target.value
//             )
//           }

//           className="
//             w-full
//             min-w-0
//             border
//             border-gray-300
//             rounded-lg
//             px-3
//             py-2.5
//             bg-white
//             text-sm
//             focus:outline-none
//             focus:ring-2
//             focus:ring-green-500
//           "
//         >

//           <option value="">
//             Select Rider
//           </option>

//           {riders.map(
//             (rider) => (

//               <option
//                 key={rider.id}
//                 value={rider.id}
//               >

//                 {rider.name}
//                 {" - "}
//                 {rider.phone}

//               </option>

//             )
//           )}

//         </select>

//         {order.rider_name && (

//           <div className="
//             flex
//             items-center
//             gap-2
//             mt-2
//             text-sm
//             text-green-600
//             font-medium
//           ">

//             <span>
//               🚴
//             </span>

//             <span>
//               {order.rider_name}
//             </span>

//           </div>

//         )}

//         {!order.rider_id && (

//           <div className="
//             text-xs
//             text-orange-500
//             mt-2
//           ">

//             ⚠ Rider not assigned

//           </div>

//         )}

//       </div>

//     );

//   };

//   return (

//     <div className="
//       w-full
//       min-w-0
//       min-h-screen
//       bg-gray-50
//       p-4
//       sm:p-6
//       lg:p-8
//       overflow-x-hidden
//     ">

//       {/* ================================================= */}
//       {/* PAGE HEADER */}
//       {/* ================================================= */}

//       <div className="mb-6">

//         <h1 className="
//           text-2xl
//           sm:text-3xl
//           font-bold
//           text-gray-800
//         ">

//           Orders

//         </h1>

//         <p className="
//           text-gray-500
//           mt-1
//           text-sm
//           sm:text-base
//         ">

//           Manage orders and assign riders

//         </p>

//       </div>

//       {/* ================================================= */}
//       {/* ACTIVE / OLD ORDERS */}
//       {/* ================================================= */}

//       <div className="
//         flex
//         gap-3
//         mb-6
//         flex-wrap
//       ">

//         <button

//           onClick={() =>
//             setOrderType("active")
//           }

//           className={`
//             px-5
//             py-3
//             rounded-xl
//             font-semibold
//             transition
//             ${
//               orderType === "active"
//                 ? "bg-green-600 text-white shadow"
//                 : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
//             }
//           `}
//         >

//           Active Orders

//         </button>

//         <button

//           onClick={() =>
//             setOrderType("old")
//           }

//           className={`
//             px-5
//             py-3
//             rounded-xl
//             font-semibold
//             transition
//             ${
//               orderType === "old"
//                 ? "bg-green-600 text-white shadow"
//                 : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
//             }
//           `}
//         >

//           Old Orders

//         </button>

//       </div>

//       {/* ================================================= */}
//       {/* SUMMARY CARDS */}
//       {/* ================================================= */}

//       <div className="
//         grid
//         grid-cols-2
//         xl:grid-cols-4
//         gap-3
//         sm:gap-5
//         mb-6
//         sm:mb-8
//       ">

//         {/* TOTAL */}

//         <div className="
//           bg-white
//           shadow-sm
//           border
//           border-gray-100
//           rounded-xl
//           p-4
//           sm:p-5
//           min-w-0
//         ">

//           <p className="
//             text-xs
//             sm:text-sm
//             text-gray-500
//           ">

//             {orderType === "active"
//               ? "Today's Orders"
//               : "Old Orders"}

//           </p>

//           <p className="
//             text-2xl
//             sm:text-3xl
//             font-bold
//             text-gray-800
//             mt-1
//           ">

//             {filteredOrders.length}

//           </p>

//         </div>

//         {/* DELIVERED */}

//         <div className="
//           bg-white
//           shadow-sm
//           border
//           border-gray-100
//           rounded-xl
//           p-4
//           sm:p-5
//           min-w-0
//         ">

//           <p className="
//             text-xs
//             sm:text-sm
//             text-gray-500
//           ">

//             Delivered

//           </p>

//           <p className="
//             text-2xl
//             sm:text-3xl
//             font-bold
//             text-green-600
//             mt-1
//           ">

//             {
//               filteredOrders.filter(
//                 (order) =>
//                   order.status
//                     ?.toLowerCase() ===
//                   "delivered"
//               ).length
//             }

//           </p>

//         </div>

//         {/* PENDING */}

//         <div className="
//           bg-white
//           shadow-sm
//           border
//           border-gray-100
//           rounded-xl
//           p-4
//           sm:p-5
//           min-w-0
//         ">

//           <p className="
//             text-xs
//             sm:text-sm
//             text-gray-500
//           ">

//             Pending

//           </p>

//           <p className="
//             text-2xl
//             sm:text-3xl
//             font-bold
//             text-yellow-600
//             mt-1
//           ">

//             {
//               filteredOrders.filter(
//                 (order) =>
//                   order.status
//                     ?.toLowerCase() ===
//                   "pending"
//               ).length
//             }

//           </p>

//         </div>

//         {/* CANCELLED */}

//         <div className="
//           bg-white
//           shadow-sm
//           border
//           border-gray-100
//           rounded-xl
//           p-4
//           sm:p-5
//           min-w-0
//         ">

//           <p className="
//             text-xs
//             sm:text-sm
//             text-gray-500
//           ">

//             Cancelled

//           </p>

//           <p className="
//             text-2xl
//             sm:text-3xl
//             font-bold
//             text-red-600
//             mt-1
//           ">

//             {
//               filteredOrders.filter(
//                 (order) =>
//                   order.status
//                     ?.toLowerCase() ===
//                   "cancelled"
//               ).length
//             }

//           </p>

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* MOBILE ORDERS */}
//       {/* ================================================= */}

//       <div className="
//         block
//         lg:hidden
//         space-y-4
//       ">

//         {filteredOrders.length === 0 ? (

//           <div className="
//             bg-white
//             rounded-xl
//             p-6
//             text-center
//             text-gray-500
//             border
//             border-gray-100
//           ">

//             {orderType === "active"
//               ? "No orders for today"
//               : "No old orders found"}

//           </div>

//         ) : (

//           filteredOrders.map(
//             (order) => (

//               <div
//                 key={order.order_id}
//                 className="
//                   bg-white
//                   border
//                   border-gray-200
//                   rounded-xl
//                   p-4
//                   shadow-sm
//                   min-w-0
//                 "
//               >

//                 {/* ORDER ID + STATUS */}

//                 <div className="
//                   flex
//                   flex-wrap
//                   justify-between
//                   items-center
//                   gap-3
//                   mb-4
//                   pb-3
//                   border-b
//                   border-gray-100
//                 ">

//                   <h3 className="
//                     font-bold
//                     text-gray-800
//                     text-base
//                   ">

//                     Order #{order.order_id}

//                   </h3>

//                   <StatusBadge
//                     status={order.status}
//                   />

//                 </div>

//                 {/* DATE */}

//                 <div className="mb-4">

//                   <p className="
//                     text-xs
//                     text-gray-500
//                     mb-1
//                   ">

//                     Order Date

//                   </p>

//                   <p className="
//                     text-sm
//                     text-gray-600
//                   ">

//                     {getOrderDate(order)
//                       ? new Date(
//                           getOrderDate(order)
//                         ).toLocaleString()
//                       : "-"}

//                   </p>

//                 </div>

//                 {/* CUSTOMER */}

//                 <div className="mb-4">

//                   <p className="
//                     text-xs
//                     text-gray-500
//                     mb-1
//                   ">

//                     Customer

//                   </p>

//                   <p className="
//                     font-medium
//                     text-gray-800
//                     break-words
//                   ">

//                     {order.customer_name ||
//                       "Unknown"}

//                   </p>

//                   <p className="
//                     text-sm
//                     text-gray-500
//                     mt-1
//                   ">

//                     {order.customer_phone ||
//                       "No phone"}

//                   </p>

//                 </div>

//                 {/* PRODUCTS */}

//                 <div className="mb-4">

//                   <p className="
//                     text-xs
//                     text-gray-500
//                     mb-2
//                   ">

//                     Products

//                   </p>

//                   {order.products?.length > 0 ? (

//                     <div className="space-y-2">

//                       {order.products.map(
//                         (product, index) => (

//                           <div
//                             key={index}
//                             className="
//                               flex
//                               justify-between
//                               items-start
//                               gap-3
//                               text-sm
//                             "
//                           >

//                             <span className="
//                               text-gray-700
//                               break-words
//                               min-w-0
//                             ">

//                               {product.product_name}

//                             </span>

//                             <span className="
//                               text-gray-500
//                               whitespace-nowrap
//                             ">

//                               × {product.quantity}

//                             </span>

//                           </div>

//                         )
//                       )}

//                     </div>

//                   ) : (

//                     <p className="
//                       text-sm
//                       text-gray-400
//                     ">

//                       No products

//                     </p>

//                   )}

//                 </div>

//                 {/* PRICE */}

//                 <div className="mb-4">

//                   <p className="
//                     text-xs
//                     text-gray-500
//                     mb-1
//                   ">

//                     Total Price

//                   </p>

//                   <p className="
//                     font-bold
//                     text-gray-800
//                     text-lg
//                   ">

//                     ₹
//                     {Number(
//                       order.total_amount || 0
//                     ).toFixed(2)}

//                   </p>

//                 </div>

//                 {/* ADDRESS */}

//                 <div className="mb-4">

//                   <p className="
//                     text-xs
//                     text-gray-500
//                     mb-1
//                   ">

//                     Address

//                   </p>

//                   {order.address ? (

//                     <div className="
//                       flex
//                       items-start
//                       gap-2
//                     ">

//                       <span>
//                         📍
//                       </span>

//                       <span className="
//                         text-sm
//                         text-gray-600
//                         break-words
//                         min-w-0
//                       ">

//                         {order.address}

//                       </span>

//                     </div>

//                   ) : (

//                     <p className="
//                       text-sm
//                       text-gray-400
//                     ">

//                       No Address

//                     </p>

//                   )}

//                 </div>

//                 {/* RIDER */}

//                 <div className="
//                   pt-4
//                   border-t
//                   border-gray-100
//                 ">

//                   <label className="
//                     block
//                     text-xs
//                     text-gray-500
//                     mb-2
//                   ">

//                     Assign Rider

//                   </label>

//                   <RiderSelect
//                     order={order}
//                   />

//                 </div>

//               </div>

//             )
//           )

//         )}

//       </div>

//       {/* ================================================= */}
//       {/* DESKTOP ORDERS TABLE */}
//       {/* ================================================= */}

//       <div className="
//         hidden
//         lg:block
//         bg-white
//         rounded-xl
//         shadow-sm
//         border
//         border-gray-100
//         overflow-hidden
//       ">

//         <div className="
//           w-full
//           overflow-x-auto
//         ">

//           <table className="
//             w-full
//             min-w-[1000px]
//           ">

//             {/* TABLE HEADER */}

//             <thead className="
//               bg-gray-50
//               border-b
//             ">

//               <tr className="text-left">

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Order ID

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Date

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Customer

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Products

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Price

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Address

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Rider

//                 </th>

//                 <th className="
//                   p-4
//                   text-sm
//                   font-semibold
//                   text-gray-600
//                 ">

//                   Status

//                 </th>

//               </tr>

//             </thead>

//             {/* TABLE BODY */}

//             <tbody>

//               {filteredOrders.length === 0 ? (

//                 <tr>

//                   <td
//                     colSpan="8"
//                     className="
//                       text-center
//                       py-12
//                       text-gray-500
//                     "
//                   >

//                     {orderType === "active"
//                       ? "No orders for today"
//                       : "No old orders found"}

//                   </td>

//                 </tr>

//               ) : (

//                 filteredOrders.map(
//                   (order) => (

//                     <tr
//                       key={order.order_id}
//                       className="
//                         border-b
//                         hover:bg-gray-50
//                         transition
//                       "
//                     >

//                       {/* ORDER ID */}

//                       <td className="p-4">

//                         <span className="
//                           font-semibold
//                           text-gray-800
//                         ">

//                           #{order.order_id}

//                         </span>

//                       </td>

//                       {/* DATE */}

//                       <td className="p-4">

//                         <span className="
//                           text-sm
//                           text-gray-600
//                           whitespace-nowrap
//                         ">

//                           {getOrderDate(order)
//                             ? new Date(
//                                 getOrderDate(order)
//                               ).toLocaleDateString()
//                             : "-"}

//                         </span>

//                       </td>

//                       {/* CUSTOMER */}

//                       <td className="p-4">

//                         <div className="
//                           font-medium
//                           text-gray-800
//                         ">

//                           {order.customer_name ||
//                             "Unknown"}

//                         </div>

//                         <div className="
//                           text-sm
//                           text-gray-500
//                           mt-1
//                         ">

//                           {order.customer_phone ||
//                             "No phone"}

//                         </div>

//                       </td>

//                       {/* PRODUCTS */}

//                       <td className="p-4">

//                         {order.products?.length > 0 ? (

//                           <div className="space-y-1">

//                             {order.products.map(
//                               (product, index) => (

//                                 <div
//                                   key={index}
//                                   className="
//                                     text-sm
//                                     text-gray-700
//                                   "
//                                 >

//                                   <span className="
//                                     font-medium
//                                   ">

//                                     {product.product_name}

//                                   </span>

//                                   <span className="
//                                     text-gray-500
//                                   ">

//                                     {" × "}
//                                     {product.quantity}

//                                   </span>

//                                 </div>

//                               )
//                             )}

//                           </div>

//                         ) : (

//                           <span className="
//                             text-gray-400
//                           ">

//                             No products

//                           </span>

//                         )}

//                       </td>

//                       {/* PRICE */}

//                       <td className="p-4">

//                         <span className="
//                           font-semibold
//                           text-gray-800
//                           whitespace-nowrap
//                         ">

//                           ₹
//                           {Number(
//                             order.total_amount || 0
//                           ).toFixed(2)}

//                         </span>

//                       </td>

//                       {/* ADDRESS */}

//                       <td className="
//                         p-4
//                         max-w-xs
//                       ">

//                         {order.address ? (

//                           <div className="
//                             flex
//                             items-start
//                             gap-2
//                           ">

//                             <span>
//                               📍
//                             </span>

//                             <span className="
//                               text-sm
//                               text-gray-600
//                               break-words
//                             ">

//                               {order.address}

//                             </span>

//                           </div>

//                         ) : (

//                           <span className="
//                             text-sm
//                             text-gray-400
//                           ">

//                             No Address

//                           </span>

//                         )}

//                       </td>

//                       {/* RIDER */}

//                       <td className="p-4">

//                         <div className="
//                           min-w-[190px]
//                         ">

//                           <RiderSelect
//                             order={order}
//                           />

//                         </div>

//                       </td>

//                       {/* STATUS */}

//                       <td className="p-4">

//                         <StatusBadge
//                           status={order.status}
//                         />

//                       </td>

//                     </tr>

//                   )
//                 )

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* INFORMATION */}
//       {/* ================================================= */}

//       <div className="
//         mt-5
//         bg-blue-50
//         border
//         border-blue-100
//         rounded-xl
//         p-4
//       ">

//         <p className="
//           text-sm
//           text-blue-700
//         ">

//           <span className="font-semibold">
//             Note:
//           </span>{" "}

//           {orderType === "active"
//             ? "Active Orders shows today's orders."
//             : "Old Orders shows orders from previous days."}

//           {" "}Order status is updated by the rider from the Rider App.
//           Admin can only assign or change the rider.

//         </p>

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
    orders: [],
  });

  const [riders, setRiders] = useState([]);

  // ACTIVE / OLD ORDERS
  const [orderType, setOrderType] =
    useState("active");

  // =====================================================
  // LOAD ORDERS + RIDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

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

  // =====================================================
  // FETCH RIDERS
  // =====================================================

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

  // =====================================================
  // ASSIGN / CHANGE RIDER
  // =====================================================

  const assignRider = async (
    orderId,
    riderId
  ) => {
    try {
      if (!riderId) return;

      console.log(
        "ASSIGNING RIDER:",
        riderId,
        "TO ORDER:",
        orderId
      );

      const res = await axios.put(
        `${API_URL}/api/orders/${orderId}/assign-rider`,
        {
          rider_id: Number(riderId),
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

  // =====================================================
// ADMIN CANCEL ORDER
// =====================================================

const cancelOrder = async (orderId) => {
  try {

    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    const res = await axios.put(
      `${API_URL}/api/orders/${orderId}/admin-cancel`
    );

    console.log(
      "ADMIN CANCEL RESPONSE =",
      res.data
    );

    if (res.data.success) {

      alert(
        "Order cancelled successfully"
      );

      await fetchOrders();

    } else {

      alert(
        res.data.message ||
        "Failed to cancel order"
      );
    }

  } catch (error) {

    console.log(
      "ADMIN CANCEL ERROR =",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
      "Failed to cancel order"
    );
  }
};

  // =====================================================
  // GET DELIVERY DATE FROM ORDER
  // =====================================================

  const getOrderDate = (order) => {
    return (
      order.delivery_date ||
      order.deliveryDate ||
      order.created_at ||
      order.order_date ||
      order.createdAt ||
      order.date ||
      null
    );
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  // const filteredOrders =
  //   data.orders?.filter((order) => {
  //     const rawDate =
  //       getOrderDate(order);

  //     if (!rawDate) {
  //       return false;
  //     }

  //     const orderDate =
  //       new Date(rawDate);

  //     if (
  //       Number.isNaN(
  //         orderDate.getTime()
  //       )
  //     ) {
  //       return false;
  //     }

  //     // TODAY
  //     const today = new Date();

  //     today.setHours(
  //       0,
  //       0,
  //       0,
  //       0
  //     );

  //     // TOMORROW
  //     const tomorrow =
  //       new Date(today);

  //     tomorrow.setDate(
  //       tomorrow.getDate() + 1
  //     );

  //     // DELIVERY DATE
  //     orderDate.setHours(
  //       0,
  //       0,
  //       0,
  //       0
  //     );

  //     const status =
  //       String(
  //         order.status || ""
  //       )
  //         .trim()
  //         .toLowerCase();

  //     // ==========================================
  //     // ACTIVE ORDERS
  //     // ONLY TOMORROW + PENDING
  //     // ==========================================

  //     if (
  //       orderType === "active"
  //     ) {
  //       return (
  //         orderDate.getTime() ===
  //           tomorrow.getTime() &&
  //         status === "pending"
  //       );
  //     }

  //     // ==========================================
  //     // OLD ORDERS
  //     // EVERYTHING BEFORE TOMORROW
  //     // ==========================================

  //     return (
  //       orderDate.getTime() <
  //       tomorrow.getTime()
  //     );
  //   }) || [];
  const filteredOrders =
  data.orders?.filter((order) => {
    const rawDate = getOrderDate(order);

    if (!rawDate) {
      return false;
    }

    const orderDate = new Date(rawDate);

    if (Number.isNaN(orderDate.getTime())) {
      return false;
    }

    // TODAY
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // TOMORROW
    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    // REMOVE TIME FROM ORDER DATE
    orderDate.setHours(0, 0, 0, 0);

    // ==========================================
    // ACTIVE ORDERS
    // ALL ORDERS FOR TOMORROW
    // INCLUDING CANCELLED
    // ==========================================

    if (orderType === "active") {
      return (
        orderDate.getTime() ===
        tomorrow.getTime()
      );
    }

    // ==========================================
    // OLD ORDERS
    // EVERYTHING BEFORE TOMORROW
    // ==========================================

    return (
      orderDate.getTime() <
      tomorrow.getTime()
    );
  }) || [];

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusStyle = (
    status
  ) => {
    const currentStatus =
      status?.toLowerCase();

    switch (currentStatus) {
      case "delivered":
        return {
          badge:
            "bg-green-100 text-green-700 border-green-200",
          icon: "✓",
        };

      case "cancelled":
        return {
          badge:
            "bg-red-100 text-red-700 border-red-200",
          icon: "✕",
        };

      case "out for delivery":
        return {
          badge:
            "bg-orange-100 text-orange-700 border-orange-200",
          icon: "🚚",
        };

      case "picked up":
        return {
          badge:
            "bg-purple-100 text-purple-700 border-purple-200",
          icon: "📦",
        };

      case "accepted":
        return {
          badge:
            "bg-blue-100 text-blue-700 border-blue-200",
          icon: "✓",
        };

      case "packed":
        return {
          badge:
            "bg-indigo-100 text-indigo-700 border-indigo-200",
          icon: "📦",
        };

      case "assigned":
        return {
          badge:
            "bg-cyan-100 text-cyan-700 border-cyan-200",
          icon: "🚴",
        };

      case "pending":
        return {
          badge:
            "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: "⏳",
        };

      default:
        return {
          badge:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: "•",
        };
    }
  };

  // =====================================================
  // STATUS BADGE COMPONENT
  // =====================================================

  const StatusBadge = ({
    status,
  }) => {
    const statusStyle =
      getStatusStyle(status);

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
          {status || "Pending"}
        </span>
      </span>
    );
  };

  // =====================================================
  // RIDER SELECT COMPONENT
  // =====================================================

  const RiderSelect = ({
    order,
  }) => {
    return (
      <div className="min-w-0">
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
            min-w-0
            border
            border-gray-300
            rounded-lg
            px-3
            py-2.5
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
            <span>🚴</span>

            <span>
              {order.rider_name}
            </span>
          </div>
        )}

        {!order.rider_id && (
          <div
            className="
              text-xs
              text-orange-500
              mt-2
            "
          >
            ⚠ Rider not assigned
          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount =
    filteredOrders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  const deliveredCount =
    filteredOrders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "delivered"
    ).length;

  const cancelledCount =
    filteredOrders.filter(
      (order) =>
        String(
          order.status || ""
        ).toLowerCase() ===
        "cancelled"
    ).length;

  return (
    <div
      className="
        w-full
        min-w-0
        min-h-screen
        bg-gray-50
        p-4
        sm:p-6
        lg:p-8
        overflow-x-hidden
      "
    >
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="mb-6">
        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          "
        >
          Orders
        </h1>

        <p
          className="
            text-gray-500
            mt-1
            text-sm
            sm:text-base
          "
        >
          Manage orders and assign riders
        </p>
      </div>

      {/* ================================================= */}
      {/* ACTIVE / OLD ORDERS */}
      {/* ================================================= */}

      <div
        className="
          flex
          gap-3
          mb-6
          flex-wrap
        "
      >
        <button
          onClick={() =>
            setOrderType(
              "active"
            )
          }
          className={`
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
            ${
              orderType ===
              "active"
                ? "bg-green-600 text-white shadow"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }
          `}
        >
          Active Orders
        </button>

        <button
          onClick={() =>
            setOrderType("old")
          }
          className={`
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
            ${
              orderType ===
              "old"
                ? "bg-green-600 text-white shadow"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }
          `}
        >
          Old Orders
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-4
          gap-3
          sm:gap-5
          mb-6
          sm:mb-8
        "
      >
        {/* TOTAL */}

        <div
          className="
            bg-white
            shadow-sm
            border
            border-gray-100
            rounded-xl
            p-4
            sm:p-5
            min-w-0
          "
        >
          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            {orderType ===
            "active"
              ? "Tomorrow's Pending Orders"
              : "Old Orders"}
          </p>

          <p
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-800
              mt-1
            "
          >
            {filteredOrders.length}
          </p>
        </div>

        {/* DELIVERED */}

        <div
          className="
            bg-white
            shadow-sm
            border
            border-gray-100
            rounded-xl
            p-4
            sm:p-5
            min-w-0
          "
        >
          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            Delivered
          </p>

          <p
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-green-600
              mt-1
            "
          >
            {deliveredCount}
          </p>
        </div>

        {/* PENDING */}

        <div
          className="
            bg-white
            shadow-sm
            border
            border-gray-100
            rounded-xl
            p-4
            sm:p-5
            min-w-0
          "
        >
          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            Pending
          </p>

          <p
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-yellow-600
              mt-1
            "
          >
            {pendingCount}
          </p>
        </div>

        {/* CANCELLED */}

        <div
          className="
            bg-white
            shadow-sm
            border
            border-gray-100
            rounded-xl
            p-4
            sm:p-5
            min-w-0
          "
        >
          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            Cancelled
          </p>

          <p
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-red-600
              mt-1
            "
          >
            {cancelledCount}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE ORDERS */}
      {/* ================================================= */}

      <div
        className="
          block
          lg:hidden
          space-y-4
        "
      >
        {filteredOrders.length ===
        0 ? (
          <div
            className="
              bg-white
              rounded-xl
              p-6
              text-center
              text-gray-500
              border
              border-gray-100
            "
          >
            {orderType ===
            "active"
              ? "No pending orders for tomorrow"
              : "No old orders found"}
          </div>
        ) : (
          filteredOrders.map(
            (order) => (
              <div
                key={
                  order.order_id
                }
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  shadow-sm
                  min-w-0
                "
              >
                {/* ORDER ID + STATUS */}

                <div
                  className="
                    flex
                    flex-wrap
                    justify-between
                    items-center
                    gap-3
                    mb-4
                    pb-3
                    border-b
                    border-gray-100
                  "
                >
                  <h3
                    className="
                      font-bold
                      text-gray-800
                      text-base
                    "
                  >
                    Order #
                    {
                      order.order_id
                    }
                  </h3>

                  <StatusBadge
                    status={
                      order.status
                    }
                  />
                </div>

                {/* DELIVERY DATE */}

                <div className="mb-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      mb-1
                    "
                  >
                    Delivery Date
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-600
                    "
                  >
                    {getOrderDate(
                      order
                    )
                      ? new Date(
                          getOrderDate(
                            order
                          )
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

                {/* CUSTOMER */}

                <div className="mb-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      mb-1
                    "
                  >
                    Customer
                  </p>

                  <p
                    className="
                      font-medium
                      text-gray-800
                      break-words
                    "
                  >
                    {order.customer_name ||
                      "Unknown"}
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >
                    {order.customer_phone ||
                      "No phone"}
                  </p>
                </div>

                {/* PRODUCTS */}

                <div className="mb-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      mb-2
                    "
                  >
                    Products
                  </p>

                  {order.products
                    ?.length > 0 ? (
                    <div className="space-y-2">
                      {order.products.map(
                        (
                          product,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="
                              flex
                              justify-between
                              items-start
                              gap-3
                              text-sm
                            "
                          >
                            <span
                              className="
                                text-gray-700
                                break-words
                                min-w-0
                              "
                            >
                              {
                                product.product_name
                              }
                            </span>

                            <span
                              className="
                                text-gray-500
                                whitespace-nowrap
                              "
                            >
                              ×{" "}
                              {
                                product.quantity
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p
                      className="
                        text-sm
                        text-gray-400
                      "
                    >
                      No products
                    </p>
                  )}
                </div>

                {/* PRICE */}

                <div className="mb-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      mb-1
                    "
                  >
                    Total Price
                  </p>

                  <p
                    className="
                      font-bold
                      text-gray-800
                      text-lg
                    "
                  >
                    ₹
                    {Number(
                      order.total_amount ||
                        0
                    ).toFixed(2)}
                  </p>
                </div>

                {/* ADDRESS */}

                <div className="mb-4">
                  <p
                    className="
                      text-xs
                      text-gray-500
                      mb-1
                    "
                  >
                    Address
                  </p>

                  {order.address ? (
                    <div
                      className="
                        flex
                        items-start
                        gap-2
                      "
                    >
                      <span>
                        📍
                      </span>

                      <span
                        className="
                          text-sm
                          text-gray-600
                          break-words
                          min-w-0
                        "
                      >
                        {
                          order.address
                        }
                      </span>
                    </div>
                  ) : (
                    <p
                      className="
                        text-sm
                        text-gray-400
                      "
                    >
                      No Address
                    </p>
                  )}
                </div>

                {/* RIDER */}

                {/* <div
                  className="
                    pt-4
                    border-t
                    border-gray-100
                  "
                >
                  <label
                    className="
                      block
                      text-xs
                      text-gray-500
                      mb-2
                    "
                  >
                    Assign Rider
                  </label>

                  <RiderSelect
                    order={order}
                  />
                </div> */}
                {/* RIDER */}

<div
  className="
    pt-4
    border-t
    border-gray-100
  "
>
  {String(order.status || "").toLowerCase() === "pending" ? (
    <>
      <label
        className="
          block
          text-xs
          text-gray-500
          mb-2
        "
      >
        Assign Rider
      </label>

      <RiderSelect
        order={order}
      />

      {/* ADMIN CANCEL */}

      <button
        onClick={() =>
          cancelOrder(order.order_id)
        }
        className="
          w-full
          mt-3
          px-4
          py-2.5
          rounded-lg
          bg-red-600
          text-white
          font-semibold
          text-sm
          hover:bg-red-700
          transition
        "
      >
        Cancel Order
      </button>
    </>
  ) : (
    <div className="text-sm text-gray-500">
      {String(order.status || "").toLowerCase() === "cancelled"
        ? "Order Cancelled"
        : "No actions available"}
    </div>
  )}
</div>
              </div>
            )
          )
        )}
      </div>

      {/* ================================================= */}
      {/* DESKTOP ORDERS TABLE */}
      {/* ================================================= */}

      <div
        className="
          hidden
          lg:block
          bg-white
          rounded-xl
          shadow-sm
          border
          border-gray-100
          overflow-hidden
        "
      >
        <div
          className="
            w-full
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[1000px]
            "
          >
            <thead
              className="
                bg-gray-50
                border-b
              "
            >
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>

                <th className="p-4 text-sm font-semibold text-gray-600">
                  Delivery Date
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

                <th className="p-4 text-sm font-semibold text-gray-600">
  Action
</th>

              </tr>
            </thead>

            <tbody>
              {filteredOrders.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="
                      text-center
                      py-12
                      text-gray-500
                    "
                  >
                    {orderType ===
                    "active"
                      ? "No pending orders for tomorrow"
                      : "No old orders found"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order) => (
                    <tr
                      key={
                        order.order_id
                      }
                      className="
                        border-b
                        hover:bg-gray-50
                        transition
                      "
                    >
                      {/* ORDER ID */}

                      <td className="p-4">
                        <span className="font-semibold text-gray-800">
                          #
                          {
                            order.order_id
                          }
                        </span>
                      </td>

                      {/* DELIVERY DATE */}

                      <td className="p-4">
                        <span
                          className="
                            text-sm
                            text-gray-600
                            whitespace-nowrap
                          "
                        >
                          {getOrderDate(
                            order
                          )
                            ? new Date(
                                getOrderDate(
                                  order
                                )
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>

                      {/* CUSTOMER */}

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

                      {/* PRODUCTS */}

                      <td className="p-4">
                        {order.products
                          ?.length >
                        0 ? (
                          <div className="space-y-1">
                            {order.products.map(
                              (
                                product,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  className="text-sm text-gray-700"
                                >
                                  <span className="font-medium">
                                    {
                                      product.product_name
                                    }
                                  </span>

                                  <span className="text-gray-500">
                                    {" × "}
                                    {
                                      product.quantity
                                    }
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No
                            products
                          </span>
                        )}
                      </td>

                      {/* PRICE */}

                      <td className="p-4">
                        <span
                          className="
                            font-semibold
                            text-gray-800
                            whitespace-nowrap
                          "
                        >
                          ₹
                          {Number(
                            order.total_amount ||
                              0
                          ).toFixed(
                            2
                          )}
                        </span>
                      </td>

                      {/* ADDRESS */}

                      <td className="p-4 max-w-xs">
                        {order.address ? (
                          <div className="flex items-start gap-2">
                            <span>
                              📍
                            </span>

                            <span className="text-sm text-gray-600 break-words">
                              {
                                order.address
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No
                            Address
                          </span>
                        )}
                      </td>

                      {/* RIDER */}

                      <td className="p-4">
                        <div className="min-w-[190px]">
                          <RiderSelect
                            order={
                              order
                            }
                          />
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="p-4">
  <StatusBadge
    status={order.status}
  />
</td>

<td className="p-4">
  {String(order.status || "").toLowerCase() === "pending" ? (
    <button
      onClick={() =>
        cancelOrder(order.order_id)
      }
      className="
        px-4
        py-2
        rounded-lg
        bg-red-600
        text-white
        text-sm
        font-semibold
        hover:bg-red-700
        transition
        whitespace-nowrap
      "
    >
      Cancel Order
    </button>
  ) : (
    <span className="text-sm text-gray-400">
      —
    </span>
  )}
</td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================= */}
      {/* INFORMATION */}
      {/* ================================================= */}

      <div
        className="
          mt-5
          bg-blue-50
          border
          border-blue-100
          rounded-xl
          p-4
        "
      >
        <p
          className="
            text-sm
            text-blue-700
          "
        >
          <span className="font-semibold">
            Note:
          </span>{" "}

          {orderType ===
          "active"
            ? "Active Orders shows only tomorrow's pending orders."
            : "Old Orders shows orders before tomorrow."}

          {" "}
          Order status is updated by
          the rider from the Rider App.
          Admin can only assign or
          change the rider.
        </p>
      </div>
    </div>
  );
}