// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Subscription() {
//   const [subscriptions, setSubscriptions] = useState([]);

//   useEffect(() => {
//     loadSubscriptions();
//   }, []);

//   const loadSubscriptions = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/subscriptions`);
//       setSubscriptions(res.data.subscriptions || []);
//     } catch (error) {
//       console.log("Subscription API Error:", error);
//     }
//   };
//   // Status background colors

//   const getStatusStyle = (status) => {
//     switch(status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Active":
//         return "bg-green-100 text-green-700";
//       case "Delivered":
//         return "bg-blue-100 text-blue-700";
//       case "Cancelled":
//         return "bg-red-100 text-red-700";
//       case "Paused":
//         return "bg-orange-100 text-orange-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }

//   };

//   // Status icons

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case "Pending":
//         return "⏳";
//       case "Active":
//         return "✅";
//       case "Delivered":
//         return "🚚";
//       case "Cancelled":
//         return "❌";
//       case "Paused":
//         return "⏸️";
//       default:
//         return "";
//     }

//   };
//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6"> Subscribers</h1>
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-green-600 text-white">
//             <tr>
//               <th className="p-4 text-left">Name</th>
//               <th className="p-4 text-left">
//                 Phone
//               </th>
//               <th className="p-4 text-left">
//                 Plan
//               </th>
//               <th className="p-4 text-left">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//           {
//             subscriptions.map((sub)=>(
//               <tr key={sub.id}className="border-b hover:bg-gray-50 transition">
//                 <td className="p-4 font-medium text-gray-800">{sub.name} </td>
//                 <td className="p-4 text-gray-600"> {sub.phone}</td>
//                 <td className="p-4">
//                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
//                     {sub.plan}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-4 py-2 rounded-full text-sm font-semibold   ${getStatusStyle(sub.status)}`}>{getStatusIcon(sub.status)}{" "}{sub.status} </span>
//                 </td>
//               </tr>
//             ))
//           }
//           </tbody>
//         </table>
//       </div>
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
  const [assigningId, setAssigningId] = useState(null);

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riderFilter, setRiderFilter] = useState("All");

  // Assign modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadSubscriptions();
    loadRiders();
    loadDeliveries();
  }, []);

  // ============================================================
  // LOAD SUBSCRIPTIONS
  // ============================================================

  const loadSubscriptions = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/subscriptions`
      );

      setSubscriptions(
        res.data.subscriptions || []
      );
    } catch (error) {
      console.log(
        "Subscription API Error:",
        error
      );
    }
  };

  // ============================================================
  // LOAD RIDERS
  // ============================================================

  const loadRiders = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/deliveries/riders`
      );

      console.log(
        "ADMIN RIDERS:",
        res.data
      );

      setRiders(
        res.data.riders || []
      );
    } catch (error) {
      console.log(
        "Riders API Error:",
        error
      );
    }
  };

  // ============================================================
  // LOAD DELIVERIES
  // ============================================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/admin/deliveries/subscription-deliveries`
      );

      console.log(
        "ADMIN DELIVERIES:",
        res.data
      );

      setDeliveries(
        res.data.deliveries || []
      );
    } catch (error) {
      console.log(
        "Deliveries API Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REFRESH EVERYTHING
  // ============================================================

  const refreshAll = async () => {
    await Promise.all([
      loadSubscriptions(),
      loadRiders(),
      loadDeliveries()
    ]);
  };

  // ============================================================
  // OPEN ASSIGN MODAL
  // ============================================================

  const openAssignModal = (delivery) => {
    setSelectedDelivery(delivery);

    setSelectedRider(
      delivery.rider_id
        ? String(delivery.rider_id)
        : ""
    );

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeAssignModal = () => {
    if (assigningId) return;

    setShowModal(false);
    setSelectedDelivery(null);
    setSelectedRider("");
  };

  // ============================================================
  // ASSIGN RIDER
  // ============================================================

  const assignRider = async () => {
    if (!selectedDelivery) {
      return;
    }

    if (!selectedRider) {
      alert("Please select a rider");
      return;
    }

    try {
      setAssigningId(
        selectedDelivery.delivery_id
      );

      const res = await axios.put(
        `${API_URL}/api/admin/deliveries/assign-rider`,
        {
          deliveryId:
            selectedDelivery.delivery_id,

          riderId: Number(selectedRider)
        }
      );

      console.log(
        "ASSIGN RIDER RESPONSE:",
        res.data
      );

      if (res.data.success) {
        alert(
          "Rider assigned successfully"
        );

        await loadDeliveries();

        closeAssignModal();
      }
    } catch (error) {
      console.log(
        "Assign Rider Error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to assign rider"
      );
    } finally {
      setAssigningId(null);
    }
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Delivered":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Skipped":
        return "bg-gray-100 text-gray-700 border-gray-200";

      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "Paused":
        return "bg-orange-100 text-orange-700 border-orange-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ============================================================
  // STATUS ICON
  // ============================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";

      case "Delivered":
        return "✓";

      case "Skipped":
        return "⏭";

      case "Cancelled":
        return "✕";

      case "Paused":
        return "Ⅱ";

      default:
        return "•";
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
  // FILTER DELIVERIES
  // ============================================================

  const filteredDeliveries =
    deliveries.filter((delivery) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        String(
          delivery.delivery_id || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          delivery.customer_name || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          delivery.customer_phone || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          delivery.plan || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(
          delivery.rider_name || ""
        )
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        delivery.delivery_status ===
          statusFilter;

      const matchesRider =
        riderFilter === "All" ||
        String(
          delivery.rider_id || ""
        ) === String(riderFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRider
      );
    });

  // ============================================================
  // COUNTS
  // ============================================================

  const totalDeliveries =
    deliveries.length;

  const pendingDeliveries =
    deliveries.filter(
      (d) =>
        d.delivery_status === "Pending"
    ).length;

  const assignedDeliveries =
    deliveries.filter(
      (d) => d.rider_id
    ).length;

  const deliveredDeliveries =
    deliveries.filter(
      (d) =>
        d.delivery_status ===
        "Delivered"
    ).length;

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Subscription Deliveries
          </h1>

          <p className="text-gray-500 mt-1">
            Manage subscription deliveries and assign riders
          </p>
        </div>

        <button
          onClick={refreshAll}
          disabled={loading}
          className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
        >
          {loading
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* TOTAL */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Deliveries
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-1">
                {totalDeliveries}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              📦
            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="text-3xl font-bold text-yellow-600 mt-1">
                {pendingDeliveries}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
              ⏳
            </div>

          </div>

        </div>

        {/* ASSIGNED */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Assigned
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-1">
                {assignedDeliveries}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              🚴
            </div>

          </div>

        </div>

        {/* DELIVERED */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Delivered
              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-1">
                {deliveredDeliveries}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              🚚
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div className="relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer, phone, plan, rider..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Skipped">
              Skipped
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="Paused">
              Paused
            </option>

          </select>

          {/* RIDER */}

          <select
            value={riderFilter}
            onChange={(e) =>
              setRiderFilter(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="All">
              All Riders
            </option>

            {riders.map((rider) => (

              <option
                key={rider.id}
                value={rider.id}
              >
                {rider.name}
              </option>

            ))}

          </select>

        </div>

        {/* RESULT COUNT */}

        <div className="mt-3 text-sm text-gray-500">

          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredDeliveries.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">
            {deliveries.length}
          </span>{" "}
          deliveries

        </div>

      </div>

      {/* ======================================================
          DELIVERY CARDS
      ====================================================== */}

      {loading ? (

        <div className="bg-white rounded-xl p-12 text-center shadow-sm">

          <div className="text-4xl mb-3">
            ⏳
          </div>

          <p className="text-gray-500">
            Loading deliveries...
          </p>

        </div>

      ) : filteredDeliveries.length === 0 ? (

        <div className="bg-white rounded-xl p-12 text-center shadow-sm">

          <div className="text-5xl mb-4">
            📦
          </div>

          <h3 className="text-xl font-semibold text-gray-700">
            No deliveries found
          </h3>

          <p className="text-gray-500 mt-1">
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredDeliveries.map(
            (delivery) => (

              <div
                key={
                  delivery.delivery_id
                }
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Delivery
                    </p>

                    <h2 className="text-xl font-bold text-gray-800">
                      #{delivery.delivery_id}
                    </h2>

                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(
                      delivery.delivery_status
                    )}`}
                  >

                    {getStatusIcon(
                      delivery.delivery_status
                    )}

                    {" "}

                    {delivery.delivery_status ||
                      "-"}

                  </span>

                </div>

                {/* CARD BODY */}

                <div className="p-5">

                  {/* DATE */}

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      📅
                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Delivery Date
                      </p>

                      <p className="font-semibold text-gray-800">
                        {formatDate(
                          delivery.delivery_date
                        )}
                      </p>

                    </div>

                  </div>

                  {/* CUSTOMER */}

                  <div className="flex items-start gap-3 mb-4">

                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      👤
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-gray-500">
                        Customer
                      </p>

                      <p className="font-semibold text-gray-800 truncate">
                        {delivery.customer_name ||
                          "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {delivery.customer_phone ||
                          "-"}
                      </p>

                    </div>

                  </div>

                  {/* PLAN */}

                  <div className="mb-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Subscription
                    </p>

                    <span className="inline-block bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                      🥛{" "}
                      {delivery.plan ||
                        "-"}
                    </span>

                  </div>

                  {/* ADDRESS */}

                  <div className="mb-5">

                    <p className="text-xs text-gray-500 mb-1">
                      Delivery Address
                    </p>

                    {delivery.customer_address ? (

                      <div className="flex items-start gap-2">

                        <span>
                          📍
                        </span>

                        <p className="text-sm text-gray-700 line-clamp-2">
                          {
                            delivery.customer_address
                          }
                        </p>

                      </div>

                    ) : (

                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">

                        <p className="text-sm text-red-600 font-medium">
                          ⚠ Address missing
                        </p>

                      </div>

                    )}

                  </div>

                  {/* RIDER */}

                  <div className="border-t border-gray-100 pt-4">

                    <p className="text-xs text-gray-500 mb-2">
                      Assigned Rider
                    </p>

                    {delivery.rider_name ? (

                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                            🚴
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {
                                delivery.rider_name
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              {
                                delivery.rider_phone
                              }
                            </p>

                          </div>

                        </div>

                        <span className="text-green-600 text-xs font-semibold">
                          Assigned
                        </span>

                      </div>

                    ) : (

                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">

                        <p className="text-sm text-orange-700 font-medium">
                          ⚠ Rider not assigned
                        </p>

                      </div>

                    )}

                  </div>

                  {/* ACTION BUTTON */}

                  <button
                    onClick={() =>
                      openAssignModal(
                        delivery
                      )
                    }
                    className={`w-full mt-4 py-2.5 rounded-xl font-semibold transition ${
                      delivery.rider_id
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >

                    {delivery.rider_id
                      ? "↔ Change Rider"
                      : "＋ Assign Rider"}

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* ======================================================
          ASSIGN RIDER MODAL
      ====================================================== */}

      {showModal &&
        selectedDelivery && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeAssignModal}
            />

            {/* MODAL */}

            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

              {/* MODAL HEADER */}

              <div className="bg-green-600 px-6 py-5 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-green-100 text-sm">
                      Delivery #
                      {
                        selectedDelivery.delivery_id
                      }
                    </p>

                    <h2 className="text-2xl font-bold">
                      Assign Rider
                    </h2>

                  </div>

                  <button
                    onClick={
                      closeAssignModal
                    }
                    className="text-white text-3xl hover:text-green-100"
                  >
                    ×
                  </button>

                </div>

              </div>

              {/* MODAL BODY */}

              <div className="p-6">

                {/* CUSTOMER INFO */}

                <div className="bg-gray-50 rounded-xl p-4 mb-5">

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-gray-500">
                        Customer
                      </p>

                      <p className="font-semibold text-gray-800">
                        {
                          selectedDelivery.customer_name ||
                          "-"
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="font-semibold text-gray-800">
                        {
                          selectedDelivery.customer_phone ||
                          "-"
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Plan
                      </p>

                      <p className="font-semibold text-green-700">
                        {
                          selectedDelivery.plan ||
                          "-"
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Date
                      </p>

                      <p className="font-semibold text-gray-800">
                        {formatDate(
                          selectedDelivery.delivery_date
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="text-xs text-gray-500">
                      Address
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      📍{" "}
                      {
                        selectedDelivery.customer_address ||
                        "Address missing"
                      }
                    </p>

                  </div>

                </div>

                {/* CURRENT RIDER */}

                {selectedDelivery.rider_name && (

                  <div className="mb-5">

                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Current Rider
                    </p>

                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">

                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                        🚴
                      </div>

                      <div>

                        <p className="font-semibold">
                          {
                            selectedDelivery.rider_name
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          {
                            selectedDelivery.rider_phone
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* RIDER SELECT */}

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Rider
                </label>

                <select
                  value={selectedRider}
                  onChange={(e) =>
                    setSelectedRider(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >

                  <option value="">
                    Select a rider
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

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={
                      closeAssignModal
                    }
                    disabled={!!assigningId}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={assignRider}
                    disabled={
                      !!assigningId ||
                      !selectedRider
                    }
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-400"
                  >

                    {assigningId
                      ? "Assigning..."
                      : selectedDelivery.rider_id
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