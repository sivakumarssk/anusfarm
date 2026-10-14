
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category_id, setCategoryId] = useState("1");

  // Inventory
  const [stock, setStock] = useState("");
  const [subscriptionStock, setSubscriptionStock] = useState("");
  const [instantStock, setInstantStock] = useState("");

  const [image, setImage] = useState(null);
  const [showStock, setShowStock] = useState(false);
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");

const showCustomAlert = (title, message) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
};
  const pickImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };

  const addProduct = async () => {
    try {
      // Convert values to numbers
      const total = Number(stock);
      const subscription = Number(subscriptionStock);
      const instant = Number(instantStock);

      // Validate total stock
      if (!Number.isInteger(total) || total < 0) {
        alert("Please enter a valid Total Quantity");
        return;
      }

      // Validate subscription stock
      if (!Number.isInteger(subscription) || subscription < 0) {
        alert("Please enter a valid Subscription Quantity");
        return;
      }

      // Validate instant stock
      if (!Number.isInteger(instant) || instant < 0) {
        alert("Please enter a valid Instant Quantity");
        return;
      }

      // IMPORTANT:
      // Subscription + Instant must equal Total
      if (subscription + instant !== total) {
        alert(
          "Subscription Quantity + Instant Quantity must equal Total Quantity"
        );
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category_id", category_id);

      // Inventory
      formData.append("stock", total);
      formData.append("subscription_stock", subscription);
      formData.append("instant_stock", instant);

      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${API_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        alert("Product Added Successfully");

        // Clear form
        setName("");
        setPrice("");
        setCategoryId("1");
        setStock("");
        setSubscriptionStock("");
        setInstantStock("");
        setDescription("");
        setImage(null);
      } else {
        alert(response.data.message || "Product adding failed");
      }
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const totalEntered = Number(stock || 0);
  const subscriptionEntered = Number(subscriptionStock || 0);
  const instantEntered = Number(instantStock || 0);

  const calculatedTotal =
    subscriptionEntered + instantEntered;

  const stockValid =
    calculatedTotal === totalEntered;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-5 shadow sm:p-8">

        <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          Add Product
        </h1>

        {/* Product Name */}
        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Price */}
        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Price"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Category */}
        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Category ID"
          type="number"
          min="1"
          value={category_id}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        {/* ================= INVENTORY ================= */}

        <div className="mb-6 rounded-lg border bg-gray-50 p-5">

          <h2 className="mb-4 text-xl font-bold">
            📦 Inventory
          </h2>

          {/* Total Quantity */}
          <label className="mb-2 block font-semibold">
            Total Quantity
          </label>

          <input
            className="mb-4 w-full rounded border p-3"
            placeholder="Example: 10"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          {/* Subscription Quantity */}
          <label className="mb-2 block font-semibold">
            Subscription Quantity
          </label>

          <input
            className="mb-4 w-full rounded border p-3"
            placeholder="Example: 8"
            type="number"
            min="0"
            value={subscriptionStock}
            onChange={(e) =>
              setSubscriptionStock(e.target.value)
            }
          />

          {/* Instant Quantity */}
          <label className="mb-2 block font-semibold">
            Instant Quantity
          </label>

          <input
            className="mb-4 w-full rounded border p-3"
            placeholder="Example: 2"
            type="number"
            min="0"
            value={instantStock}
            onChange={(e) =>
              setInstantStock(e.target.value)
            }
          />

          {/* Inventory calculation */}
          <div
            className={`rounded-lg p-4 ${
              stockValid
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <p className="font-semibold">
              Total Quantity: {totalEntered}
            </p>

            <p className="font-semibold">
              Subscription: {subscriptionEntered}
            </p>

            <p className="font-semibold">
              Instant: {instantEntered}
            </p>

            <p className="mt-2 font-bold">
              Subscription + Instant = {calculatedTotal}
            </p>

            {stockValid ? (
              <p className="mt-2 font-bold text-green-700">
                ✅ Inventory is valid
              </p>
            ) : (
              <p className="mt-2 font-bold text-red-700">
                ❌ Subscription + Instant must equal Total
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <textarea
          className="mb-4 w-full rounded border p-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {/* Image */}
        <label className="mb-4 block cursor-pointer rounded bg-gray-200 p-3 text-center">
          Select Image

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickImage}
          />
        </label>

        {/* Image Preview */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Product Preview"
            className="mb-4 h-32 w-32 rounded object-cover"
          />
        )}

        {/* Add Product */}
        <button
          onClick={addProduct}
          className="w-full rounded bg-green-600 p-3 font-bold text-white hover:bg-green-700"
        >
          Add Product
        </button>

        {/* View Stock */}
        <button
          onClick={() => setShowStock(!showStock)}
          className="mt-4 w-full rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-600"
        >
          {showStock ? "Hide Stock" : "View Stock"}
        </button>

        {/* Stock Details */}
        {showStock && (
          <div className="mt-5 rounded bg-gray-100 p-5">

            <h2 className="mb-3 text-xl font-bold">
              📦 Stock Details
            </h2>

            <p className="mb-2">
              Total Stock:{" "}
              <strong>{stock || 0}</strong>
            </p>

            <p className="mb-2">
              Subscription Stock:{" "}
              <strong>{subscriptionStock || 0}</strong>
            </p>

            <p>
              Instant Stock:{" "}
              <strong>{instantStock || 0}</strong>
            </p>

          </div>
        )}
      </div>
    </div>
  );
}