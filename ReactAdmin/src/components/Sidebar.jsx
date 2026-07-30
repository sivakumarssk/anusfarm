import { Link } from "react-router-dom";

export default function Sidebar(){

return(
<div className="w-100 h-screen bg-gray-100 p-6 flex flex-col">

<h2 className="text-3xl font-bold mb-10">AnusFarm</h2>

<Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/dashboard">🏠 Dashboard</Link>

<Link className="mb-6 text-xl font-semibold hover:text-green-600" to="/products">📦 Products</Link>

<Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/orders">🛒 Orders</Link>

<Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/subscriptions">🔄 Subscriptions</Link>

<Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/users">👥 Users</Link>

</div>
)
}