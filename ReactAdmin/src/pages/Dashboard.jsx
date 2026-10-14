
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   FaUsers,
//   FaBoxOpen,
//   FaShoppingCart,
//   FaClipboardList,
//   FaBell,
//   FaExclamationTriangle,
//   FaTruck,
//   FaTimesCircle,
// } from "react-icons/fa";

// import { API_URL } from "../config/api";

// export default function Dashboard() {

//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   // Separate pending counts
//   const [pendingStats, setPendingStats] = useState({
//     instant_pending: 0,
//     subscription_pending: 0,
//   });

//   const [summary, setSummary] = useState({
//     totalOrders: 0,
//     pending: 0,
//     delivered: 0,
//     cancelled: 0,
//   });


//   // ==========================================
//   // FETCH DASHBOARD
//   // ==========================================

//   useEffect(() => {

//     fetchDashboard();

//     const interval = setInterval(() => {
//       fetchDashboard();
//     }, 30000);

//     return () => clearInterval(interval);

//   }, []);


//   const fetchDashboard = async () => {

//     try {

//       const [
//         usersRes,
//         productsRes,
//         ordersRes,
//         subscriptionsRes,
//         notificationsRes,
//         pendingRes,
//       ] = await Promise.all([

//         axios.get(`${API_URL}/api/users`),

//         axios.get(`${API_URL}/api/products`),

//         axios.get(`${API_URL}/api/orders`),

//         axios.get(`${API_URL}/api/subscriptions`),

//         axios.get(`${API_URL}/api/admin/notifications`),

//         // Separate pending counts
//         axios.get(`${API_URL}/api/orders/pending-stats`),

//       ]);


//       // ==========================================
//       // SET DATA
//       // ==========================================

//       setUsers(
//         usersRes.data.users || []
//       );

//       setProducts(
//         productsRes.data.products || []
//       );

//       setOrders(
//         ordersRes.data.orders || []
//       );

//       setSubscriptions(
//         subscriptionsRes.data.subscriptions || []
//       );

//       setNotifications(
//         notificationsRes.data.notifications || []
//       );


//       // ==========================================
//       // SET PENDING STATS
//       // ==========================================

//       setPendingStats({

//         instant_pending:
//           Number(pendingRes.data.instant_pending) || 0,

//         subscription_pending:
//           Number(pendingRes.data.subscription_pending) || 0,

//       });


//       // ==========================================
//       // SET ORDER SUMMARY
//       // ==========================================

//       setSummary({

//         totalOrders:
//           Number(ordersRes.data.summary?.total) || 0,

//         pending:
//           Number(ordersRes.data.summary?.pending) || 0,

//         delivered:
//           Number(ordersRes.data.summary?.delivered) || 0,

//         cancelled:
//           Number(ordersRes.data.summary?.cancelled) || 0,

//       });


//     } catch (err) {

//       console.log(
//         "DASHBOARD ERROR:",
//         err
//       );

//     }

//   };


//   // ==========================================
//   // LOW STOCK
//   // ==========================================

//   // const lowStock = products.filter(
//   //   (p) => p.stock < 20
//   // );

//   const lowStock = products.filter(
//   (p) => Number(p.available_stock) < 20
// );

//   return (

//     <div className="min-h-screen bg-gray-100 p-8">


//       {/* ==========================================
//           HEADER
//       ========================================== */}

//       <div className="flex justify-between items-center mb-8">

//         <div>

//           <h1 className="text-4xl font-bold text-green-700">
//             🌿 AnusFarm Admin Dashboard
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Welcome Back, Admin 👋
//           </p>

//         </div>


//         <div className="bg-white shadow rounded-xl px-5 py-3">

//           <p className="font-semibold">
//             {new Date().toLocaleDateString()}
//           </p>

//         </div>

//       </div>



//       {/* ==========================================
//           SUMMARY CARDS
//       ========================================== */}

//       <div className="grid grid-cols-4 gap-6">


//         {/* TOTAL USERS */}

//         <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Total Users
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {users.length}
//             </h2>

//           </div>

//           <FaUsers size={40} />

//         </div>



//         {/* PRODUCTS */}

//         <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Products
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {products.length}
//             </h2>

//           </div>

//           <FaBoxOpen size={40} />

//         </div>



//         {/* ORDERS */}

//         <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Orders
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {summary.totalOrders}
//             </h2>

//           </div>

//           <FaShoppingCart size={40} />

//         </div>



//         {/* SUBSCRIPTIONS */}

//         <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Subscriptions
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {subscriptions.length}
//             </h2>

//           </div>

//           <FaClipboardList size={40} />

//         </div>

//       </div>



//       {/* ==========================================
//           STATUS CARDS
//       ========================================== */}

//       <div className="grid grid-cols-4 gap-6 mt-6">


