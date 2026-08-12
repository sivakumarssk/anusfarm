import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockQty, setStockQty] = useState("");

  const location = useLocation();
  const API = `${API_URL}/api`;
  const fetchProducts = async () => {
    try {
      const response = await axios.get( `${API}/products`);
      if(response.data.success){
        setProducts(response.data.products);
      }
    } catch(error){
  console.log(error);
    }
  };
  useEffect(()=>{
    fetchProducts();
  },[]);

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  },[location.search]);

  const deleteProduct = async(id)=>{
    try{
      const response = await axios.delete( `${API}/products/${id}` );
      if(response.data.success){
        alert("Product Deleted Successfully");
        fetchProducts();
      }
    }
    catch(error){
      console.log(error);}
  };

  const toggleProductStatus = async(id,status)=>{
    try{
      const newStatus =status === "Active" ?"Inactive":"Active";
      const response = await axios.put(`${API}/products/${id}/status`,
  { status: newStatus }
);
      if(response.data.success){
        fetchProducts();
      }
    }
    catch(error){
      console.log(error);}
  };

  const filteredProducts = products.filter((product)=>
    product.name .toLowerCase().includes(search.toLowerCase()));

 return (
<div className="p-6">
<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Products</h1>
<Link to="/products/add">
<button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">➕ Add Product</button>
</Link>
</div>
<div className="bg-white rounded-xl shadow overflow-hidden">
<table className="w-full">
<thead className="bg-green-600 text-white">
<tr>
<th className="p-4">Image</th>
<th className="p-4">Product</th>
<th className="p-4">Category</th>
<th className="p-4">Price</th>
<th className="p-4">Stock</th>
<th className="p-4">Status</th>
<th className="p-4">Actions</th>
</tr>
</thead>
<tbody>
 {
filteredProducts.length > 0 ?
filteredProducts.map((product)=>(
<tr key={product.id} className="border-b hover:bg-gray-50 text-center">
<td className="p-3">
<img src={product.image} alt={product.name}
className="w-16 h-16 object-cover rounded mx-auto"/>
</td>
<td className="font-semibold">{product.name}</td>
<td>
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{product.category}</span>
</td>
<td className="font-semibold">₹{product.price}</td>
<td>
<button
onClick={()=>{
setSelectedStock(product);
setStockQty(product.stock);
}}
className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
📦 Stock
</button>
</td>
<td>
<button onClick={()=>toggleProductStatus( product.id, product.status)}
className={`px-5 py-2 rounded-full text-white font-semibold${product.status==="Active"?
"bg-green-600 hover:bg-green-700":"bg-red-500 hover:bg-red-500"}`}>
{
product.status==="Active"?"🟢 ON":"🔴 OFF"}
</button>
</td>
<td>
<Link to={`/products/edit/${product.id}`}>
<button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded mr-2">✏️ Edit</button>
</Link>
<button onClick={()=>deleteProduct(product.id)}
className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">🗑 Delete</button>
</td>
</tr>
)):(
<tr>
<td colSpan="7" className="py-10 text-center text-gray-500">🔍 No Products Found</td>
</tr>
)}
</tbody>
</table>
</div>
{
  selectedStock && (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px]">

        <h2 className="text-2xl font-bold text-center mb-6"> 📦 {selectedStock.name}</h2>
         
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-semibold mb-2">Total Stock</p>
            <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none" />
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="font-semibold">Subscription Stock</p>
            <p className="text-xl font-bold"> {selectedStock.subscription_stock || 0}</p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="font-semibold">Available Stock</p>
            <p className="text-xl font-bold">
              {Number(stockQty) -
                Number(selectedStock.subscription_stock || 0)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            onClick={async () => {
              try {
                const res = await axios.put(
                  `${API}/products/${selectedStock.id}/stock`,
                  {
                    stock: stockQty,
                  }
                );
                if (res.data.success) {
                  alert("Stock Updated Successfully");
                  setSelectedStock(null);
                  fetchProducts();
                }
              } catch (err) {
                console.log(err);
              }
            }}
          > Update</button>

          <button onClick={() => setSelectedStock(null)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  )
}
</div>
);
}






















