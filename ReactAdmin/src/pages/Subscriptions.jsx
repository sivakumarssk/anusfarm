import { useEffect, useState } from "react";
import axios from "axios";


export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/subscriptions"
      );
      setSubscriptions(res.data.subscriptions || []);
    } catch (error) {
      console.log("Subscription API Error:", error);
    }
  };
  // Status background colors

  const getStatusStyle = (status) => {
    switch(status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Delivered":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Paused":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }

  };

  // Status icons

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return "⏳";
      case "Active":
        return "✅";
      case "Delivered":
        return "🚚";
      case "Cancelled":
        return "❌";
      case "Paused":
        return "⏸️";
      default:
        return "";
    }

  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6"> Subscribers</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">
                Phone
              </th>
              <th className="p-4 text-left">
                Plan
              </th>
              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
          {
            subscriptions.map((sub)=>(
              <tr key={sub.id}className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{sub.name} </td>
                <td className="p-4 text-gray-600"> {sub.phone}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                    {sub.plan}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold   ${getStatusStyle(sub.status)}`}>{getStatusIcon(sub.status)}{" "}{sub.status} </span>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}