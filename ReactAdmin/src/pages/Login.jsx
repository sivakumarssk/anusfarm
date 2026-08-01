import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";


export default function EditProduct(){

const {id}=useParams();
const [name,setName]=useState("");
const [price,setPrice]=useState("");
const [category_id,setCategoryId]=useState("");
const [stock,setStock]=useState("");
const [description,setDescription]=useState("");
const [image,setImage]=useState(null);


useEffect(()=>{
getProduct();
},[]);

const getProduct=async()=>{
try{
const response=await axios.get(
`http://192.168.0.112:5000/api/products/${id}`
);


const product=response.data.product;
setName(product.name);
setPrice(product.price);
setCategoryId(product.category_id);
setStock(product.stock);
setDescription(product.description);

}
catch(error){console.log(error);}
};
const updateProduct=async()=>{
try{
const formData=new FormData();
formData.append("name",name);
formData.append("price",price);
formData.append("category_id",category_id);
formData.append("stock",stock);
formData.append("description",description);

if(image){
formData.append(
"image",
image
);

}
const response=await axios.put(
`http://192.168.0.112:5000/api/products/${id}`,formData,{
headers:{
"Content-Type":"multipart/form-data"
}
}
);
if(response.data.success){
alert("Product Updated Successfully");
}
}
catch(error){
console.log(error);
alert("Update Failed");
}
};
return(

<AdminLayout>

<div className="p-8 bg-gray-100 min-h-screen">
<div className="bg-white p-8 rounded-xl shadow">
<h1 className="text-3xl font-bold text-center mb-8">Edit Product</h1>

<input className="w-full border p-3 rounded mb-4"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Product Name"/>

<input className="w-full border p-3 rounded mb-4"
value={price}
onChange={(e)=>setPrice(e.target.value)}
placeholder="Price"/>

<input className="w-full border p-3 rounded mb-4"
value={category_id}
onChange={(e)=>setCategoryId(e.target.value)}
placeholder="Category"/>

<input className="w-full border p-3 rounded mb-4"
value={stock}
onChange={(e)=>setStock(e.target.value)}
placeholder="Stock"/>



<textarea className="w-full border p-3 rounded mb-4"
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Description"/>

<input type="file" className="mb-5" onChange={(e)=>setImage(e.target.files[0])}/>

<button onClick={updateProduct} className="w-full bg-green-600 text-white p-3 rounded">Update Product</button>
</div>
</div>
</AdminLayout>
)

}