
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Subscription() {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [deliveries, setDeliveries] = useState([]);
//   const [riders, setRiders] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [assigningId, setAssigningId] = useState(null);

//   // Search and filters
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [riderFilter, setRiderFilter] = useState("All");

//   // Assign modal
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [selectedRider, setSelectedRider] = useState("");

//   // ============================================================
//   // LOAD DATA
//   // ============================================================

//   useEffect(() => {
//     loadSubscriptions();
//     loadRiders();
//     loadDeliveries();
//   }, []);

//   // ============================================================
//   // LOAD SUBSCRIPTIONS
//   // ============================================================

//   const loadSubscriptions = async () => {
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/subscriptions`
//       );

//       setSubscriptions(
//         res.data.subscriptions || []
//       );
//     } catch (error) {
//       console.log(
//         "Subscription API Error:",
//         error
//       );
//     }
//   };

//   // ============================================================
//   // LOAD RIDERS
//   // ============================================================

//   const loadRiders = async () => {
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/admin/deliveries/riders`
//       );

//       console.log(
//         "ADMIN RIDERS:",
//         res.data
//       );

//       setRiders(
//         res.data.riders || []
//       );
//     } catch (error) {
//       console.log(
//         "Riders API Error:",
//         error
//       );
//     }
//   };

//   // ============================================================
//   // LOAD DELIVERIES
//   // ============================================================

//   const loadDeliveries = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `${API_URL}/api/admin/deliveries/subscription-deliveries`
//       );

//       console.log(
//         "ADMIN DELIVERIES:",
//         res.data
//       );

//       setDeliveries(
//         res.data.deliveries || []
//       );
//     } catch (error) {
//       console.log(
//         "Deliveries API Error:",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============================================================
//   // REFRESH EVERYTHING
//   // ============================================================

//   const refreshAll = async () => {
//     await Promise.all([
//       loadSubscriptions(),
//       loadRiders(),
//       loadDeliveries()
//     ]);
//   };

//   // ============================================================
//   // OPEN ASSIGN MODAL
//   // ============================================================

//   const openAssignModal = (delivery) => {
//     setSelectedDelivery(delivery);

//     setSelectedRider(
//       delivery.rider_id
//         ? String(delivery.rider_id)
//         : ""
//     );

//     setShowModal(true);
//   };

//   // ============================================================
//   // CLOSE MODAL
//   // ============================================================

//   const closeAssignModal = () => {
//     if (assigningId) return;

//     setShowModal(false);
//     setSelectedDelivery(null);
//     setSelectedRider("");
//   };

//   // ============================================================
//   // ASSIGN RIDER
//   // ============================================================

//   const assignRider = async () => {
//     if (!selectedDelivery) {
//       return;
//     }

//     if (!selectedRider) {
//       alert("Please select a rider");
//       return;
//     }

//     try {
//       setAssigningId(
//         selectedDelivery.delivery_id
//       );

//       const res = await axios.put(
//         `${API_URL}/api/admin/deliveries/assign-rider`,
//         {
//           deliveryId:
//             selectedDelivery.delivery_id,

//           riderId: Number(selectedRider)
//         }
//       );

//       console.log(
//         "ASSIGN RIDER RESPONSE:",
//         res.data
//       );

//       if (res.data.success) {
//         alert(
//           "Rider assigned successfully"
//         );

//         await loadDeliveries();

//         closeAssignModal();
//       }
//     } catch (error) {
//       console.log(
//         "Assign Rider Error:",
//         error.response?.data ||
//           error.message
//       );

//       alert(
//         error.response?.data?.message ||
//           "Failed to assign rider"
//       );
//     } finally {
//       setAssigningId(null);
//     }
//   };

//   // ============================================================
//   // STATUS STYLE
//   // ============================================================

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700 border-yellow-200";

//       case "Delivered":
//         return "bg-blue-100 text-blue-700 border-blue-200";

//       case "Skipped":
//         return "bg-gray-100 text-gray-700 border-gray-200";

//       case "Cancelled":
//         return "bg-red-100 text-red-700 border-red-200";

//       case "Paused":
//         return "bg-orange-100 text-orange-700 border-orange-200";

//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   // ============================================================
//   // STATUS ICON
//   // ============================================================

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Pending":
//         return "⏳";

//       case "Delivered":
//         return "✓";

//       case "Skipped":
//         return "⏭";

//       case "Cancelled":
//         return "✕";

//       case "Paused":
//         return "Ⅱ";

//       default:
//         return "•";
//     }
//   };

//   // ============================================================
//   // FORMAT DATE
//   // ============================================================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric"
//       }
//     );
//   };

//   // ============================================================
//   // FILTER DELIVERIES
//   // ============================================================

//   const filteredDeliveries =
//     deliveries.filter((delivery) => {
//       const searchText =
//         search.trim().toLowerCase();

//       const matchesSearch =
//         !searchText ||
//         String(
//           delivery.delivery_id || ""
//         )
//           .toLowerCase()
//           .includes(searchText) ||
//         String(
//           delivery.customer_name || ""
//         )
//           .toLowerCase()
//           .includes(searchText) ||
//         String(
//           delivery.customer_phone || ""
//         )
//           .toLowerCase()
//           .includes(searchText) ||
//         String(
//           delivery.plan || ""
//         )
//           .toLowerCase()
//           .includes(searchText) ||
//         String(
//           delivery.rider_name || ""
//         )
//           .toLowerCase()
//           .includes(searchText);

//       const matchesStatus =
//         statusFilter === "All" ||
//         delivery.delivery_status ===
//           statusFilter;

//       const matchesRider =
//         riderFilter === "All" ||
//         String(
//           delivery.rider_id || ""
//         ) === String(riderFilter);

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesRider
//       );
//     });

//   // ============================================================
//   // COUNTS
//   // ============================================================

//   const totalDeliveries =
//     deliveries.length;

//   const pendingDeliveries =
//     deliveries.filter(
//       (d) =>
//         d.delivery_status === "Pending"
//     ).length;

//   const assignedDeliveries =
//     deliveries.filter(
//       (d) => d.rider_id
//     ).length;

//   const deliveredDeliveries =
//     deliveries.filter(
//       (d) =>
//         d.delivery_status ===
//         "Delivered"
//     ).length;

//   // ============================================================
//   // RETURN
//   // ============================================================

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* ======================================================
//           PAGE HEADER
//       ====================================================== */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             Subscription Deliveries
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage subscription deliveries and assign riders
//           </p>
//         </div>

//         <button
//           onClick={refreshAll}
//           disabled={loading}
//           className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
//         >
//           {loading
//             ? "Refreshing..."
//             : "↻ Refresh"}
//         </button>

//       </div>

//       {/* ======================================================
//           SUMMARY CARDS
//       ====================================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

//         {/* TOTAL */}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Total Deliveries
//               </p>

//               <h2 className="text-3xl font-bold text-gray-800 mt-1">
//                 {totalDeliveries}
//               </h2>
//             </div>

//             <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
//               📦
//             </div>

//           </div>

//         </div>

//         {/* PENDING */}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Pending
//               </p>

//               <h2 className="text-3xl font-bold text-yellow-600 mt-1">
//                 {pendingDeliveries}
//               </h2>
//             </div>

//             <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
//               ⏳
//             </div>

//           </div>

//         </div>

//         {/* ASSIGNED */}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Assigned
//               </p>

//               <h2 className="text-3xl font-bold text-green-600 mt-1">
//                 {assignedDeliveries}
//               </h2>
//             </div>

//             <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
//               🚴
//             </div>

//           </div>

//         </div>

//         {/* DELIVERED */}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

//           <div className="flex items-center justify-between">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Delivered
//               </p>

//               <h2 className="text-3xl font-bold text-blue-600 mt-1">
//                 {deliveredDeliveries}
//               </h2>
//             </div>

//             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
//               🚚
//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ======================================================
//           FILTER BAR
//       ====================================================== */}

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//           {/* SEARCH */}

//           <div className="relative">

//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               🔍
//             </span>

//             <input
//               type="text"
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//               placeholder="Search customer, phone, plan, rider..."
//               className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />

//           </div>

//           {/* STATUS */}

//           <select
//             value={statusFilter}
//             onChange={(e) =>
//               setStatusFilter(
//                 e.target.value
//               )
//             }
//             className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
//           >

//             <option value="All">
//               All Status
//             </option>

//             <option value="Pending">
//               Pending
//             </option>

//             <option value="Delivered">
//               Delivered
//             </option>

//             <option value="Skipped">
//               Skipped
//             </option>

//             <option value="Cancelled">
//               Cancelled
//             </option>

//             <option value="Paused">
//               Paused
//             </option>

//           </select>

//           {/* RIDER */}

//           <select
//             value={riderFilter}
//             onChange={(e) =>
//               setRiderFilter(
//                 e.target.value
//               )
//             }
//             className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
//           >

//             <option value="All">
//               All Riders
//             </option>

//             {riders.map((rider) => (

//               <option
//                 key={rider.id}
//                 value={rider.id}
//               >
//                 {rider.name}
//               </option>

//             ))}

//           </select>

//         </div>

//         {/* RESULT COUNT */}

//         <div className="mt-3 text-sm text-gray-500">

//           Showing{" "}
//           <span className="font-semibold text-gray-700">
//             {filteredDeliveries.length}
//           </span>{" "}
//           of{" "}
//           <span className="font-semibold text-gray-700">
//             {deliveries.length}
//           </span>{" "}
//           deliveries

//         </div>

//       </div>

//       {/* ======================================================
//           DELIVERY CARDS
//       ====================================================== */}

//       {loading ? (

//         <div className="bg-white rounded-xl p-12 text-center shadow-sm">

//           <div className="text-4xl mb-3">
//             ⏳
//           </div>

//           <p className="text-gray-500">
//             Loading deliveries...
//           </p>

//         </div>

//       ) : filteredDeliveries.length === 0 ? (

//         <div className="bg-white rounded-xl p-12 text-center shadow-sm">

//           <div className="text-5xl mb-4">
//             📦
//           </div>

//           <h3 className="text-xl font-semibold text-gray-700">
//             No deliveries found
//           </h3>

//           <p className="text-gray-500 mt-1">
//             Try changing your search or filters.
//           </p>

//         </div>

//       ) : (

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

//           {filteredDeliveries.map(
//             (delivery) => (

//               <div
//                 key={
//                   delivery.delivery_id
//                 }
//                 className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
//               >

//                 {/* CARD HEADER */}

//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

//                   <div>

//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                       Delivery
//                     </p>

//                     <h2 className="text-xl font-bold text-gray-800">
//                       #{delivery.delivery_id}
//                     </h2>

//                   </div>

//                   <span
//                     className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(
//                       delivery.delivery_status
//                     )}`}
//                   >

//                     {getStatusIcon(
//                       delivery.delivery_status
//                     )}

//                     {" "}

//                     {delivery.delivery_status ||
//                       "-"}

//                   </span>

//                 </div>

//                 {/* CARD BODY */}

//                 <div className="p-5">

//                   {/* DATE */}

//                   <div className="flex items-center gap-3 mb-4">

//                     <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
//                       📅
//                     </div>

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Delivery Date
//                       </p>

//                       <p className="font-semibold text-gray-800">
//                         {formatDate(
//                           delivery.delivery_date
//                         )}
//                       </p>

//                     </div>

//                   </div>

//                   {/* CUSTOMER */}

//                   <div className="flex items-start gap-3 mb-4">

//                     <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
//                       👤
//                     </div>

//                     <div className="min-w-0">

//                       <p className="text-xs text-gray-500">
//                         Customer
//                       </p>

//                       <p className="font-semibold text-gray-800 truncate">
//                         {delivery.customer_name ||
//                           "-"}
//                       </p>

//                       <p className="text-sm text-gray-500">
//                         {delivery.customer_phone ||
//                           "-"}
//                       </p>

//                     </div>

//                   </div>

//                   {/* PLAN */}

//                   <div className="mb-4">

//                     <p className="text-xs text-gray-500 mb-1">
//                       Subscription
//                     </p>

//                     <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
//                       🥛{" "}
//                       {delivery.plan ||
//                         "-"}
//                     </span>

//                   </div>

//                   {/* ADDRESS */}

//                   <div className="mb-5">

//                     <p className="text-xs text-gray-500 mb-1">
//                       Delivery Address
//                     </p>

//                     {delivery.customer_address ? (

//                       <div className="flex items-start gap-2">

//                         <span>
//                           📍
//                         </span>

//                         <p className="text-sm text-gray-700 line-clamp-2">
//                           {
//                             delivery.customer_address
//                           }
//                         </p>

//                       </div>

//                     ) : (

//                       <div className="bg-red-50 border border-red-200 rounded-lg p-3">

//                         <p className="text-sm text-red-600 font-medium">
//                           ⚠ Address missing
//                         </p>

//                       </div>

//                     )}

//                   </div>

//                   {/* RIDER */}

//                   <div className="border-t border-gray-100 pt-4">

//                     <p className="text-xs text-gray-500 mb-2">
//                       Assigned Rider
//                     </p>

//                     {delivery.rider_name ? (

//                       <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">

//                         <div className="flex items-center gap-3">

//                           <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
//                             🚴
//                           </div>

//                           <div>

//                             <p className="font-semibold text-gray-800">
//                               {
//                                 delivery.rider_name
//                               }
//                             </p>

//                             <p className="text-xs text-gray-500">
//                               {
//                                 delivery.rider_phone
//                               }
//                             </p>

//                           </div>

//                         </div>

//                         <span className="text-green-600 text-xs font-semibold">
//                           Assigned
//                         </span>

//                       </div>

//                     ) : (

//                       <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">

//                         <p className="text-sm text-orange-700 font-medium">
//                           ⚠ Rider not assigned
//                         </p>

//                       </div>

//                     )}

//                   </div>

//                   {/* ACTION BUTTON */}

//                   <button
//                     onClick={() =>
//                       openAssignModal(
//                         delivery
//                       )
//                     }
//                     className={`w-full mt-4 py-2.5 rounded-xl font-semibold transition ${
//                       delivery.rider_id
//                         ? "bg-gray-800 text-white hover:bg-gray-700"
//                         : "bg-green-600 text-white hover:bg-green-700"
//                     }`}
//                   >

//                     {delivery.rider_id
//                       ? "↔ Change Rider"
//                       : "＋ Assign Rider"}

//                   </button>

//                 </div>

//               </div>

//             )
//           )}

//         </div>

//       )}

//       {/* ======================================================
//           ASSIGN RIDER MODAL
//       ====================================================== */}

//       {showModal &&
//         selectedDelivery && (

//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

//             {/* BACKDROP */}

//             <div
//               className="absolute inset-0 bg-black/50"
//               onClick={closeAssignModal}
//             />

//             {/* MODAL */}

//             <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

//               {/* MODAL HEADER */}

//               <div className="bg-green-600 px-6 py-5 text-white">

//                 <div className="flex items-center justify-between">

//                   <div>

//                     <p className="text-green-100 text-sm">
//                       Delivery #
//                       {
//                         selectedDelivery.delivery_id
//                       }
//                     </p>

//                     <h2 className="text-2xl font-bold">
//                       Assign Rider
//                     </h2>

//                   </div>

//                   <button
//                     onClick={
//                       closeAssignModal
//                     }
//                     className="text-white text-3xl hover:text-green-100"
//                   >
//                     ×
//                   </button>

//                 </div>

//               </div>

//               {/* MODAL BODY */}

//               <div className="p-6">

//                 {/* CUSTOMER INFO */}

//                 <div className="bg-gray-50 rounded-xl p-4 mb-5">

//                   <div className="grid grid-cols-2 gap-4">

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Customer
//                       </p>

//                       <p className="font-semibold text-gray-800">
//                         {
//                           selectedDelivery.customer_name ||
//                           "-"
//                         }
//                       </p>

//                     </div>

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Phone
//                       </p>

//                       <p className="font-semibold text-gray-800">
//                         {
//                           selectedDelivery.customer_phone ||
//                           "-"
//                         }
//                       </p>

//                     </div>

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Plan
//                       </p>

//                       <p className="font-semibold text-green-700">
//                         {
//                           selectedDelivery.plan ||
//                           "-"
//                         }
//                       </p>

//                     </div>

//                     <div>

//                       <p className="text-xs text-gray-500">
//                         Date
//                       </p>

//                       <p className="font-semibold text-gray-800">
//                         {formatDate(
//                           selectedDelivery.delivery_date
//                         )}
//                       </p>

//                     </div>

//                   </div>

//                   <div className="mt-4">

//                     <p className="text-xs text-gray-500">
//                       Address
//                     </p>

//                     <p className="text-sm text-gray-700 mt-1">
//                       📍{" "}
//                       {
//                         selectedDelivery.customer_address ||
//                         "Address missing"
//                       }
//                     </p>

//                   </div>

//                 </div>

//                 {/* CURRENT RIDER */}

//                 {selectedDelivery.rider_name && (

//                   <div className="mb-5">

//                     <p className="text-sm font-semibold text-gray-700 mb-2">
//                       Current Rider
//                     </p>

//                     <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">

//                       <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
//                         🚴
//                       </div>

//                       <div>

//                         <p className="font-semibold">
//                           {
//                             selectedDelivery.rider_name
//                           }
//                         </p>

//                         <p className="text-xs text-gray-500">
//                           {
//                             selectedDelivery.rider_phone
//                           }
//                         </p>

//                       </div>

//                     </div>

//                   </div>

//                 )}

//                 {/* RIDER SELECT */}

//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Select Rider
//                 </label>

//                 <select
//                   value={selectedRider}
//                   onChange={(e) =>
//                     setSelectedRider(
//                       e.target.value
//                     )
//                   }
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >

//                   <option value="">
//                     Select a rider
//                   </option>

//                   {riders.map(
//                     (rider) => (

//                       <option
//                         key={rider.id}
//                         value={rider.id}
//                       >
//                         {rider.name}
//                         {" - "}
//                         {rider.phone}
//                       </option>

//                     )
//                   )}

//                 </select>

//                 {/* BUTTONS */}

//                 <div className="flex gap-3 mt-6">

//                   <button
//                     onClick={
//                       closeAssignModal
//                     }
//                     disabled={!!assigningId}
//                     className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={assignRider}
//                     disabled={
//                       !!assigningId ||
//                       !selectedRider
//                     }
//                     className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-400"
//                   >

//                     {assigningId
//                       ? "Assigning..."
//                       : selectedDelivery.rider_id
//                         ? "Change Rider"
//                         : "Assign Rider"}

//                   </button>

//                 </div>

//               </div>

//             </div>

//           </div>

//         )}

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
      loadRiders()
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
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  // ============================================================
  // CREATE SUBSCRIBER LIST
  // ============================================================

  const subscribers = [];


  deliveries.forEach((delivery) => {

    const userId =
      delivery.user_id;

    if (!userId) return;


    let subscriber =
      subscribers.find(
        (item) =>
          Number(item.user_id) ===
          Number(userId)
      );


    if (!subscriber) {

      const subscription =
        subscriptions.find(
          (sub) =>
            Number(sub.id) ===
            Number(
              delivery.subscription_id
            )
        );


      subscriber = {

        user_id: userId,

        subscription_id:
          delivery.subscription_id,

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

        deliveries: []

      };


      subscribers.push(
        subscriber
      );

    }


    subscriber.deliveries.push(
      delivery
    );

  });


  // ============================================================
  // COUNTS
  // ============================================================

  subscribers.forEach(
    (subscriber) => {

      subscriber.total =
        subscriber.deliveries.length;


      subscriber.pending =
        subscriber.deliveries.filter(
          (d) =>
            d.delivery_status ===
            "Pending"
        ).length;


      subscriber.delivered =
        subscriber.deliveries.filter(
          (d) =>
            d.delivery_status ===
            "Delivered"
        ).length;


      subscriber.skipped =
        subscriber.deliveries.filter(
          (d) =>
            d.delivery_status ===
            "Skipped"
        ).length;


      subscriber.cancelled =
        subscriber.deliveries.filter(
          (d) =>
            d.delivery_status ===
            "Cancelled"
        ).length;


      subscriber.paused =
        subscriber.deliveries.filter(
          (d) =>
            d.delivery_status ===
            "Paused"
        ).length;


      const rider =
        subscriber.deliveries.find(
          (d) => d.rider_id
        );


      subscriber.rider_id =
        rider?.rider_id || null;


      subscriber.rider_name =
        rider?.rider_name || null;


      subscriber.rider_phone =
        rider?.rider_phone || null;

    }
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


        if (!value) return true;


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


  // ============================================================
  // OPEN SUBSCRIBER
  // ============================================================

  const openSubscriber = (
    subscriber
  ) => {

    setSelectedSubscriber(
      subscriber
    );

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

    if (!selectedSubscriber)
      return;


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

      if (
        !selectedSubscriber
      )
        return;


      if (!assignRiderId) {

        alert(
          "Please select a rider"
        );

        return;

      }


      try {

        setAssigning(true);


        /*
         * We assign the selected rider
         * to all pending deliveries
         * of this subscriber.
         */

        const pendingDeliveries =
          selectedSubscriber
            .deliveries
            .filter(
              (delivery) =>
                delivery.delivery_status ===
                "Pending"
            );


        for (
          const delivery
          of pendingDeliveries
        ) {

          await axios.put(
            `${API_URL}/api/admin/deliveries/assign-rider`,
            {
              deliveryId:
                delivery.delivery_id,

              riderId:
                Number(
                  assignRiderId
                )
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


        // Find updated subscriber
        // after reload

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
  // PAUSE
  // ============================================================

  const pauseSubscription =
    async () => {

      if (
        !selectedSubscriber
      )
        return;


      const subscriptionId =
        selectedSubscriber
          .subscription_id;


      if (!subscriptionId) {

        alert(
          "Subscription ID not found"
        );

        return;

      }


      const confirmPause =
        window.confirm(
          "Pause this subscription?"
        );


      if (!confirmPause)
        return;


      try {

        await axios.put(
          `${API_URL}/api/subscriptions/${subscriptionId}/pause`
        );


        alert(
          "Subscription paused"
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

      }

    };


  // ============================================================
  // RESUME
  // ============================================================

  const resumeSubscription =
    async () => {

      if (
        !selectedSubscriber
      )
        return;


      const subscriptionId =
        selectedSubscriber
          .subscription_id;


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

      ) : filteredSubscribers.length === 0 ? (

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

          {filteredSubscribers.map(
            (subscriber) => (

              <div
                key={
                  subscriber.user_id
                }
                onClick={() =>
                  openSubscriber(
                    subscriber
                  )
                }
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg cursor-pointer transition overflow-hidden"
              >

                {/* CUSTOMER */}

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
                      Subscriber
                    </span>

                  </div>


                  {/* PLAN */}

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


                  {/* COUNTS */}

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


                  {/* RIDER */}

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


                {/* FOOTER */}

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

                <h2 className="text-2xl font-bold">
                  {
                    selectedSubscriber.customer_name
                  }
                </h2>

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


              {/* SUBSCRIPTION */}

              <div className="bg-green-50 rounded-xl p-5 mb-5">

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


              {/* ADDRESS */}

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


              {/* RIDER */}

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


              {/* DELIVERY HISTORY */}

              <div>

                <h3 className="font-bold text-lg mb-3">
                  Delivery History
                </h3>


                <div className="border rounded-xl overflow-hidden">

                  {selectedSubscriber
                    .deliveries
                    .sort(
                      (a, b) =>
                        new Date(
                          b.delivery_date
                        ) -
                        new Date(
                          a.delivery_date
                        )
                    )
                    .map(
                      (delivery) => (

                        <div
                          key={
                            delivery.delivery_id
                          }
                          className="flex items-center justify-between p-4 border-b last:border-b-0"
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


                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                delivery.delivery_status ===
                                "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : delivery.delivery_status ===
                                    "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : delivery.delivery_status ===
                                      "Skipped"
                                      ? "bg-gray-100 text-gray-600"
                                      : "bg-red-100 text-red-600"
                              }`}
                            >
                              {
                                delivery.delivery_status
                              }
                            </span>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </div>


              {/* ACTIONS */}

              <div className="border-t mt-6 pt-5 flex gap-3">

                <button
                  onClick={
                    selectedSubscriber
                      .paused
                      ? resumeSubscription
                      : pauseSubscription
                  }
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold"
                >
                  {selectedSubscriber.paused
                    ? "Resume Subscription"
                    : "Pause Subscription"}
                </button>


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
                  setShowRiderModal(false)
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
                      key={rider.id}
                      value={rider.id}
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
                    setShowRiderModal(false)
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