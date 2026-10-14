// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Subscription() {

//   const [subscriptions, setSubscriptions] = useState([]);
//   const [deliveries, setDeliveries] = useState([]);
//   const [riders, setRiders] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");

//   // Selected subscriber
//   const [selectedSubscriber, setSelectedSubscriber] =
//     useState(null);

//   // Rider modal
//   const [showRiderModal, setShowRiderModal] =
//     useState(false);

//   const [assignRiderId, setAssignRiderId] =
//     useState("");

//   const [assigning, setAssigning] =
//     useState(false);

//   // Pause modal
//   const [showPauseModal, setShowPauseModal] =
//     useState(false);

//   const [pauseFrom, setPauseFrom] =
//     useState("");

//   const [pauseTo, setPauseTo] =
//     useState("");

//   const [pausing, setPausing] =
//     useState(false);


//   // ============================================================
//   // LOAD
//   // ============================================================

//   useEffect(() => {
//     loadData();
//   }, []);


//   const loadData = async () => {

//     await Promise.all([
//       loadSubscriptions(),
//       loadDeliveries(),
//       loadRiders()
//     ]);

//   };


//   // ============================================================
//   // SUBSCRIPTIONS
//   // ============================================================

//   const loadSubscriptions = async () => {

//     try {

//       const res = await axios.get(
//         `${API_URL}/api/subscriptions`
//       );

//       console.log(
//         "SUBSCRIPTIONS:",
//         res.data
//       );

//       setSubscriptions(
//         res.data.subscriptions || []
//       );

//     } catch (error) {

//       console.log(
//         "SUBSCRIPTIONS ERROR:",
//         error.response?.data ||
//         error.message
//       );

//     }

//   };


//   // ============================================================
//   // DELIVERIES
//   // ============================================================

//   const loadDeliveries = async () => {

//     try {

//       setLoading(true);

//       const res = await axios.get(
//         `${API_URL}/api/admin/deliveries/subscription-deliveries`
//       );

//       console.log(
//         "SUBSCRIPTION DELIVERIES:",
//         res.data
//       );

//       setDeliveries(
//         res.data.deliveries || []
//       );

//     } catch (error) {

//       console.log(
//         "DELIVERIES ERROR:",
//         error.response?.data ||
//         error.message
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   // ============================================================
//   // RIDERS
//   // ============================================================

//   const loadRiders = async () => {

//     try {

//       const res = await axios.get(
//         `${API_URL}/api/admin/deliveries/riders`
//       );

//       setRiders(
//         res.data.riders || []
//       );

//     } catch (error) {

//       console.log(
//         "RIDERS ERROR:",
//         error.response?.data ||
//         error.message
//       );

//     }

//   };


//   // ============================================================
//   // GET LOCAL DATE AS YYYY-MM-DD
//   // ============================================================

//   const getLocalDateString = (date) => {

//     const year =
//       date.getFullYear();

//     const month =
//       String(
//         date.getMonth() + 1
//       ).padStart(2, "0");

//     const day =
//       String(
//         date.getDate()
//       ).padStart(2, "0");

//     return `${year}-${month}-${day}`;

//   };


//   // ============================================================
//   // GET TOMORROW DATE
//   // ============================================================

//   const getTomorrowDate = () => {

//     const tomorrow =
//       new Date();

//     tomorrow.setDate(
//       tomorrow.getDate() + 1
//     );

//     return getLocalDateString(
//       tomorrow
//     );

//   };


//   // ============================================================
//   // FORMAT POSTGRESQL DATE
//   // IMPORTANT:
//   // delivery_date is DATE -> YYYY-MM-DD
//   // Do NOT use new Date(date).toISOString()
//   // ============================================================

//   const formatDate = (date) => {

//     if (!date) return "-";

//     const dateString =
//       String(date).slice(0, 10);

//     const parts =
//       dateString.split("-");

//     if (parts.length !== 3) {
//       return dateString;
//     }

//     const [
//       year,
//       month,
//       day
//     ] = parts;

//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec"
//     ];

//     const monthIndex =
//       Number(month) - 1;

//     return `${day} ${monthNames[monthIndex]} ${year}`;

//   };


//   // ============================================================
//   // CREATE SUBSCRIBER LIST
//   // ============================================================

//   const subscribers = [];


//   // ============================================================
//   // GET TOMORROW'S PENDING DELIVERIES
//   //
//   // Example:
//   // Today      = 2026-10-08
//   // Tomorrow   = 2026-10-09
//   //
//   // Only 2026-10-09 Pending deliveries are shown.
//   // ============================================================

//   const tomorrowDate =
//     getTomorrowDate();

//   console.log(
//     "TODAY DATE =",
//     getLocalDateString(new Date())
//   );

//   console.log(
//     "TOMORROW DATE =",
//     tomorrowDate
//   );


//   const tomorrowDeliveries =
//     deliveries.filter((delivery) => {

//       // PostgreSQL DATE already comes as:
//       // YYYY-MM-DD
//       //
//       // So keep it as a string.
//       const deliveryDate =
//         String(
//           delivery.delivery_date
//         ).slice(0, 10);

//       return (
//         deliveryDate === tomorrowDate &&
//         String(
//           delivery.delivery_status
//         ).toLowerCase() ===
//           "pending"
//       );

//     });


//   console.log(
//     "TOMORROW PENDING DELIVERIES =",
//     tomorrowDeliveries
//   );


//   // ============================================================
//   // CREATE SUBSCRIBERS
//   // ============================================================

//   tomorrowDeliveries.forEach(
//     (delivery) => {

//       const userId =
//         delivery.user_id;

//       if (!userId) return;


//       let subscriber =
//         subscribers.find(
//           (item) =>
//             Number(item.user_id) ===
//             Number(userId)
//         );


//       if (!subscriber) {

//         const subscription =
//           subscriptions.find(
//             (sub) =>
//               Number(sub.id) ===
//               Number(
//                 delivery.subscription_id
//               )
//           );


//         subscriber = {

//           user_id: userId,

//           subscription_id:
//             delivery.subscription_id,
//             status:
//   subscription?.status ||
//   "Active",

//           customer_name:
//             delivery.customer_name ||
//             subscription?.name ||
//             "-",

//           customer_phone:
//             delivery.customer_phone ||
//             subscription?.phone ||
//             "-",

//           plan:
//             delivery.plan ||
//             subscription?.plan ||
//             "-",

//           frequency:
//             subscription?.frequency ||
//             delivery.frequency ||
//             "-",

//           delivery_time:
//             subscription?.delivery_time ||
//             delivery.delivery_time ||
//             "-",

//           address:
//             delivery.customer_address ||
//             "-",

//           deliveries: []

//         };


//         subscribers.push(
//           subscriber
//         );

//       }


//       subscriber.deliveries.push(
//         delivery
//       );

//     }
//   );


//   // ============================================================
//   // COUNTS
//   // ============================================================

//   subscribers.forEach(
//     (subscriber) => {

//       subscriber.total =
//         subscriber.deliveries.length;


//       subscriber.pending =
//         subscriber.deliveries.filter(
//           (d) =>
//             String(
//               d.delivery_status
//             ).toLowerCase() ===
//             "pending"
//         ).length;


//       subscriber.delivered =
//         subscriber.deliveries.filter(
//           (d) =>
//             String(
//               d.delivery_status
//             ).toLowerCase() ===
//             "delivered"
//         ).length;


//       subscriber.skipped =
//         subscriber.deliveries.filter(
//           (d) =>
//             String(
//               d.delivery_status
//             ).toLowerCase() ===
//             "skipped"
//         ).length;


