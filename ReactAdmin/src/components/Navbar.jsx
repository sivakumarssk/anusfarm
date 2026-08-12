import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");};

  // Get Notifications
  useEffect(() => {

  getNotifications();
  getNotificationCount();

}, []);
  const getNotifications = async () => {
    try {
      const response = await axios.get( `${API_URL}/api/admin/notifications`);
  

      console.log("Notification Response:", response.data);
      // safe data handling
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.log("Notification Error:", error);
      setNotifications([]);
    }
  };
  const getNotificationCount = async () => {

  try {

    const response = await axios.get(
      `${API_URL}/api/admin/notifications/count`
    );


console.log("COUNT RESPONSE:",response.data);

setNotificationCount(response.data.count);
    setNotificationCount(response.data.count);

  } catch(error) {

    console.log("Count Error:", error);

  }

};
const markNotificationsRead = async()=>{

try{

await axios.put(
`${API_URL}/api/admin/notifications/read`
);

setNotificationCount(0);

}
catch(error){

console.log("Mark read error",error);

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
      <button onClick={async()=>{
const newState = !showNotification;
setShowNotification(newState);
if(newState){
  await markNotificationsRead();
  getNotificationCount();
}
}}    
 className="text-2xl hover:scale-110 relative">🔔 {
 notificationCount > 0 && (
   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
     {notificationCount}
   </span>
 )
}
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
                        { item.type.toLowerCase().includes("order") && "🛒 " }
                          <b>{item.type.toUpperCase()}</b>
<br/>

<span className="text-sm text-gray-500">
 {item.message}
</span>

<br/>

<span className="text-xs text-gray-400">
 {new Date(item.created_at).toLocaleString()}
</span>
                      </div>
                    ))
                  )}
              </div>
            )}
        </div>
        
        <button onClick={logout}  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"> 🚪 Logout</button>
      </div>
    </div>
  );
}