import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategoryId] = useState("");

  // ================= INVENTORY =================
  const [stock, setStock] = useState("");
  const [subscriptionRequired, setSubscriptionRequired] = useState(0);

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================= GET PRODUCT DETAILS =================
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/products/${id}`
        );

        const product =
          response.data.product || response.data;

        if (!product) {
          alert("Product not found");
          navigate("/products");
          return;
        }

        setName(product.name ?? "");
        setPrice(product.price ?? "");
        setCategoryId(product.category_id ?? "");

        // ================= INVENTORY =================
        setStock(product.stock ?? 0);

        // Automatically calculated from active subscriptions
        setSubscriptionRequired(
          Number(product.subscription_required ?? 0)
        );

        setDescription(product.description ?? "");

        if (product.image) {
          setOldImage(
            product.image.startsWith("http")
              ? product.image
              : `${API_URL}/uploads/${product.image}`
          );
        } else {
          setOldImage("");
        }
      } catch (error) {
        console.error(
          "GET PRODUCT ERROR:",
          error
        );

        alert("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id, navigate]);

  // ================= UPDATE PRODUCT =================
  const updateProduct = async (e) => {
    e.preventDefault();

    if (updating) return;

    try {
      setUpdating(true);

      const total = Number(stock);

      // ================= VALIDATION =================
      if (!Number.isInteger(total) || total < 0) {
        alert("Please enter a valid Total Quantity");
        setUpdating(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category_id", category_id);

      // ================= INVENTORY =================
      // Only total stock is saved.
      // Subscription quantity is calculated automatically.
      formData.append("stock", total);

      formData.append(
        "description",
        description
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${API_URL}/api/products/${id}`,
        formData
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert("Product Updated Successfully");
        navigate("/products");
      } else {
        alert(
          response.data.message ||
            "Product update failed"
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ================= INVENTORY CALCULATION =================
  const totalEntered = Number(stock || 0);

  const subscriptionEntered = Number(
    subscriptionRequired || 0
  );

  const instantAvailable = Math.max(
    0,
    totalEntered - subscriptionEntered
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-5 shadow sm:p-8">

        <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          Edit Product
        </h1>

        <form onSubmit={updateProduct}>

          {/* ================= PRODUCT NAME ================= */}
          <input
            type="text"
            className="mb-4 w-full rounded border p-3"
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          {/* ================= PRICE ================= */}
          <input
            type="number"
            min="0"
            className="mb-4 w-full rounded border p-3"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            required
          />

          {/* ================= CATEGORY ================= */}
          <input
            type="number"
            min="1"
            className="mb-4 w-full rounded border p-3"
            placeholder="Category ID"
            value={category_id}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            required
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
              type="number"
              min="0"
              className="mb-4 w-full rounded border p-3"
              placeholder="Example: 100"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              required
            />

            {/* Subscription Required */}
            <div className="mb-4 rounded-lg bg-yellow-100 p-4">
              <p className="font-semibold">
                Subscription Required
              </p>

              <p className="mt-1 text-2xl font-bold">
                {subscriptionEntered}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Automatically calculated from active
                subscriptions
              </p>
            </div>

            {/* Instant Available */}
            <div className="rounded-lg bg-green-100 p-4">
              <p className="font-semibold">
                Instant Available
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {instantAvailable}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Total Stock − Subscription Required
              </p>
            </div>

          </div>

          {/* ================= DESCRIPTION ================= */}
          <textarea
            className="mb-4 w-full rounded border p-3"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
          />

          {/* ================= CURRENT IMAGE ================= */}
          {oldImage && (
            <div className="mb-5">
              <p className="mb-2 font-bold">
                Current Image
              </p>

              <img
                src={oldImage}
                alt="Product"
                className="h-32 w-32 rounded object-cover"
              />
            </div>
          )}

          {/* ================= CHANGE IMAGE ================= */}
          <label className="mb-5 block">
            <span className="mb-2 block font-semibold">
              Change Product Image
            </span>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded border p-3"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] || null
                )
              }
            />
          </label>

          {/* ================= BUTTONS ================= */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">

            <button
              type="submit"
              disabled={updating}
              className="flex-1 rounded-lg bg-green-600 p-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating
                ? "Updating..."
                : "✅ Update Product"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="flex-1 rounded-lg bg-gray-500 p-3 font-bold text-white transition hover:bg-gray-600"
            >
              ❌ Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