//       subscriber.cancelled =
//         subscriber.deliveries.filter(
//           (d) =>
//             String(
//               d.delivery_status
//             ).toLowerCase() ===
//             "cancelled"
//         ).length;


//       subscriber.paused =
//         subscriber.deliveries.filter(
//           (d) =>
//             String(
//               d.delivery_status
//             ).toLowerCase() ===
//             "paused"
//         ).length;


//       const rider =
//         subscriber.deliveries.find(
//           (d) => d.rider_id
//         );


//       subscriber.rider_id =
//         rider?.rider_id || null;


//       subscriber.rider_name =
//         rider?.rider_name || null;


//       subscriber.rider_phone =
//         rider?.rider_phone || null;

//     }
//   );


//   // ============================================================
//   // SEARCH
//   // ============================================================

//   const filteredSubscribers =
//     subscribers.filter(
//       (subscriber) => {

//         const value =
//           search
//             .trim()
//             .toLowerCase();


//         if (!value) return true;


//         return (

//           subscriber.customer_name
//             ?.toLowerCase()
//             .includes(value) ||

//           subscriber.customer_phone
//             ?.toLowerCase()
//             .includes(value) ||

//           subscriber.plan
//             ?.toLowerCase()
//             .includes(value)

//         );

//       }
//     );


//   // ============================================================
//   // OPEN SUBSCRIBER
//   // ============================================================

//   const openSubscriber = (
//     subscriber
//   ) => {

//     setSelectedSubscriber(
//       subscriber
//     );

//   };


//   // ============================================================
//   // CLOSE SUBSCRIBER
//   // ============================================================

//   const closeSubscriber = () => {

//     setSelectedSubscriber(
//       null
//     );

//   };


//   // ============================================================
//   // OPEN RIDER MODAL
//   // ============================================================

//   const openRiderModal = () => {

//     if (!selectedSubscriber)
//       return;


//     setAssignRiderId(
//       selectedSubscriber.rider_id
//         ? String(
//             selectedSubscriber.rider_id
//           )
//         : ""
//     );


//     setShowRiderModal(
//       true
//     );

//   };


//   // ============================================================
//   // ASSIGN RIDER
//   // ============================================================

//   const handleAssignRider =
//     async () => {

//       if (
//         !selectedSubscriber
//       )
//         return;


//       if (!assignRiderId) {

//         alert(
//           "Please select a rider"
//         );

//         return;

//       }


//       try {

//         setAssigning(true);


//         /*
//          * Assign selected rider
//          * to all pending deliveries
//          * of this subscriber.
//          */

//         const pendingDeliveries =
//           selectedSubscriber
//             .deliveries
//             .filter(
//               (delivery) =>
//                 String(
//                   delivery.delivery_status
//                 ).toLowerCase() ===
//                 "pending"
//             );


//         for (
//           const delivery
//           of pendingDeliveries
//         ) {

//           await axios.put(
//             `${API_URL}/api/admin/deliveries/assign-rider`,
//             {
//               deliveryId:
//                 delivery.delivery_id,

//               riderId:
//                 Number(
//                   assignRiderId
//                 )
//             }
//           );

//         }


//         alert(
//           selectedSubscriber.rider_id
//             ? "Rider changed successfully"
//             : "Rider assigned successfully"
//         );


//         setShowRiderModal(
//           false
//         );


//         await loadData();

//       } catch (error) {

//         console.log(
//           "ASSIGN RIDER ERROR:",
//           error.response?.data ||
//           error.message
//         );


//         alert(
//           error.response?.data?.message ||
//           "Failed to assign rider"
//         );

//       } finally {

//         setAssigning(false);

//       }

//     };


//   // ============================================================
//   // OPEN PAUSE MODAL
//   // ============================================================

//   const openPauseModal = () => {

//     if (!selectedSubscriber)
//       return;


//     const today =
//       getLocalDateString(
//         new Date()
//       );


//     setPauseFrom(today);

//     setPauseTo("");

//     setShowPauseModal(
//       true
//     );

//   };


//   // ============================================================
//   // PAUSE SUBSCRIPTION
//   // ============================================================

//   const pauseSubscription =
//     async () => {

//       if (!selectedSubscriber)
//         return;


//       const subscriptionId =
//         selectedSubscriber
//           .subscription_id;


//       if (!subscriptionId) {

//         alert(
//           "Subscription ID not found"
//         );

//         return;

//       }


//       if (!pauseFrom) {

//         alert(
//           "Please select From date"
//         );

//         return;

//       }


//       if (!pauseTo) {

//         alert(
//           "Please select To date"
//         );

//         return;

//       }


//       if (
//         pauseTo < pauseFrom
//       ) {

//         alert(
//           "To date cannot be before From date"
//         );

//         return;

//       }


//       try {

//         setPausing(true);


//         await axios.put(
//           `${API_URL}/api/subscriptions/${subscriptionId}/pause`,
//           {
//             pause_from:
//               pauseFrom,

//             pause_to:
//               pauseTo
//           }
//         );


//         alert(
//           "Subscription paused successfully"
//         );


//         setShowPauseModal(
//           false
//         );


//         await loadData();

//         closeSubscriber();

//       } catch (error) {

//         console.log(
//           "PAUSE ERROR:",
//           error.response?.data ||
//           error.message
//         );


//         alert(
//           error.response?.data?.message ||
//           "Unable to pause subscription"
//         );

//       } finally {

//         setPausing(false);

//       }

//     };


//   // ============================================================
//   // RESUME
//   // ============================================================

//   const resumeSubscription =
//     async () => {

//       if (
//         !selectedSubscriber
//       )
//         return;


//       const subscriptionId =
//         selectedSubscriber
//           .subscription_id;


//       try {

//         await axios.put(
//           `${API_URL}/api/subscriptions/${subscriptionId}/resume`
//         );


//         alert(
//           "Subscription resumed"
//         );


//         await loadData();

//         closeSubscriber();

//       } catch (error) {

//         console.log(
//           "RESUME ERROR:",
//           error.response?.data ||
//           error.message
//         );


//         alert(
//           error.response?.data?.message ||
//           "Unable to resume subscription"
//         );

//       }

//     };

// // ============================================================
// // CANCEL SUBSCRIPTION
// // ============================================================

// const cancelSubscription = async () => {

//   if (!selectedSubscriber)
//     return;

//   const subscriptionId =
//     selectedSubscriber.subscription_id;

//   if (!subscriptionId) {

//     alert("Subscription ID not found");

//     return;

//   }

//   const confirmed = window.confirm(
//     "Are you sure you want to cancel this subscription?"
//   );

//   if (!confirmed)
//     return;

//   try {

//     await axios.put(
//       `${API_URL}/api/subscriptions/${subscriptionId}/admin-cancel`
//     );

//     alert(
//       "Subscription cancelled successfully"
//     );

//     await loadData();

//     closeSubscriber();

//   } catch (error) {

//     console.log(
//       "ADMIN CANCEL ERROR:",
//       error.response?.data ||
//       error.message
//     );

//     alert(
//       error.response?.data?.message ||
//       "Unable to cancel subscription"
//     );

//   }

// };
//   // ============================================================
//   // PAGE
//   // ============================================================

//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">


//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-6">

//         <div>

//           <h1 className="text-3xl font-bold text-gray-800">
//             Subscribers
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage subscriptions and delivery history
//           </p>

//         </div>


//         <button
//           onClick={loadData}
//           className="bg-gray-800 text-white px-5 py-2.5 rounded-lg"
//         >
//           ↻ Refresh
//         </button>

//       </div>


//       {/* SEARCH */}

//       <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">

//         <input
//           value={search}
//           onChange={(e) =>
//             setSearch(
//               e.target.value
//             )
//           }
//           placeholder="Search subscriber..."
//           className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
//         />

