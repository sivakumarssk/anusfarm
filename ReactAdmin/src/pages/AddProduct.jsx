import { useState } from "react";
import axios from "axios";


export default function AddProduct(){

const [name,setName]=useState("");
const [price,setPrice]=useState("");
const [description,setDescription]=useState("");
const [category_id,setCategoryId]=useState("1");
const [stock,setStock]=useState("");
const [image,setImage]=useState(null);
const [showStock,setShowStock]=useState(false);

const pickImage=(e)=>{
 const file=e.target.files[0];
 if(file){
   setImage(file);
 }
};
const addProduct=async()=>{
try{
const formData=new FormData();
formData.append("name",name);
formData.append("price",price);
formData.append("category_id",category_id);
formData.append("stock",stock);
formData.append("description",description);
if(image){
 formData.append("image",image);
}
const response=await axios.post("http://192.168.0.112:5000/api/products",formData,{
headers:{
"Content-Type":"multipart/form-data"
}
}
);
console.log(response.data);
if(response.data.success){
alert("Product Added Successfully");
setName("");
setPrice("");
setCategoryId("1");
setStock("");
setDescription("");
setImage(null)
}
}
catch(error){
console.log(error);
alert("Something went wrong");
}
};

return(

<div className="min-h-screen p-8 bg-gray-100">

<div className="bg-white rounded-xl shadow p-8">
<h1 className="text-3xl font-bold text-center mb-8">Add Product</h1>

<input className="w-full border p-3 rounded mb-4"
placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)}/>

<input className="w-full border p-3 rounded mb-4"
placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)}/>

<input className="w-full border p-3 rounded mb-4"
placeholder="Category ID" value={category_id} onChange={(e)=>setCategoryId(e.target.value)}/>

<input className="w-full border p-3 rounded mb-4"
placeholder="Stock" type="number" value={stock} onChange={(e)=>setStock(e.target.value)}/>

<textarea className="w-full border p-3 rounded mb-4"
placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>

<label className="block bg-gray-200 p-3 rounded cursor-pointer text-center mb-4">Select Image
<input type="file" className="hidden" onChange={pickImage}/>
</label>
{image &&
<img src={URL.createObjectURL(image)}
className="w-32 h-32 rounded object-cover mb-4"/>}

<button onClick={addProduct}
className="w-full bg-green-600 text-white p-3 rounded font-bold">Add Product</button>

<button onClick={()=>setShowStock(!showStock)}
className="w-full bg-blue-500 text-white p-3 rounded mt-4 font-bold">View Stock</button>

{showStock &&
<div className="mt-5 bg-gray-100 rounded p-5">
<h2 className="text-xl font-bold mb-3">📦 Stock Details</h2>
<p>🥛 Milk Packet - 100 Left</p>
<p>🥣 Chicken - 20 Left</p>
<p>🧈 Ghee - 20 Left</p>
</div>
}
</div>
</div>
)
}