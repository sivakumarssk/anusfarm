import React,{useEffect,useState} from "react";
import axios from "axios";


export default function Orders(){
const [data,setData]=useState({summary:{},orders:[]});
useEffect(()=>{
 fetchOrders();
},[]);


const fetchOrders=async()=>{
 try{
 const res=await axios.get("http://localhost:5000/api/orders");
 setData(res.data);
 }
 catch(error){
     console.log(error);}
}
return (

<div className="p-6 bg-gray-50 min-h-screen">
<h1 className="text-3xl font-bold mb-6 text-gray-800">Orders</h1>
{/* SUMMARY CARDS */}
<div className="grid grid-cols-4 gap-6 mb-8">
<div className="bg-white border-l-4 border-blue-500 shadow-sm rounded-xl p-5">
<h3 className="text-gray-500 font-medium">Total Orders</h3>
<p className="text-3xl font-bold text-blue-600 mt-2">{data.summary.total || 0}</p>
</div>

<div className="bg-white border-l-4 border-green-500 shadow-sm rounded-xl p-5">
<h3 className="text-gray-500 font-medium">Delivered</h3>
<p className="text-3xl font-bold text-green-600 mt-2">{data.summary.delivered || 0}</p>
</div>

<div className="bg-white border-l-4 border-yellow-500 shadow-sm rounded-xl p-5">
<h3 className="text-gray-500 font-medium">Pending</h3>
<p className="text-3xl font-bold text-yellow-600 mt-2">{data.summary.pending || 0}</p>
</div>

<div className="bg-white border-l-4 border-red-500 shadow-sm rounded-xl p-5">
<h3 className="text-gray-500 font-medium">Cancelled</h3>
<p className="text-3xl font-bold text-red-600 mt-2">{data.summary.cancelled || 0}</p>
</div>
</div>
{/* TABLE */}
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
<table className="w-full">

<thead className="bg-gray-100">
<tr className="text-gray-700 text-left">
<th className="p-4">Order ID</th>
<th>Customer</th>
<th>Product</th>
<th>Price</th>
<th>Address</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{data.orders.map(order=>(
<tr key={order.order_id}className="border-t hover:bg-gray-50 transition">

<td className="p-4 font-semibold text-gray-700">#{order.order_id}</td>
<td className="text-gray-700">{order.customer_name}</td>
<td className="text-gray-700">{order.product_name}</td>
<td className="font-medium text-gray-800">₹{order.price}</td>
<td className="text-gray-600">{order.address}</td>
<td>
<span className={`px-3 py-1 rounded-full text-sm font-medium${order.status==="Delivered"?"bg-green-100 text-green-700"
:order.status==="Pending"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>{order.status}</span>
</td>
</tr>
))
}
</tbody>
</table>
</div>
</div>
)
}