//       </div>


//       {/* CARDS */}

//       {loading ? (

//         <div className="bg-white rounded-xl p-10 text-center">
//           Loading subscribers...
//         </div>

//       ) : filteredSubscribers.length === 0 ? (

//         <div className="bg-white rounded-xl p-10 text-center">

//           <div className="text-5xl mb-3">
//             📦
//           </div>

//           <p className="text-gray-500">
//             No subscribers found
//           </p>

//         </div>

//       ) : (

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

//           {filteredSubscribers.map(
//             (subscriber) => (

//               <div
//                 key={
//                   subscriber.user_id
//                 }
//                 onClick={() =>
//                   openSubscriber(
//                     subscriber
//                   )
//                 }
//                 className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer transition overflow-hidden"
//               >

//                 {/* CUSTOMER */}

//                 <div className="p-5">

//                   <div className="flex justify-between items-start">

//                     <div className="flex gap-3 items-center">

//                       <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
//                         👤
//                       </div>

//                       <div>

//                         <h2 className="font-bold text-lg text-gray-800">
//                           {
//                             subscriber.customer_name
//                           }
//                         </h2>

//                         <p className="text-sm text-gray-500">
//                           {
//                             subscriber.customer_phone
//                           }
//                         </p>

//                       </div>

//                     </div>


//                     <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
//                       Subscriber
//                     </span>

//                   </div>


//                   {/* PLAN */}

//                   <div className="mt-5">

//                     <p className="text-xs text-gray-500">
//                       Subscription
//                     </p>

//                     <p className="font-semibold text-gray-800 mt-1">
//                       🥛{" "}
//                       {
//                         subscriber.plan
//                       }
//                     </p>

//                   </div>


//                   {/* COUNTS */}

//                   <div className="grid grid-cols-4 gap-2 mt-5">

//                     <div className="bg-gray-50 rounded-lg p-3 text-center">

//                       <p className="text-xs text-gray-500">
//                         Total
//                       </p>

//                       <p className="font-bold text-lg">
//                         {
//                           subscriber.total
//                         }
//                       </p>

//                     </div>


//                     <div className="bg-yellow-50 rounded-lg p-3 text-center">

//                       <p className="text-xs text-yellow-600">
//                         Pending
//                       </p>

//                       <p className="font-bold text-lg text-yellow-600">
//                         {
//                           subscriber.pending
//                         }
//                       </p>

//                     </div>


//                     <div className="bg-green-50 rounded-lg p-3 text-center">

//                       <p className="text-xs text-green-600">
//                         Delivered
//                       </p>

//                       <p className="font-bold text-lg text-green-600">
//                         {
//                           subscriber.delivered
//                         }
//                       </p>

//                     </div>


//                     <div className="bg-gray-100 rounded-lg p-3 text-center">

//                       <p className="text-xs text-gray-500">
//                         Skipped
//                       </p>

//                       <p className="font-bold text-lg">
//                         {
//                           subscriber.skipped
//                         }
//                       </p>

//                     </div>

//                   </div>


//                   {/* RIDER */}

//                   <div className="mt-5 pt-4 border-t">

//                     <p className="text-xs text-gray-500">
//                       Rider
//                     </p>

//                     <p className="font-semibold mt-1">

//                       {subscriber.rider_name
//                         ? `🚴 ${subscriber.rider_name}`
//                         : "⚠ Not Assigned"}

//                     </p>

//                   </div>

//                 </div>


//                 {/* FOOTER */}

//                 <div className="bg-gray-50 border-t px-5 py-3 flex justify-between">

//                   <span className="text-sm text-gray-500">
//                     View subscription
//                   </span>

//                   <span className="text-green-600 font-semibold">
//                     View →
//                   </span>

//                 </div>

//               </div>

//             )
//           )}

//         </div>

//       )}


//       {/* ======================================================
//           SUBSCRIBER DETAILS
//       ====================================================== */}

//       {selectedSubscriber && (

//         <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">

//           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">


//             {/* HEADER */}

//             <div className="p-6 border-b flex justify-between">

//               <div>

//                 <h2 className="text-2xl font-bold">
//                   {
//                     selectedSubscriber.customer_name
//                   }
//                 </h2>

//                 <p className="text-gray-500">
//                   {
//                     selectedSubscriber.customer_phone
//                   }
//                 </p>

//               </div>


//               <button
//                 onClick={
//                   closeSubscriber
//                 }
//                 className="text-3xl text-gray-400"
//               >
//                 ×
//               </button>

//             </div>


//             <div className="p-6">


//               {/* SUBSCRIPTION */}

//               <div className="bg-green-50 rounded-xl p-5 mb-5">

//                 <h3 className="font-bold mb-4">
//                   Subscription
//                 </h3>


//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//                   <div>

//                     <p className="text-xs text-gray-500">
//                       Plan
//                     </p>

//                     <p className="font-semibold">
//                       {
//                         selectedSubscriber.plan
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p className="text-xs text-gray-500">
//                       Frequency
//                     </p>

//                     <p className="font-semibold">
//                       {
//                         selectedSubscriber.frequency
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p className="text-xs text-gray-500">
//                       Delivery Time
//                     </p>

//                     <p className="font-semibold">
//                       {
//                         selectedSubscriber.delivery_time
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p className="text-xs text-gray-500">
//                       Subscription ID
//                     </p>

//                     <p className="font-semibold">
//                       #
//                       {
//                         selectedSubscriber.subscription_id
//                       }
//                     </p>

//                   </div>

//                 </div>

//               </div>


//               {/* SUMMARY */}

//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">

//                 <div className="bg-gray-50 rounded-xl p-4 text-center">

//                   <p className="text-xs text-gray-500">
//                     Total
//                   </p>

//                   <p className="text-2xl font-bold">
//                     {
//                       selectedSubscriber.total
//                     }
//                   </p>

//                 </div>


//                 <div className="bg-yellow-50 rounded-xl p-4 text-center">

//                   <p className="text-xs text-yellow-600">
//                     Pending
//                   </p>

//                   <p className="text-2xl font-bold text-yellow-600">
//                     {
//                       selectedSubscriber.pending
//                     }
//                   </p>

//                 </div>


//                 <div className="bg-green-50 rounded-xl p-4 text-center">

//                   <p className="text-xs text-green-600">
//                     Delivered
//                   </p>

//                   <p className="text-2xl font-bold text-green-600">
//                     {
//                       selectedSubscriber.delivered
//                     }
//                   </p>

//                 </div>


//                 <div className="bg-gray-100 rounded-xl p-4 text-center">

//                   <p className="text-xs text-gray-500">
//                     Skipped
//                   </p>

//                   <p className="text-2xl font-bold">
//                     {
//                       selectedSubscriber.skipped
//                     }
//                   </p>

//                 </div>


//                 <div className="bg-red-50 rounded-xl p-4 text-center">

//                   <p className="text-xs text-red-500">
//                     Cancelled
//                   </p>

//                   <p className="text-2xl font-bold text-red-500">
//                     {
//                       selectedSubscriber.cancelled
//                     }
//                   </p>

//                 </div>

//               </div>


//               {/* ADDRESS */}

//               <div className="border rounded-xl p-5 mb-6">

//                 <h3 className="font-bold mb-2">
//                   Delivery Address
//                 </h3>

//                 <p className="text-gray-600">
//                   📍{" "}
//                   {
//                     selectedSubscriber.address
//                   }
//                 </p>

//               </div>


//               {/* RIDER */}

//               <div className="border rounded-xl p-5 mb-6">

//                 <div className="flex justify-between items-center">

//                   <div>