//         {/* ======================================
//             INSTANT ORDERS PENDING
//         ====================================== */}

//         <div className="bg-yellow-100 rounded-xl p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Instant Orders Pending
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {pendingStats.instant_pending}
//             </h2>

//           </div>

//           <FaBell
//             size={35}
//             className="text-yellow-600"
//           />

//         </div>



//         {/* ======================================
//             SUBSCRIPTION PENDING
//         ====================================== */}

//         <div className="bg-purple-100 rounded-xl p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Subscription Pending
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {pendingStats.subscription_pending}
//             </h2>

//           </div>

//           <FaClipboardList
//             size={35}
//             className="text-purple-600"
//           />

//         </div>



//         {/* ======================================
//             DELIVERED
//         ====================================== */}

//         <div className="bg-green-100 rounded-xl p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Delivered
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {summary.delivered}
//             </h2>

//           </div>

//           <FaTruck
//             size={35}
//             className="text-green-700"
//           />

//         </div>



//         {/* ======================================
//             CANCELLED
//         ====================================== */}

//         <div className="bg-red-100 rounded-xl p-6 flex justify-between items-center">

//           <div>

//             <p>
//               Cancelled
//             </p>

//             <h2 className="text-3xl font-bold mt-2">
//               {summary.cancelled}
//             </h2>

//           </div>

//           <FaTimesCircle
//             size={35}
//             className="text-red-700"
//           />

//         </div>

//       </div>



//       {/* ==========================================
//           RECENT ORDERS + LATEST USERS
//       ========================================== */}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


//         {/* ======================================
//             RECENT ORDERS
//         ====================================== */}

//         <div className="bg-white rounded-xl shadow-lg p-6">

//           <div className="flex justify-between items-center mb-5">

//             <h2 className="text-xl font-bold">
//               Recent Orders
//             </h2>

//             <span className="text-sm text-gray-500">
//               {orders.length} Orders
//             </span>

//           </div>


//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead>

//                 <tr className="bg-gray-100">

//                   <th className="text-left p-3">
//                     Customer
//                   </th>

//                   <th className="text-left p-3">
//                     Product
//                   </th>

//                   <th className="text-left p-3">
//                     Qty
//                   </th>

