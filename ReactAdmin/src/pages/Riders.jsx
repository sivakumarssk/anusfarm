import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Riders() {

  const [riders, setRiders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingRider, setEditingRider] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle_type: "",
    vehicle_number: ""
  });

  // ============================================================
  // LOAD RIDERS
  // ============================================================

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/admin/riders`
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
        "LOAD RIDERS ERROR:",
        error.response?.data ||
        error.message
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ============================================================
  // OPEN ADD FORM
  // ============================================================

  const openAddForm = () => {

    setEditingRider(null);

    setForm({
      name: "",
      phone: "",
      vehicle_type: "",
      vehicle_number: ""
    });

    setShowForm(true);
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const openEditForm = (rider) => {

    setEditingRider(rider);

    setForm({
      name: rider.name || "",
      phone: rider.phone || "",
      vehicle_type: rider.vehicle_type || "",
      vehicle_number: rider.vehicle_number || ""
    });

    setShowForm(true);
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const closeForm = () => {

    setShowForm(false);

    setEditingRider(null);

  };

  // ============================================================
  // SAVE RIDER
  // ============================================================

  const saveRider = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {

      alert("Please enter rider name");
      return;

    }

    if (!form.phone.trim()) {

      alert("Please enter rider phone");
      return;

    }

    try {

      if (editingRider) {

        // UPDATE

        const res = await axios.put(
          `${API_URL}/api/admin/riders/${editingRider.id}`,
          form
        );

        if (res.data.success) {

          alert(
            "Rider updated successfully"
          );

        }

      } else {

        // ADD

        const res = await axios.post(
          `${API_URL}/api/admin/riders`,
          form
        );

        if (res.data.success) {

          alert(
            "Rider added successfully"
          );

        }

      }

      closeForm();

      await loadRiders();

    } catch (error) {

      console.log(
        "SAVE RIDER ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to save rider"
      );

    }
  };

  // ============================================================
  // TOGGLE RIDER
  // ============================================================

  const toggleRider = async (rider) => {

    const newStatus =
      !rider.is_active;

    const message = newStatus
      ? "Activate this rider?"
      : "Deactivate this rider?";

    if (!window.confirm(message)) {
      return;
    }

    try {

      const res = await axios.put(
        `${API_URL}/api/admin/riders/${rider.id}/status`,
        {
          is_active: newStatus
        }
      );

      if (res.data.success) {

        await loadRiders();

      }

    } catch (error) {

      console.log(
        "TOGGLE RIDER ERROR:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to update rider"
      );

    }
  };

  return (

    <div className="p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Riders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage delivery riders
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={loadRiders}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Refresh
          </button>

          <button
            onClick={openAddForm}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            + Add Rider
          </button>

        </div>

      </div>

      {/* ======================================================
          RIDER CARDS
      ====================================================== */}

      {loading ? (

        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          Loading riders...
        </div>

      ) : riders.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <p className="text-gray-500 mb-4">
            No riders found.
          </p>

          <button
            onClick={openAddForm}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            + Add First Rider
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {riders.map((rider) => (

            <div
              key={rider.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                    🚚
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-gray-800">
                      {rider.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Rider #{rider.id}
                    </p>

                  </div>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rider.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {rider.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mt-6 space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Phone
                  </span>

                  <span className="font-medium text-gray-800">
                    {rider.phone || "-"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Vehicle
                  </span>

                  <span className="font-medium text-gray-800">
                    {rider.vehicle_type || "-"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Vehicle No.
                  </span>

                  <span className="font-medium text-gray-800">
                    {rider.vehicle_number || "-"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`font-semibold ${
                      rider.status === "Online"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {rider.status || "Offline"}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    openEditForm(rider)
                  }
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    toggleRider(rider)
                  }
                  className={`flex-1 py-2 rounded-lg font-medium ${
                    rider.is_active
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {rider.is_active
                    ? "Deactivate"
                    : "Activate"}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ======================================================
          ADD / EDIT RIDER MODAL
      ====================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={closeForm}
          />

          {/* MODAL */}

          <div className="relative flex items-center justify-center min-h-screen p-4">

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">

                    {editingRider
                      ? "Edit Rider"
                      : "Add New Rider"}

                  </h2>

                  <p className="text-sm text-gray-500 mt-1">

                    {editingRider
                      ? "Update rider details"
                      : "Enter the rider details"}

                  </p>

                </div>

                <button
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-800 text-3xl"
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={saveRider}
                className="space-y-4"
              >

                {/* NAME */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Rider Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter rider name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    maxLength="10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* VEHICLE TYPE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Type
                  </label>

                  <select
                    name="vehicle_type"
                    value={form.vehicle_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >

                    <option value="">
                      Select Vehicle
                    </option>

                    <option value="Bike">
                      Bike
                    </option>

                    <option value="Scooter">
                      Scooter
                    </option>

                    <option value="Auto">
                      Auto
                    </option>

                    <option value="Van">
                      Van
                    </option>

                    <option value="Truck">
                      Truck
                    </option>

                  </select>

                </div>

                {/* VEHICLE NUMBER */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Number
                  </label>

                  <input
                    type="text"
                    name="vehicle_number"
                    value={form.vehicle_number}
                    onChange={handleChange}
                    placeholder="Example: TS09AB1234"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 pt-4">

                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                  >

                    {editingRider
                      ? "Update Rider"
                      : "Add Rider"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