//                     <h3 className="font-bold">
//                       Assigned Rider
//                     </h3>

//                     {selectedSubscriber.rider_name ? (

//                       <p className="text-green-600 mt-1 font-semibold">
//                         🚴{" "}
//                         {
//                           selectedSubscriber.rider_name
//                         }
//                         {" - "}
//                         {
//                           selectedSubscriber.rider_phone
//                         }
//                       </p>

//                     ) : (

//                       <p className="text-orange-500 mt-1">
//                         ⚠ Rider not assigned
//                       </p>

//                     )}

//                   </div>


//                   <button
//                     onClick={
//                       openRiderModal
//                     }
//                     className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold"
//                   >
//                     {
//                       selectedSubscriber.rider_id
//                         ? "Change Rider"
//                         : "Assign Rider"
//                     }
//                   </button>

//                 </div>

//               </div>


//               {/* DELIVERY HISTORY */}

//               <div>

//                 <h3 className="font-bold text-lg mb-3">
//                   Delivery History
//                 </h3>


//                 <div className="border rounded-xl overflow-hidden">

//                   {selectedSubscriber
//                     .deliveries
//                     .slice()
//                     .sort(
//                       (a, b) =>
//                         String(
//                           b.delivery_date
//                         ).localeCompare(
//                           String(
//                             a.delivery_date
//                           )
//                         )
//                     )
//                     .map(
//                       (delivery) => (

//                         <div
//                           key={
//                             delivery.delivery_id
//                           }
//                           className="flex items-center justify-between p-4 border-b last:border-b-0"
//                         >

//                           <div>

//                             <p className="font-semibold">
//                               {formatDate(
//                                 delivery.delivery_date
//                               )}
//                             </p>

//                             <p className="text-xs text-gray-500">
//                               Delivery #
//                               {
//                                 delivery.delivery_id
//                               }
//                             </p>

//                           </div>


//                           <div className="flex items-center gap-4">

//                             {delivery.rider_name && (

//                               <span className="text-xs text-gray-500">
//                                 🚴{" "}
//                                 {
//                                   delivery.rider_name
//                                 }
//                               </span>

//                             )}


//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-semibold
//                               ${
//                                 delivery.delivery_status ===
//                                 "Delivered"
//                                   ? "bg-green-100 text-green-700"
//                                   : delivery.delivery_status ===
//                                     "Pending"
//                                     ? "bg-yellow-100 text-yellow-700"
//                                     : delivery.delivery_status ===
//                                       "Skipped"
//                                       ? "bg-gray-100 text-gray-600"
//                                       : delivery.delivery_status ===
//                                         "Paused"
//                                         ? "bg-orange-100 text-orange-700"
//                                         : "bg-red-100 text-red-600"
//                               }`}
//                             >

//                               {
//                                 delivery.delivery_status
//                               }

//                             </span>

//                           </div>

//                         </div>

//                       )
//                     )}

//                 </div>

//               </div>


//               {/* ACTIONS */}

              

//    {/* ACTIONS */}

// <div className="border-t mt-6 pt-5 flex gap-3">

//   {selectedSubscriber.status?.toLowerCase() !== "cancelled" && (
//     <button
//       onClick={
//         selectedSubscriber.paused
//           ? resumeSubscription
//           : openPauseModal
//       }
//       className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold"
//     >
//       {selectedSubscriber.paused
//         ? "Resume Subscription"
//         : "Pause Subscription"}
//     </button>
//   )}

//   {selectedSubscriber.status?.toLowerCase() !== "cancelled" && (
//     <button
//       onClick={cancelSubscription}
//       className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
//     >
//       Cancel Subscription
//     </button>
//   )}

//   <button
//     onClick={closeSubscriber}
//     className="flex-1 border py-3 rounded-xl font-semibold"
//   >
//     Close
//   </button>

// </div>
//             </div>

//           </div>

//         </div>

//       )}


//       {/* ======================================================
//           PAUSE SUBSCRIPTION MODAL
//       ====================================================== */}

//       {showPauseModal && (

//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

//             <div className="p-5 border-b flex justify-between items-center">

//               <div>

//                 <h2 className="text-xl font-bold">
//                   Pause Subscription
//                 </h2>

//                 <p className="text-sm text-gray-500 mt-1">
//                   Select the pause period
//                 </p>

//               </div>

//               <button
//                 onClick={() =>
//                   setShowPauseModal(false)
//                 }
//                 className="text-2xl text-gray-400"
//               >
//                 ×
//               </button>

//             </div>


//             <div className="p-5">

//               <div className="mb-5">

//                 <label className="block font-semibold mb-2">
//                   From Date
//                 </label>

//                 <input
//                   type="date"
//                   value={pauseFrom}
//                   onChange={(e) =>
//                     setPauseFrom(
//                       e.target.value
//                     )
//                   }
//                   className="w-full border rounded-xl px-4 py-3"
//                 />

//               </div>


//               <div className="mb-5">

//                 <label className="block font-semibold mb-2">
//                   To Date
//                 </label>

//                 <input
//                   type="date"
//                   value={pauseTo}
//                   min={pauseFrom}
//                   onChange={(e) =>
//                     setPauseTo(
//                       e.target.value
//                     )
//                   }
//                   className="w-full border rounded-xl px-4 py-3"
//                 />

//               </div>


//               {pauseFrom && pauseTo && (

//                 <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">

//                   <p className="text-sm text-orange-700">

//                     Subscription will be paused from{" "}

//                     <strong>
//                       {formatDate(
//                         pauseFrom
//                       )}
//                     </strong>

//                     {" "}to{" "}

//                     <strong>
//                       {formatDate(
//                         pauseTo
//                       )}
//                     </strong>

//                     .

//                   </p>

//                 </div>

//               )}


//               <div className="flex gap-3">

//                 <button
//                   onClick={() =>
//                     setShowPauseModal(false)
//                   }
//                   disabled={pausing}
//                   className="flex-1 border py-3 rounded-xl font-semibold"
//                 >
//                   Cancel
//                 </button>


//                 <button
//                   onClick={
//                     pauseSubscription
//                   }
//                   disabled={
//                     !pauseFrom ||
//                     !pauseTo ||
//                     pausing
//                   }
//                   className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
//                 >

//                   {pausing
//                     ? "Pausing..."
//                     : "Pause Subscription"}

//                 </button>

//               </div>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* ======================================================
//           RIDER MODAL
//       ====================================================== */}

//       {showRiderModal && (

//         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

//           <div className="bg-white rounded-2xl w-full max-w-md">

//             <div className="p-5 border-b flex justify-between">

//               <h2 className="text-xl font-bold">
//                 Assign Rider
//               </h2>

//               <button
//                 onClick={() =>
//                   setShowRiderModal(false)
//                 }
//                 className="text-2xl"
//               >
//                 ×
//               </button>

//             </div>


//             <div className="p-5">

//               <label className="block font-semibold mb-2">
//                 Select Rider
//               </label>


//               <select
//                 value={assignRiderId}
//                 onChange={(e) =>
//                   setAssignRiderId(
//                     e.target.value
//                   )
//                 }
//                 className="w-full border rounded-xl px-4 py-3"
//               >

//                 <option value="">
//                   Select Rider
//                 </option>

//                 {riders.map(
//                   (rider) => (

//                     <option
//                       key={rider.id}
//                       value={rider.id}
//                     >

//                       {
//                         rider.name
//                       }

//                       {" - "}

//                       {
//                         rider.phone
//                       }

//                     </option>

//                   )
//                 )}

//               </select>


//               <div className="flex gap-3 mt-6">

//                 <button
//                   onClick={() =>
//                     setShowRiderModal(false)
//                   }
//                   className="flex-1 border py-3 rounded-xl"
//                 >
//                   Cancel
//                 </button>


