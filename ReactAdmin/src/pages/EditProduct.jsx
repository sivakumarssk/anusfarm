import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct(){
const {id}=useParams();
const navigate = useNavigate();
const [name,setName]=useState("");
const [price,setPrice]=useState("");
const [category_id,setCategoryId]=useState("");
const [stock,setStock]=useState("");
const [description,setDescription]=useState("");
const [image,setImage]=useState(null);
const [oldImage,setOldImage]=useState("");

// GET PRODUCT
useEffect(()=>{
getProduct();
},[]);

const getProduct = async()=>{
try{
const response = await axios.get(
`http://192.168.0.112:5000/api/products/${id}`
);
const product=response.data.product;
setName(product.name);
setPrice(product.price);
setCategoryId(product.category_id);
setStock(product.stock);
setDescription(product.description);

// ⭐ IMAGE FIX HERE
if(product.image){
if(product.image.startsWith("http")){
setOldImage(product.image);
}
else{
setOldImage(
`http://192.168.0.112:5000/uploads/${product.image}`
);
}
}
}
catch(error){
console.log(
"GET PRODUCT ERROR:",
error
);
}
};

// UPDATE PRODUCT
const updateProduct = async()=>{
try{
const formData=new FormData();
formData.append("name",name);
formData.append("price",price);
formData.append("category_id",category_id );
formData.append("stock",stock);
formData.append("description",description);
// new image
if(image){
formData.append("image",image);
}

const response = await axios.put(
`http://192.168.0.112:5000/api/products/${id}`,
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);
if(response.data.success){
alert(
"Product Updated Successfully"
);
navigate("/products");
}
}
catch(error){
console.log("UPDATE ERROR:",error);
alert("Update Failed");
}
};
return(
<div className="p-8 bg-gray-100 min-h-screen">
<div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
<h1 className="text-3xl font-bold mb-8 text-center">
Edit Product
</h1>
<input
className="w-full border p-3 rounded mb-4"
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>
<input
className="w-full border p-3 rounded mb-4"
placeholder="Price"
type="number"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>
<input
className="w-full border p-3 rounded mb-4"
placeholder="Category ID"
value={category_id}
onChange={(e)=>setCategoryId(e.target.value)}
/>
<input
className="w-full border p-3 rounded mb-4"
placeholder="Stock"
type="number"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>
<textarea
className="w-full border p-3 rounded mb-4"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>
{
oldImage &&
<div className="mb-5">
<p className="font-bold mb-2">
Current Image
</p>

<img
src={oldImage}
alt="product"
className="w-32 h-32 object-cover rounded"
/>
</div>
}
<input
type="file"
className="mb-5"
onChange={(e)=>setImage(e.target.files[0])}
/>
<div className="flex gap-4 mt-4">

  <button onClick={updateProduct}
    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition">✅ Update Product</button>
    
  <button type="button" onClick={() => navigate("/products")}
    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-bold transition"> ❌ Cancel</button>
</div>
</div>
</div>
)
}