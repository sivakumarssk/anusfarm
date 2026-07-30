import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users"); // Change if your backend URL is different
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
  <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="py-4 px-6 text-left">ID</th>
          <th className="py-4 px-6 text-left">Name</th>
          <th className="py-4 px-6 text-left">Phone</th>
          <th className="py-4 px-6 text-left">Subscription</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b hover:bg-gray-50 transition duration-200"
          >
            <td className="py-4 px-6">{user.id}</td>

            <td className="py-4 px-6 font-semibold text-gray-800">
              {user.name}
            </td>

            <td className="py-4 px-6 text-gray-600">
              {user.phone}
            </td>

            <td className="py-4 px-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  user.subscription === "Subscribed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.subscription}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}