//                 <button
//                   onClick={
//                     handleAssignRider
//                   }
//                   disabled={
//                     !assignRiderId ||
//                     assigning
//                   }
//                   className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
//                 >

//                   {assigning
//                     ? "Saving..."
//                     : selectedSubscriber?.rider_id
//                       ? "Change Rider"
//                       : "Assign Rider"}

//                 </button>

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // Selected subscriber
  const [selectedSubscriber, setSelectedSubscriber] =
    useState(null);

  // Rider modal
  const [showRiderModal, setShowRiderModal] =
    useState(false);

  const [assignRiderId, setAssignRiderId] =
    useState("");

  const [assigning, setAssigning] =
    useState(false);

  // Pause modal
  const [showPauseModal, setShowPauseModal] =
    useState(false);

  const [pauseFrom, setPauseFrom] =
    useState("");

  const [pauseTo, setPauseTo] =
    useState("");

  const [pausing, setPausing] =
    useState(false);

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadSubscriptions(),
      loadDeliveries(),
      loadRiders(),
    ]);
  };

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  const loadSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/subscriptions`
      );

      console.log(
        "SUBSCRIPTIONS:",
        res.data
      );

      setSubscriptions(
        res.data.subscriptions || []
      );
    } catch (error) {
      console.log(
        "SUBSCRIPTIONS ERROR:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ============================================================
  // DELIVERIES
  // ============================================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/admin/deliveries/subscription-deliveries`
      );

      console.log(
        "SUBSCRIPTION DELIVERIES:",
        res.data
      );

      setDeliveries(
        res.data.deliveries || []
      );
    } catch (error) {
      console.log(
        "DELIVERIES ERROR:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RIDERS
  // ============================================================

  const loadRiders = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/deliveries/riders`
      );

      setRiders(
        res.data.riders || []
      );
    } catch (error) {
      console.log(
        "RIDERS ERROR:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ============================================================
  // GET LOCAL DATE
  // ============================================================

  const getLocalDateString = (date) => {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ============================================================
  // GET TOMORROW DATE
  // ============================================================

  const getTomorrowDate = () => {
    const tomorrow =
      new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return getLocalDateString(
      tomorrow
    );
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const dateString =
      String(date).slice(0, 10);

    const parts =
      dateString.split("-");

    if (parts.length !== 3) {
      return dateString;
    }

    const [
      year,
      month,
      day,
    ] = parts;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex =
      Number(month) - 1;

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  // ============================================================
  // DATES
  // ============================================================

  const todayDate =
    getLocalDateString(
      new Date()
    );

  const tomorrowDate =
    getTomorrowDate();

  // ============================================================
  // TOMORROW'S PENDING DELIVERIES
  //
  // ACTIVE SUBSCRIPTIONS ONLY
  // ============================================================

  const tomorrowDeliveries =
    deliveries.filter(
      (delivery) => {
        const deliveryDate =
          String(
            delivery.delivery_date
          ).slice(0, 10);

        const status =
          String(
            delivery.delivery_status
          ).toLowerCase();

        return (
          deliveryDate ===
            tomorrowDate &&
          status === "pending"
        );
      }
    );

  console.log(
    "TODAY DATE =",
    todayDate
  );

  console.log(
    "TOMORROW DATE =",
    tomorrowDate
  );

  console.log(
    "TOMORROW PENDING DELIVERIES =",
    tomorrowDeliveries
  );

  // ============================================================
  // CREATE ACTIVE SUBSCRIBER LIST
  //
  // One card per subscription.
  // Only tomorrow pending deliveries.
  // ============================================================

  const subscribers = [];

  tomorrowDeliveries.forEach(
    (delivery) => {
      const userId =
        delivery.user_id;

      const subscriptionId =
        delivery.subscription_id;

      if (!userId || !subscriptionId) {
        return;
      }

      let subscriber =
        subscribers.find(
          (item) =>
            Number(
              item.subscription_id
            ) ===
            Number(subscriptionId)
        );

      if (!subscriber) {
        const subscription =
          subscriptions.find(
            (sub) =>
              Number(sub.id) ===
              Number(subscriptionId)
          );

        subscriber = {
          user_id: userId,

          subscription_id:
            subscriptionId,

          status:
            subscription?.status ||
            "Active",

          customer_name:
            delivery.customer_name ||
            subscription?.name ||
            "-",

          customer_phone:
            delivery.customer_phone ||
            subscription?.phone ||
            "-",

          plan:
            delivery.plan ||
            subscription?.plan ||
            "-",

          frequency:
            subscription?.frequency ||
            delivery.frequency ||
            "-",

          delivery_time:
            subscription?.delivery_time ||
            delivery.delivery_time ||
            "-",

          address:
            delivery.customer_address ||
            "-",

          deliveries: [],
        };

        subscribers.push(
          subscriber
        );
      }

      subscriber.deliveries.push(
        delivery
      );
    }
  );

  // ============================================================
  // COUNTS FOR ACTIVE SUBSCRIBERS
  // ============================================================

  subscribers.forEach(
    (subscriber) => {
      subscriber.total =
        subscriber.deliveries.length;

      subscriber.pending =
        subscriber.deliveries.filter(
          (d) =>
            String(
              d.delivery_status
            ).toLowerCase() ===
            "pending"
        ).length;

      subscriber.delivered =
        subscriber.deliveries.filter(
          (d) =>
            String(
              d.delivery_status
            ).toLowerCase() ===
            "delivered"
        ).length;

      subscriber.skipped =
        subscriber.deliveries.filter(
          (d) =>
            String(
              d.delivery_status
            ).toLowerCase() ===
            "skipped"
        ).length;

      subscriber.cancelled =
        subscriber.deliveries.filter(
          (d) =>
            String(
              d.delivery_status
            ).toLowerCase() ===
            "cancelled"
        ).length;

      subscriber.paused =
        subscriber.deliveries.filter(
          (d) =>
            String(
              d.delivery_status
            ).toLowerCase() ===
            "paused"
        ).length;

      const rider =
        subscriber.deliveries.find(
          (d) => d.rider_id
        );

      subscriber.rider_id =
        rider?.rider_id ||
        null;

      subscriber.rider_name =
        rider?.rider_name ||
        null;

      subscriber.rider_phone =
        rider?.rider_phone ||
        null;
    }
  );
  // ============================================================
// ONLY ONE CANCELLED CARD
// Show the latest cancelled subscription only
// ============================================================

const cancelledSubscriptions = subscriptions
  .filter((subscription) => {
    const status = String(
      subscription.status || ""
    ).toLowerCase();

    return status === "cancelled";
  })
  .sort(
    (a, b) =>
      Number(b.id) - Number(a.id)
  )
  .slice(0, 1);

console.log(
  "LATEST CANCELLED SUBSCRIPTION:",
  cancelledSubscriptions
);

  

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredSubscribers =
    subscribers.filter(
      (subscriber) => {
        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return true;
        }

        return (
          subscriber.customer_name
            ?.toLowerCase()
            .includes(value) ||

          subscriber.customer_phone
            ?.toLowerCase()
            .includes(value) ||

          subscriber.plan
            ?.toLowerCase()
            .includes(value)
        );
      }
    );

  const filteredCancelledSubscriptions =
    cancelledSubscriptions.filter(
      (subscription) => {
        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return true;
        }

        return (
          subscription.name
            ?.toLowerCase()
            .includes(value) ||

          subscription.phone
            ?.toLowerCase()
            .includes(value) ||

          subscription.plan
            ?.toLowerCase()
            .includes(value)
        );
      }
    );

  const hasAnySubscribers =
    filteredSubscribers.length > 0 ||
    filteredCancelledSubscriptions.length > 0;

  // ============================================================
  // OPEN ACTIVE SUBSCRIBER
  // ============================================================

  const openSubscriber = (
    subscriber
  ) => {
    setSelectedSubscriber(
      subscriber
    );
  };

  // ============================================================
  // OPEN CANCELLED SUBSCRIBER
  // ============================================================

  const openCancelledSubscriber = (
    subscription
  ) => {
    setSelectedSubscriber({
      user_id:
        subscription.user_id,

      subscription_id:
        subscription.id,

      status:
        "Cancelled",

      isCancelled:
        true,

      customer_name:
        subscription.name ||
        "-",

      customer_phone:
        subscription.phone ||
        "-",

      plan:
        subscription.plan ||
        "-",

      frequency:
        subscription.frequency ||
        "-",

      delivery_time:
        subscription.delivery_time ||
        "-",

      address:
        subscription.address ||
        "-",

      deliveries: [],

      total: 0,

      pending: 0,

      delivered: 0,

      skipped: 0,

      cancelled: 1,

      paused: 0,

      rider_id: null,

      rider_name: null,

      rider_phone: null,
    });
  };

  // ============================================================
  // CLOSE SUBSCRIBER
  // ============================================================

  const closeSubscriber = () => {
    setSelectedSubscriber(
      null
    );
  };

  // ============================================================
  // OPEN RIDER MODAL
  // ============================================================

  const openRiderModal = () => {
    if (!selectedSubscriber) {
      return;
    }

    setAssignRiderId(
      selectedSubscriber.rider_id
        ? String(
            selectedSubscriber.rider_id
          )
        : ""
    );

    setShowRiderModal(
      true
    );
  };

  // ============================================================
  // ASSIGN RIDER
  // ============================================================

  const handleAssignRider =
    async () => {
      if (!selectedSubscriber) {
        return;
      }

      if (!assignRiderId) {
        alert(
          "Please select a rider"
        );
        return;
      }

      try {
        setAssigning(true);

        const pendingDeliveries =
          selectedSubscriber.deliveries.filter(
            (delivery) =>
              String(
                delivery.delivery_status
              ).toLowerCase() ===
              "pending"
          );

        for (
          const delivery of
          pendingDeliveries
        ) {
          await axios.put(
            `${API_URL}/api/admin/deliveries/assign-rider`,
            {
              deliveryId:
                delivery.delivery_id,

              riderId:
                Number(
                  assignRiderId
                ),
            }
          );
        }

        alert(
          selectedSubscriber.rider_id
            ? "Rider changed successfully"
            : "Rider assigned successfully"
        );

        setShowRiderModal(
          false
        );

        await loadData();

        setSelectedSubscriber(
          (prev) => ({
            ...prev,
            rider_id:
              Number(
                assignRiderId
              ),

            rider_name:
              riders.find(
                (rider) =>
                  Number(
                    rider.id
                  ) ===
                  Number(
                    assignRiderId
                  )
              )?.name || null,

            rider_phone:
              riders.find(
                (rider) =>
                  Number(
                    rider.id
                  ) ===
                  Number(
                    assignRiderId
                  )
              )?.phone || null,
          })
        );
      } catch (error) {
        console.log(
          "ASSIGN RIDER ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Failed to assign rider"
        );
      } finally {
        setAssigning(false);
      }
    };

  // ============================================================
  // OPEN PAUSE MODAL
  // ============================================================

  const openPauseModal = () => {
    if (!selectedSubscriber) {
      return;
    }

    const today =
      getLocalDateString(
        new Date()
      );

    setPauseFrom(today);

    setPauseTo("");

    setShowPauseModal(
      true
    );
  };

  // ============================================================
  // PAUSE SUBSCRIPTION
  // ============================================================

  const pauseSubscription =
    async () => {
      if (!selectedSubscriber) {
        return;
      }

      const subscriptionId =
        selectedSubscriber.subscription_id;

      if (!subscriptionId) {
        alert(
          "Subscription ID not found"
        );
        return;
      }

      if (!pauseFrom) {
        alert(
          "Please select From date"
        );
        return;
      }

      if (!pauseTo) {
        alert(
          "Please select To date"
        );
        return;
      }

      if (pauseTo < pauseFrom) {
        alert(
          "To date cannot be before From date"
        );
        return;
      }

      try {
        setPausing(true);

        await axios.put(
          `${API_URL}/api/subscriptions/${subscriptionId}/pause`,
          {
            pause_from:
              pauseFrom,

            pause_to:
              pauseTo,
          }
        );

        alert(
          "Subscription paused successfully"
        );

        setShowPauseModal(
          false
        );

        await loadData();

        closeSubscriber();
      } catch (error) {
        console.log(
          "PAUSE ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Unable to pause subscription"
        );
      } finally {
        setPausing(false);
      }
    };

  // ============================================================
  // RESUME
  // ============================================================

  const resumeSubscription =
    async () => {
      if (!selectedSubscriber) {
        return;
      }

      const subscriptionId =
        selectedSubscriber.subscription_id;

      try {
        await axios.put(
          `${API_URL}/api/subscriptions/${subscriptionId}/resume`
        );

        alert(
          "Subscription resumed"
        );

        await loadData();

        closeSubscriber();
      } catch (error) {
        console.log(
          "RESUME ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Unable to resume subscription"
        );
      }
    };

  // ============================================================
  // CANCEL SUBSCRIPTION
  // ============================================================

  const cancelSubscription =
    async () => {
      if (!selectedSubscriber) {
        return;
      }

      const subscriptionId =
        selectedSubscriber.subscription_id;

      if (!subscriptionId) {
        alert(
          "Subscription ID not found"
        );
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this subscription?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const res =
          await axios.put(
            `${API_URL}/api/subscriptions/${subscriptionId}/admin-cancel`
          );

        console.log(
          "ADMIN CANCEL RESPONSE:",
          res.data
        );

        const today =
          getLocalDateString(
            new Date()
          );

        // ======================================================
        // UPDATE SUBSCRIPTIONS STATE
        // ======================================================

        setSubscriptions(
          (prev) =>
            prev.map(
              (subscription) =>
                Number(
                  subscription.id
                ) ===
                Number(
                  subscriptionId
                )
                  ? {
                      ...subscription,

                      status:
                        "Cancelled",

                      cancel_date:
                        today,
                    }
                  : subscription
            )
        );

        // ======================================================
        // UPDATE SELECTED POPUP
        //
        // Keep popup open.
        // ======================================================

        setSelectedSubscriber(
          (prev) => {
            if (!prev) {
              return prev;
            }

            return {
              ...prev,

              status:
                "Cancelled",

              isCancelled:
                true,

              cancel_date:
                today,

              deliveries: [],

              total: 0,

              pending: 0,

              delivered: 0,

              skipped: 0,

              cancelled: 1,

              paused: 0,

              rider_id: null,

              rider_name: null,

              rider_phone: null,
            };
          }
        );

        // ======================================================
        // UPDATE DELIVERY STATE LOCALLY
        // ======================================================

        setDeliveries(
          (prev) =>
            prev.map(
              (delivery) =>
                Number(
                  delivery.subscription_id
                ) ===
                Number(
                  subscriptionId
                ) &&
                String(
                  delivery.delivery_date
                ).slice(0, 10) ===
                  tomorrowDate
                  ? {
                      ...delivery,

                      delivery_status:
                        "Cancelled",
                    }
                  : delivery
            )
        );

        alert(
          "Subscription cancelled successfully"
        );
      } catch (error) {
        console.log(
          "ADMIN CANCEL ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Unable to cancel subscription"
        );
      }
    };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Subscribers
          </h1>

          <p className="text-gray-500 mt-1">
            Manage subscriptions and delivery history
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-gray-800 text-white px-5 py-2.5 rounded-lg"
        >
          ↻ Refresh
        </button>

      </div>

      {/* SEARCH */}

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search subscriber..."
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* CARDS */}

      {loading ? (

        <div className="bg-white rounded-xl p-10 text-center">
          Loading subscribers...
        </div>

      ) : !hasAnySubscribers ? (

        <div className="bg-white rounded-xl p-10 text-center">

          <div className="text-5xl mb-3">
            📦
          </div>

          <p className="text-gray-500">
            No subscribers found
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* ==================================================
              ACTIVE SUBSCRIBERS
          ================================================== */}

          {filteredSubscribers.map(
            (subscriber) => (

              <div
                key={
                  `active-${subscriber.subscription_id}`
                }
                onClick={() =>
                  openSubscriber(
                    subscriber
                  )
                }
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer transition overflow-hidden"
              >

                <div className="p-5">

                  <div className="flex justify-between items-start">

                    <div className="flex gap-3 items-center">

                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                        👤
                      </div>

                      <div>

                        <h2 className="font-bold text-lg text-gray-800">
                          {
                            subscriber.customer_name
                          }
                        </h2>

                        <p className="text-sm text-gray-500">
                          {
                            subscriber.customer_phone
                          }
                        </p>

                      </div>

                    </div>

                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </span>

                  </div>

                  <div className="mt-5">

                    <p className="text-xs text-gray-500">
                      Subscription
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      🥛{" "}
                      {
                        subscriber.plan
                      }
                    </p>

                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">

                    <p className="text-xs text-blue-500">
                      Tomorrow's Delivery
                    </p>

                    <p className="font-semibold text-blue-700 mt-1">
                      {formatDate(
                        tomorrowDate
                      )}
                    </p>

                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-5">

                    <div className="bg-gray-50 rounded-lg p-3 text-center">

                      <p className="text-xs text-gray-500">
                        Total
                      </p>

                      <p className="font-bold text-lg">
                        {
                          subscriber.total
                        }
                      </p>

                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3 text-center">

                      <p className="text-xs text-yellow-600">
                        Pending
                      </p>

                      <p className="font-bold text-lg text-yellow-600">
                        {
                          subscriber.pending
                        }
                      </p>

                    </div>

                    <div className="bg-green-50 rounded-lg p-3 text-center">

                      <p className="text-xs text-green-600">
                        Delivered
                      </p>

                      <p className="font-bold text-lg text-green-600">
                        {
                          subscriber.delivered
                        }
                      </p>

                    </div>

                    <div className="bg-gray-100 rounded-lg p-3 text-center">

                      <p className="text-xs text-gray-500">
                        Skipped
                      </p>

                      <p className="font-bold text-lg">
                        {
                          subscriber.skipped
                        }
                      </p>

                    </div>

                  </div>

                  <div className="mt-5 pt-4 border-t">

                    <p className="text-xs text-gray-500">
                      Rider
                    </p>

                    <p className="font-semibold mt-1">

                      {subscriber.rider_name
                        ? `🚴 ${subscriber.rider_name}`
                        : "⚠ Not Assigned"}

                    </p>

                  </div>

                </div>

                <div className="bg-gray-50 border-t px-5 py-3 flex justify-between">

                  <span className="text-sm text-gray-500">
                    View subscription
                  </span>

                  <span className="text-green-600 font-semibold">
                    View →
                  </span>

                </div>

              </div>
            )
          )}

          {/* ==================================================
              ALL CANCELLED SUBSCRIPTIONS
          ================================================== */}

          {filteredCancelledSubscriptions.map(
            (subscription) => (

              <div
                key={
                  `cancelled-${subscription.id}`
                }
                onClick={() =>
                  openCancelledSubscriber(
                    subscription
                  )
                }
                className="bg-white rounded-xl border border-red-200 shadow-sm hover:shadow-md cursor-pointer transition overflow-hidden"
              >

                <div className="p-4">

                  <div className="flex justify-between items-start">

                    <div className="flex gap-3 items-center">

                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">
                        👤
                      </div>

                      <div>

                        <h2 className="font-bold text-base text-gray-800">
                          {
                            subscription.name ||
                            "-"
                          }
                        </h2>

                        <p className="text-sm text-gray-500">
                          {
                            subscription.phone ||
                            "-"
                          }
                        </p>

                      </div>

                    </div>

                    <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold">
                      Cancelled
                    </span>

                  </div>

                  <div className="mt-4">

                    <p className="text-xs text-gray-500">
                      Subscription
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      🥛{" "}
                      {
                        subscription.plan ||
                        "-"
                      }
                    </p>

                  </div>

                  <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">

                    <p className="text-xs text-red-500">
                      Cancelled On
                    </p>

                    <p className="font-semibold text-red-700 mt-1">
                      {formatDate(
                        subscription.cancel_date
                      )}
                    </p>

                  </div>

                </div>

                <div className="bg-red-50 border-t border-red-100 px-4 py-3 flex justify-between">

                  <span className="text-sm text-gray-500">
                    View subscription
                  </span>

                  <span className="text-red-600 font-semibold">
                    Cancelled →
                  </span>

                </div>

              </div>
            )
          )}

        </div>

      )}

      {/* ======================================================
          SUBSCRIBER DETAILS
      ====================================================== */}

      {selectedSubscriber && (

        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="p-6 border-b flex justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-2xl font-bold">
                    {
                      selectedSubscriber.customer_name
                    }
                  </h2>

                  {selectedSubscriber.status?.toLowerCase() ===
                    "cancelled" && (

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                      Cancelled
                    </span>

                  )}

                </div>

                <p className="text-gray-500">
                  {
                    selectedSubscriber.customer_phone
                  }
                </p>

              </div>

              <button
                onClick={
                  closeSubscriber
                }
                className="text-3xl text-gray-400"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              {/* CANCELLED MESSAGE */}

              {selectedSubscriber.status?.toLowerCase() ===
                "cancelled" && (

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 font-semibold">

                  This subscription has been cancelled.

                </div>

              )}

              {/* SUBSCRIPTION */}

              <div
                className={`rounded-xl p-5 mb-5 ${
                  selectedSubscriber.status?.toLowerCase() ===
                  "cancelled"
                    ? "bg-red-50"
                    : "bg-green-50"
                }`}
              >

                <h3 className="font-bold mb-4">
                  Subscription
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div>

                    <p className="text-xs text-gray-500">
                      Plan
                    </p>

                    <p className="font-semibold">
                      {
                        selectedSubscriber.plan
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Frequency
                    </p>

                    <p className="font-semibold">
                      {
                        selectedSubscriber.frequency
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Delivery Time
                    </p>

                    <p className="font-semibold">
                      {
                        selectedSubscriber.delivery_time
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Subscription ID
                    </p>

                    <p className="font-semibold">
                      #
                      {
                        selectedSubscriber.subscription_id
                      }
                    </p>

                  </div>

                </div>

              </div>

              {/* SUMMARY */}

              {selectedSubscriber.status?.toLowerCase() ===
                "cancelled" ? (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">

                  <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">

                    <p className="text-xs text-red-500">
                      Status
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-1">
                      Cancelled
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 text-center">

                    <p className="text-xs text-gray-500">
                      Tomorrow's Delivery
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-1">
                      Cancelled
                    </p>

                  </div>

                </div>

              ) : (

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <p className="text-xs text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-bold">
                      {
                        selectedSubscriber.total
                      }
                    </p>

                  </div>

                  <div className="bg-yellow-50 rounded-xl p-4 text-center">

                    <p className="text-xs text-yellow-600">
                      Pending
                    </p>

                    <p className="text-2xl font-bold text-yellow-600">
                      {
                        selectedSubscriber.pending
                      }
                    </p>

                  </div>

                  <div className="bg-green-50 rounded-xl p-4 text-center">

                    <p className="text-xs text-green-600">
                      Delivered
                    </p>

                    <p className="text-2xl font-bold text-green-600">
                      {
                        selectedSubscriber.delivered
                      }
                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 text-center">

                    <p className="text-xs text-gray-500">
                      Skipped
                    </p>

                    <p className="text-2xl font-bold">
                      {
                        selectedSubscriber.skipped
                      }
                    </p>

                  </div>

                  <div className="bg-red-50 rounded-xl p-4 text-center">

                    <p className="text-xs text-red-500">
                      Cancelled
                    </p>

                    <p className="text-2xl font-bold text-red-500">
                      {
                        selectedSubscriber.cancelled
                      }
                    </p>

                  </div>

                </div>

              )}

              {/* ADDRESS */}

              {selectedSubscriber.address &&
                selectedSubscriber.address !==
                  "-" && (

                <div className="border rounded-xl p-5 mb-6">

                  <h3 className="font-bold mb-2">
                    Delivery Address
                  </h3>

                  <p className="text-gray-600">
                    📍{" "}
                    {
                      selectedSubscriber.address
                    }
                  </p>

                </div>

              )}

              {/* RIDER */}

              {selectedSubscriber.status?.toLowerCase() !==
                "cancelled" && (

                <div className="border rounded-xl p-5 mb-6">

                  <div className="flex justify-between items-center">

                    <div>

                      <h3 className="font-bold">
                        Assigned Rider
                      </h3>

                      {selectedSubscriber.rider_name ? (

                        <p className="text-green-600 mt-1 font-semibold">
                          🚴{" "}
                          {
                            selectedSubscriber.rider_name
                          }

                          {" - "}

                          {
                            selectedSubscriber.rider_phone
                          }
                        </p>

                      ) : (

                        <p className="text-orange-500 mt-1">
                          ⚠ Rider not assigned
                        </p>

                      )}

                    </div>

                    <button
                      onClick={
                        openRiderModal
                      }
                      className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold"
                    >
                      {
                        selectedSubscriber.rider_id
                          ? "Change Rider"
                          : "Assign Rider"
                      }
                    </button>

                  </div>

                </div>

              )}

              {/* ==================================================
                  TOMORROW DELIVERY
              ================================================== */}

              <div>

                <h3 className="font-bold text-lg mb-3">
                  Tomorrow's Delivery
                </h3>

                {selectedSubscriber.status?.toLowerCase() ===
                  "cancelled" ? (

                  <div className="border border-red-200 bg-red-50 rounded-xl p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-semibold">
                          {formatDate(
                            tomorrowDate
                          )}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Tomorrow's delivery
                        </p>

                      </div>

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Cancelled
                      </span>

                    </div>

                  </div>

                ) : selectedSubscriber.deliveries?.length >
                  0 ? (

                  <div className="border rounded-xl overflow-hidden">

                    {selectedSubscriber.deliveries
                      .filter(
                        (delivery) =>
                          String(
                            delivery.delivery_date
                          ).slice(0, 10) ===
                          tomorrowDate
                      )
                      .map(
                        (delivery) => (

                          <div
                            key={
                              delivery.delivery_id
                            }
                            className="flex items-center justify-between p-4"
                          >

                            <div>

                              <p className="font-semibold">
                                {formatDate(
                                  delivery.delivery_date
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                Delivery #
                                {
                                  delivery.delivery_id
                                }
                              </p>

                            </div>

                            <div className="flex items-center gap-4">

                              {delivery.rider_name && (

                                <span className="text-xs text-gray-500">
                                  🚴{" "}
                                  {
                                    delivery.rider_name
                                  }
                                </span>

                              )}

                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                {
                                  delivery.delivery_status
                                }
                              </span>

                            </div>

                          </div>

                        )
                      )}

                  </div>

                ) : (

                  <div className="border rounded-xl p-5 text-gray-500">
                    No pending delivery for tomorrow.
                  </div>

                )}

              </div>

              {/* ACTIONS */}

              <div className="border-t mt-6 pt-5 flex gap-3">

                {selectedSubscriber.status?.toLowerCase() !==
                  "cancelled" && (

                  <button
                    onClick={
                      selectedSubscriber.paused
                        ? resumeSubscription
                        : openPauseModal
                    }
                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold"
                  >
                    {selectedSubscriber.paused
                      ? "Resume Subscription"
                      : "Pause Subscription"}
                  </button>

                )}

                {selectedSubscriber.status?.toLowerCase() !==
                  "cancelled" && (

                  <button
                    onClick={
                      cancelSubscription
                    }
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Cancel Subscription
                  </button>

                )}

                <button
                  onClick={
                    closeSubscriber
                  }
                  className="flex-1 border py-3 rounded-xl font-semibold"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          PAUSE SUBSCRIPTION MODAL
      ====================================================== */}

      {showPauseModal && (

        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

            <div className="p-5 border-b flex justify-between items-center">

              <div>

                <h2 className="text-xl font-bold">
                  Pause Subscription
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select the pause period
                </p>

              </div>

              <button
                onClick={() =>
                  setShowPauseModal(
                    false
                  )
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            <div className="p-5">

              <div className="mb-5">

                <label className="block font-semibold mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  value={pauseFrom}
                  onChange={(e) =>
                    setPauseFrom(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

              </div>

              <div className="mb-5">

                <label className="block font-semibold mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  value={pauseTo}
                  min={pauseFrom}
                  onChange={(e) =>
                    setPauseTo(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

              </div>

              {pauseFrom &&
                pauseTo && (

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">

                  <p className="text-sm text-orange-700">

                    Subscription will be paused from{" "}

                    <strong>
                      {formatDate(
                        pauseFrom
                      )}
                    </strong>

                    {" "}to{" "}

                    <strong>
                      {formatDate(
                        pauseTo
                      )}
                    </strong>

                    .

                  </p>

                </div>

              )}

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setShowPauseModal(
                      false
                    )
                  }
                  disabled={pausing}
                  className="flex-1 border py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    pauseSubscription
                  }
                  disabled={
                    !pauseFrom ||
                    !pauseTo ||
                    pausing
                  }
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
                >
                  {pausing
                    ? "Pausing..."
                    : "Pause Subscription"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          RIDER MODAL
      ====================================================== */}

      {showRiderModal && (

        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md">

            <div className="p-5 border-b flex justify-between">

              <h2 className="text-xl font-bold">
                Assign Rider
              </h2>

              <button
                onClick={() =>
                  setShowRiderModal(
                    false
                  )
                }
                className="text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-5">

              <label className="block font-semibold mb-2">
                Select Rider
              </label>

              <select
                value={assignRiderId}
                onChange={(e) =>
                  setAssignRiderId(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3"
              >

                <option value="">
                  Select Rider
                </option>

                {riders.map(
                  (rider) => (

                    <option
                      key={
                        rider.id
                      }
                      value={
                        rider.id
                      }
                    >

                      {
                        rider.name
                      }

                      {" - "}

                      {
                        rider.phone
                      }

                    </option>

                  )
                )}

              </select>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowRiderModal(
                      false
                    )
                  }
                  className="flex-1 border py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleAssignRider
                  }
                  disabled={
                    !assignRiderId ||
                    assigning
                  }
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
                >

                  {assigning
                    ? "Saving..."
                    : selectedSubscriber?.rider_id
                      ? "Change Rider"
                      : "Assign Rider"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
