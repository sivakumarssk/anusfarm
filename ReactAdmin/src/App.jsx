import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";


import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Subscriptions from "./pages/Subscriptions";
import Users from "./pages/Users";



export default function App(){

return(

<BrowserRouter>

<Routes>


<Route element={<AdminLayout/>}>


<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/products" element={<Products/>}/>

<Route path="/products/add" element={<AddProduct/>}/>

<Route path="/products/edit/:id" element={<EditProduct/>}/>

<Route path="/orders" element={<Orders/>}/>

<Route path="/subscriptions" element={<Subscriptions/>}/>

<Route path="/users" element={<Users/>}/>




</Route>


</Routes>

</BrowserRouter>

)

}