// import { Link } from "react-router-dom";

// export default function Sidebar(){

// return(
// <div className="w-60 h-screen bg-gray-100 p-6 flex flex-col">

// <h2 className="text-3xl font-bold mb-10">AnusFarm</h2>

// <Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/dashboard">🏠 Dashboard</Link>

// <Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/users">👥 Users</Link>

// <Link className="mb-6 text-xl font-semibold hover:text-green-600" to="/products">📦 Products</Link>

// <Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/orders">🛒 Orders</Link>

// <Link className="mb-6 text-xl font-semibold hover:text-green-600"to="/subscriptions">🔄 Subscriptions</Link>

//  <Link  className="mb-6 text-xl font-semibold hover:text-green-600" to="/riders"  >  🚚 Riders </Link>

// </div>
// )
// }

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-full md:w-40 md:min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col md:flex-col gap-3 md:gap-0">

      {/* Logo */}
      <h2 className="text-xl md:text-xl font-bold mb-3 md:mb-10 whitespace-nowrap">
        {/* AnusFarm */}
      </h2>

      {/* Navigation Links */}
      <nav className="flex flex-row md:flex-col gap-3 md:gap-0 overflow-x-auto md:overflow-visible">

        <Link
          className="md:mb-6 text-base md:text-xl font-semibold hover:text-green-600 whitespace-nowrap mt-10 "
          to="/dashboard"
        >
          🏠 Dashboard
        </Link>

        <Link
          className="md:mb-6 text-base md:text-xl font-semibold hover:text-green-600 whitespace-nowrap"
          to="/users"
        >
          👥 Users
        </Link>

        <Link
          className="md:mb-6 text-base md:text-xl font-semibold hover:text-green-600 whitespace-nowrap"
          to="/products"
        >
          📦 Products
        </Link>

        <Link
          className="md:mb-6 text-base md:text-xl font-semibold hover:text-green-600 whitespace-nowrap"
          to="/orders"
        >
          🛒 Orders
        </Link>

        <Link
          className="md:mb-6 text-base md:text-lg font-semibold hover:text-green-600 whitespace-nowrap"
          to="/subscriptions"
        >
          🔄 Subscription
        </Link>

        <Link
          className="md:mb-6 text-base md:text-xl font-semibold hover:text-green-600 whitespace-nowrap"
          to="/riders"
        >
          🚚 Riders
        </Link>

      </nav>
    </div>
  );
}