//                   <th className="text-left p-3">
//                     Status
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {orders.length > 0 ? (

//                   orders.slice(0, 5).map((order) => (

//                     <tr
//                       key={order.order_id}
//                       className="border-b hover:bg-gray-50"
//                     >

//                       <td className="p-3">
//                         {order.customer_name}
//                       </td>


//                       <td className="p-3">

//                         {order.products?.[0]?.product_name ||
//                           "N/A"}

//                       </td>


//                       <td className="p-3">

//                         {order.products?.[0]?.quantity ||
//                           0}

//                       </td>


//                       <td className="p-3">

//                         <span
//                           className={`px-3 py-1 rounded-full text-white text-sm ${
//                             order.status === "Delivered"
//                               ? "bg-green-500"
//                               : order.status === "Pending"
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                           }`}
//                         >

//                           {order.status}

//                         </span>

//                       </td>

//                     </tr>

//                   ))

//                 ) : (

//                   <tr>

//                     <td
//                       colSpan="4"
//                       className="text-center p-6"
//                     >
//                       No Orders Found
//                     </td>

//                   </tr>

//                 )}

//               </tbody>

//             </table>

//           </div>

//         </div>



//         {/* ======================================
//             LATEST USERS
//         ====================================== */}

//         <div className="bg-white rounded-xl shadow-lg p-6">


//           <div className="flex justify-between items-center mb-5">

//             <h2 className="text-xl font-bold">
//               Latest Users
//             </h2>

//             <span className="text-sm text-gray-500">
//               {users.length} Users
//             </span>

//           </div>


//           {users.length > 0 ? (

//             users.slice(0, 5).map((user) => (

//               <div
//                 key={user.id}
//                 className="flex justify-between items-center border-b py-4"
//               >

//                 <div>

//                   <h3 className="font-semibold">
//                     {user.name}
//                   </h3>

//                   <p className="text-gray-500 text-sm">
//                     {user.phone}
//                   </p>

//                 </div>


//                 <div>

//                   <span
//                     className={`px-3 py-1 rounded-full text-sm ${
//                       user.subscription === "Subscribed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >

//                     {user.subscription}

//                   </span>

//                 </div>

//               </div>

//             ))

//           ) : (

//             <div className="text-center py-10">
//               No Users Available
//             </div>

//           )}

//         </div>

//       </div>



//       {/* ==========================================
//           LOW STOCK PRODUCTS
//       ========================================== */}

//       <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

//         <div className="flex justify-between items-center mb-5">

//           <h2 className="text-xl font-bold">
//             Low Stock Products
//           </h2>

//           <span className="text-sm text-gray-500">
//             {lowStock.length} Products
//           </span>

//         </div>


//         <div className="overflow-x-auto">

//           <table className="w-full">

//             <thead>

//               <tr className="bg-gray-100">

//                 <th className="text-left p-3">
//                   Product
//                 </th>

//                 <th className="text-left p-3">
//                   Category
//                 </th>

//                 <th className="text-left p-3">
//                   Price
//                 </th>

//                 <th className="text-left p-3">
//                   Stock
//                 </th>

//               </tr>

//             </thead>


//             <tbody>

//               {lowStock.length > 0 ? (

//                 lowStock.map((product) => (

//                   <tr
//                     key={product.id}
//                     className="border-b hover:bg-gray-50"
//                   >

//                     <td className="p-3 font-medium">
//                       {product.name}
//                     </td>

//                     <td className="p-3">
//                       {product.category}
//                     </td>

//                     <td className="p-3">
//                       ₹ {product.price}
//                     </td>

//                     {/* <td className="p-3">
//                       <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
//                         {product.stock}
//                       </span>
//                     </td> */}

//             <td className="p-3">
//   <div className="space-y-1">

//     <p className="text-sm text-gray-600">
//       Total: {product.stock}
//     </p>

//     <p className="text-sm text-purple-600">
//       Subscription: {product.subscription_stock || 0}
//     </p>

//     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block font-semibold">
//       Available: {product.available_stock || 0}
//     </span>

//   </div>
// </td>
       
//                   </tr>

//                 ))

//               ) : (

//                 <tr>

//                   <td
//                     colSpan="4"
//                     className="text-center p-6"
//                   >
//                     No Low Stock Products
//                   </td>

//                 </tr>

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>



//       {/* ==========================================
//           NOTIFICATIONS
//       ========================================== */}

//       <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

//         <div className="flex justify-between items-center mb-5">

//           <h2 className="text-xl font-bold">
//             Recent Notifications
//           </h2>

//           <span className="text-sm text-gray-500">
//             {notifications.length} Notifications
//           </span>

//         </div>


//         {notifications.length > 0 ? (

//           notifications.slice(0, 5).map((item) => (

//             <div
//               key={item.id}
//               className="border-b py-4 flex items-start gap-4"
//             >

//               <div className="bg-green-100 p-3 rounded-full">

//                 <FaBell className="text-green-700" />

//               </div>


//               <div>

//                 <p className="font-medium">
//                   {item.message}
//                 </p>

//                 <p className="text-sm text-gray-500 mt-1">

//                   {new Date(
//                     item.created_at
//                   ).toLocaleString()}

//                 </p>

//               </div>

//             </div>

//           ))

//         ) : (

//           <div className="text-center py-10 text-gray-500">
//             No Notifications
//           </div>

//         )}

//       </div>



//       {/* ==========================================
//           FOOTER
//       ========================================== */}

//       <div className="text-center text-gray-500 mt-10">

//         © 2026 AnusFarm Admin Dashboard

//       </div>


//     </div>

//   );

// }

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaClipboardList,
  FaBell,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

import { API_URL } from "../config/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [pendingStats, setPendingStats] = useState({
    instant_pending: 0,
    subscription_pending: 0,
  });

  const [summary, setSummary] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });

  // FETCH DASHBOARD
  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        usersRes,
        productsRes,
        ordersRes,
        subscriptionsRes,
        notificationsRes,
        pendingRes,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/users`),
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/orders`),
        axios.get(`${API_URL}/api/subscriptions`),
        axios.get(`${API_URL}/api/admin/notifications`),
        axios.get(`${API_URL}/api/orders/pending-stats`),
      ]);

      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setSubscriptions(subscriptionsRes.data.subscriptions || []);
      setNotifications(notificationsRes.data.notifications || []);

      setPendingStats({
        instant_pending:
          Number(pendingRes.data.instant_pending) || 0,
        subscription_pending:
          Number(pendingRes.data.subscription_pending) || 0,
      });

      setSummary({
        totalOrders: Number(ordersRes.data.summary?.total) || 0,
        pending: Number(ordersRes.data.summary?.pending) || 0,
        delivered: Number(ordersRes.data.summary?.delivered) || 0,
        cancelled: Number(ordersRes.data.summary?.cancelled) || 0,
      });
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
    }
  };

  // LOW STOCK
  const lowStock = products.filter(
    (p) => Number(p.available_stock) < 20
  );

  return (
    <div className="w-full min-w-0 min-h-screen bg-gray-100 p-3 sm:p-5 md:p-6 lg:p-8 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 break-words">
            🌿 AnusFarm Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Welcome Back, Admin 👋
          </p>
        </div>

        <div className="bg-white shadow rounded-xl px-4 sm:px-5 py-3 w-fit">
          <p className="font-semibold text-sm sm:text-base">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">

        {/* TOTAL USERS */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Total Users
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {users.length}
            </h2>
          </div>
          <FaUsers className="text-2xl sm:text-3xl lg:text-4xl shrink-0" />
        </div>

        {/* PRODUCTS */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Products
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {products.length}
            </h2>
          </div>
          <FaBoxOpen className="text-2xl sm:text-3xl lg:text-4xl shrink-0" />
        </div>

        {/* ORDERS */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Orders
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {summary.totalOrders}
            </h2>
          </div>
          <FaShoppingCart className="text-2xl sm:text-3xl lg:text-4xl shrink-0" />
        </div>

        {/* SUBSCRIPTIONS */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Subscriptions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {subscriptions.length}
            </h2>
          </div>
          <FaClipboardList className="text-2xl sm:text-3xl lg:text-4xl shrink-0" />
        </div>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mt-6">

        {/* INSTANT ORDERS PENDING */}
        <div className="bg-yellow-100 rounded-xl p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Instant Orders Pending
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {pendingStats.instant_pending}
            </h2>
          </div>
          <FaBell size={26} className="text-yellow-600 shrink-0" />
        </div>

        {/* SUBSCRIPTION PENDING */}
        <div className="bg-purple-100 rounded-xl p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Subscription Pending
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {pendingStats.subscription_pending}
            </h2>
          </div>
          <FaClipboardList size={26} className="text-purple-600 shrink-0" />
        </div>

        {/* DELIVERED */}
        <div className="bg-green-100 rounded-xl p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Delivered
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {summary.delivered}
            </h2>
          </div>
          <FaTruck size={26} className="text-green-700 shrink-0" />
        </div>

        {/* CANCELLED */}
        <div className="bg-red-100 rounded-xl p-4 sm:p-5 lg:p-6 flex justify-between items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm lg:text-base">
              Cancelled
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {summary.cancelled}
            </h2>
          </div>
          <FaTimesCircle size={26} className="text-red-700 shrink-0" />
        </div>
      </div>

      {/* RECENT ORDERS + LATEST USERS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-0">
          <div className="flex justify-between items-center gap-3 mb-5">
            <h2 className="text-lg sm:text-xl font-bold">
              Recent Orders
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {orders.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Qty</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 break-words">
                        {order.customer_name}
                      </td>

                      <td className="p-3 break-words">
                        {order.products?.[0]?.product_name || "N/A"}
                      </td>

                      <td className="p-3">
                        {order.products?.[0]?.quantity || 0}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs sm:text-sm whitespace-nowrap ${
                            order.status?.toLowerCase() === "delivered"
                              ? "bg-green-500"
                              : order.status?.toLowerCase() === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6">
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LATEST USERS */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-0">
          <div className="flex justify-between items-center gap-3 mb-5">
            <h2 className="text-lg sm:text-xl font-bold">
              Latest Users
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {users.length} Users
            </span>
          </div>

          {users.length > 0 ? (
            users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b py-4"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold break-words">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 text-sm break-words">
                    {user.phone}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm inline-block ${
                      user.subscription === "Subscribed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.subscription || "Not Subscribed"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              No Users Available
            </div>
          )}
        </div>
      </div>

      {/* LOW STOCK PRODUCTS */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          <h2 className="text-lg sm:text-xl font-bold">
            Low Stock Products
          </h2>

          <span className="text-sm text-gray-500">
            {lowStock.length} Products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStock.length > 0 ? (
                lowStock.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium break-words">
                      {product.name}
                    </td>

                    <td className="p-3 break-words">
                      {product.category}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      ₹ {product.price}
                    </td>

                    <td className="p-3">
                      <div className="space-y-1 min-w-[130px]">
                        <p className="text-sm text-gray-600">
                          Total: {product.stock}
                        </p>

                        <p className="text-sm text-purple-600">
                          Subscription: {product.subscription_stock || 0}
                        </p>

                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full inline-block font-semibold whitespace-nowrap">
                          Available: {product.available_stock || 0}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    No Low Stock Products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          <h2 className="text-lg sm:text-xl font-bold">
            Recent Notifications
          </h2>

          <span className="text-sm text-gray-500">
            {notifications.length} Notifications
          </span>
        </div>

        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="border-b py-4 flex items-start gap-3 sm:gap-4"
            >
              <div className="bg-green-100 p-3 rounded-full shrink-0">
                <FaBell className="text-green-700" />
              </div>

              <div className="min-w-0">
                <p className="font-medium break-words">
                  {item.message}
                </p>

                <p className="text-sm text-gray-500 mt-1 break-words">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No Notifications
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 mt-8 sm:mt-10 text-sm">
        © 2026 AnusFarm Admin Dashboard
      </div>
    </div>
  );
}

