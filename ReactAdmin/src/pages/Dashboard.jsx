import React, { useEffect, useState } from "react";
import axios from "axios";
import {FaUsers,FaBoxOpen,FaShoppingCart,FaClipboardList,FaBell,FaExclamationTriangle,FaTruck,FaTimesCircle,} from "react-icons/fa";
import { API_URL } from "../config/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [summary, setSummary] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchDashboard();

  const interval = setInterval(() => {
    fetchDashboard();
  }, 30000); // every 30 seconds
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
      ] = await Promise.all([
        axios.get(`${API_URL}/api/users`),
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/orders`),
        axios.get(`${API_URL}/api/subscriptions`),
        axios.get(`${API_URL}/api/admin/notifications`),
      ]);

      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setSubscriptions(subscriptionsRes.data.subscriptions || []);
      setNotifications(notificationsRes.data.notifications || []);

      setSummary({
        totalOrders: ordersRes.data.summary.total,
        pending: ordersRes.data.summary.pending,
        delivered: ordersRes.data.summary.delivered,
        cancelled: ordersRes.data.summary.cancelled,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const lowStock = products.filter((p) => p.stock < 20);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-green-700">🌿 AnusFarm Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome Back, Admin 👋</p>
        </div>

        <div className="bg-white shadow rounded-xl px-5 py-3">
          <p className="font-semibold">
            {new Date().toLocaleDateString()}</p>
        </div>

      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">
          <div>
            <p>Total Users</p>
            <h2 className="text-3xl font-bold mt-2">  {users.length}</h2>
          </div>
          <FaUsers size={40} />
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">
          <div>
            <p>Products</p>
            <h2 className="text-3xl font-bold mt-2">
              {products.length}
            </h2>
          </div>
          <FaBoxOpen size={40} />
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">
          <div>
            <p>Orders</p>
            <h2 className="text-3xl font-bold mt-2">
              {summary.totalOrders}
            </h2>
          </div>
          <FaShoppingCart size={40} />
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">
          <div>
            <p>Subscriptions</p>
            <h2 className="text-3xl font-bold mt-2">{subscriptions.length}</h2>
          </div>
          <FaClipboardList size={40} />
        </div>

      </div>

      {/* Status Cards */}

      <div className="grid grid-cols-4 gap-6 mt-6">

        <div className="bg-yellow-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p>Pending</p>
            <h2 className="text-3xl font-bold mt-2">{summary.pending}</h2>
          </div>
          <FaBell size={35} className="text-yellow-600" />
        </div>

        <div className="bg-green-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p>Delivered</p>
            <h2 className="text-3xl font-bold mt-2">{summary.delivered}</h2>
          </div>
          <FaTruck size={35} className="text-green-700" />
        </div>

        <div className="bg-red-100 rounded-xl p-6 flex justify-between items-center">

          <div>
            <p>Cancelled</p>
            <h2 className="text-3xl font-bold mt-2">{summary.cancelled}</h2>
          </div>
          <FaTimesCircle size={35} className="text-red-700" />
        </div>
        <div className="bg-orange-100 rounded-xl p-6 flex justify-between items-center">

          <div>
            <p>Low Stock</p>
            <h2 className="text-3xl font-bold mt-2">{lowStock.length}</h2>
          </div>
          <FaExclamationTriangle size={35} className="text-orange-700"/>
        </div>
      </div>

   
     
      {/* Recent Orders + Latest Users */}


<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

  {/* Recent Orders */}

  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-bold">Recent Orders</h2>
      <span className="text-sm text-gray-500">
        {orders.length} Orders</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">

        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3">  Customer </th>
           <th className="text-left p-3"> Product</th>
            <th className="text-left p-3">Qty</th>
            <th className="text-left p-3"> Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
       orders.slice(0,5).map((order)=>(
              <tr key={order.order_id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.customer_name}</td>
                <td className="p-3">{order.product_name}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm
                    ${ order.status==="Delivered"? "bg-green-500": order.status==="Pending"
                   ? "bg-yellow-500"  : "bg-red-500" }`}>{order.status} </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td  colSpan="4" className="text-center p-6"> No Orders Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Latest Users */}

  <div className="bg-white rounded-xl shadow-lg p-6">

    <div className="flex justify-between items-center mb-5">

      <h2 className="text-xl font-bold">

        Latest Users

      </h2>

      <span className="text-sm text-gray-500">

        {users.length} Users

      </span>

    </div>

    {

      users.length>0 ?

      users.slice(0,5).map((user)=>(

        <div
          key={user.id}
          className="flex justify-between items-center border-b py-4"
        >

          <div>

            <h3 className="font-semibold">

              {user.name}

            </h3>

            <p className="text-gray-500 text-sm">

              {user.phone}

            </p>

          </div>

          <div>

            <span
              className={`px-3 py-1 rounded-full text-sm

              ${
                user.subscription==="Subscribed"

                ? "bg-green-100 text-green-700"

                : "bg-red-100 text-red-700"

              }`}
            >

              {user.subscription}

            </span>

          </div>

        </div>

      ))

      :

      <div className="text-center py-10">

        No Users Available

      </div>

    }

  </div>

</div>

{/* ========= PART 3 STARTS BELOW ========= */}
{/* ===============================
      Low Stock Products
================================ */}

<div className="bg-white rounded-xl shadow-lg p-6 mt-8">

  <div className="flex justify-between items-center mb-5">

    <h2 className="text-xl font-bold">
      Low Stock Products
    </h2>

    <span className="text-sm text-gray-500">
      {lowStock.length} Products
    </span>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="bg-gray-100">

          <th className="text-left p-3">Product</th>
          <th className="text-left p-3">Category</th>
          <th className="text-left p-3">Price</th>
          <th className="text-left p-3">Stock</th>

        </tr>

      </thead>

      <tbody>

        {

          lowStock.length > 0 ?

          lowStock.map((product)=>(

            <tr
              key={product.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-3 font-medium">

                {product.name}

              </td>

              <td className="p-3">

                {product.category}

              </td>

              <td className="p-3">

                ₹ {product.price}

              </td>

              <td className="p-3">

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                  {product.stock}

                </span>

              </td>

            </tr>

          ))

          :

          <tr>

            <td
              colSpan="4"
              className="text-center p-6"
            >

              No Low Stock Products

            </td>

          </tr>
        }
      </tbody>
    </table>
  </div>
</div>
{/* ===============================Notifications================================ */}
<div className="bg-white rounded-xl shadow-lg p-6 mt-8">
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-xl font-bold">Recent Notifications</h2>
    <span className="text-sm text-gray-500">{notifications.length} Notifications</span>
  </div>
  { notifications.length > 0 ?
    notifications.slice(0,5).map((item)=>(
      <div  key={item.id} className="border-b py-4 flex items-start gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <FaBell className="text-green-700"/>
        </div>
        <div>
          <p className="font-medium">{item.message}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(item.created_at).toLocaleString()}</p>
        </div>
      </div>
    )):<div className="text-center py-10 text-gray-500">No Notifications</div>
  }
</div>
{/* Footer */}
<div className="text-center text-gray-500 mt-10">© 2026 AnusFarm Admin Dashboard</div>
</div>

);
}