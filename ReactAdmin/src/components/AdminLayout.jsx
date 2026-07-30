import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout(){

return(

<div className="flex h-screen overflow-hidden">

  <Sidebar/>

  <div className="flex-1 flex flex-col">

    <Navbar/>

    <div className="flex-1 overflow-auto p-6 bg-gray-100">
      <Outlet/>
    </div>

  </div>

</div>

)

}