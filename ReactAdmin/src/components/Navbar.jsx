// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Navbar() {
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };
//   return (
//     <div className="h-16 bg-white shadow flex items-center justify-between px-6">
//       {/* Left */}
//       <h2 className="text-2xl font-bold text-green-700">
//         🌿 AnusFarm Admin
//       </h2>
//       {/* Center */}
//       <input type="text"placeholder="🔍 Search Products..." value={search}
//         onChange={(e) => {const value = e.target.value;
//   setSearch(value);navigate(`/products?search=${encodeURIComponent(value)}`);}}
// className="border border-gray-300 rounded-lg px-4 py-2 w-80  ml-[340px] focus:outline-none focus:border-green-600 "/>
//       {/* Right */}
//       <div className="flex items-center gap-4">
//         {/* Notification */}
//         <button className="text-2xl hover:scale-110">🔔</button>
//         {/* Add Product */}
//         <Link to="/products/add">
//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"> ➕ Add Product</button>
//         </Link>
//         {/* Logout */}
//         <button onClick={logout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">🚪 Logout</button>
//       </div>
//     </div>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");};

  // Get Notifications
  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      const response = await axios.get( "http://192.168.0.112:5000/api/admin/notifications");
      console.log("Notification Response:", response.data);
      // safe data handling
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.log("Notification Error:", error);
      setNotifications([]);
    }
  };
  return (
<div className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Left */}
      <h2 className="text-2xl font-bold text-green-700">🌿 AnusFarm Admin</h2>
      {/* Search */}
      <input type="text"placeholder="🔍 Search Products..."value={search}
 onChange={(e)=>{const value = e.target.value;setSearch(value);
  navigate( `/products?search=${encodeURIComponent(value)}`);}}
 className="border border-gray-300 rounded-lg px-4 py-2 w-80 ml-[340px] focus:outline-none focus:border-green-600" />
     
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative">
          <button  onClick={()=>setShowNotification(!showNotification)}
           className="text-2xl hover:scale-110 relative">🔔
            {
              notifications?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
{notifications.length} </span>
 )}
          </button>
          {
            showNotification && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
                <h3 className="font-bold text-lg mb-3">Notifications </h3>
                {
                  notifications?.length === 0 ? (
                    <p className="text-gray-500">No Notifications </p>
                  ) : (
                    notifications?.map((item,index)=>(
                      <div  key={index} className="border-b py-2">
                        { item.type==="user" && "👤 "}
                          {item.type==="stock" && "⚠️ "}
                         { item.type==="order" && "🛒 "}
                           <b>{item.title}</b><br/>
                        <span className="text-sm text-gray-500"> {item.message}</span>
                      </div>
                    ))
                  )}
              </div>
            )}
        </div>
        {/* Add Product */}

        <Link to="/products/add">
          <button   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">  ➕ Add Product</button>
        </Link>
        {/* Logout */}
        <button onClick={logout}  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"> 🚪 Logout</button>
      </div>
    </div>
  );
}