// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config/api";

// export default function Orders() {
//   const [data, setData] = useState({
//     summary: {},
//     orders: []
//   });


//   useEffect(() => {
//     fetchOrders();
//   }, []);



//   const fetchOrders = async () => {

//     try {

//       const res = await axios.get( `${API_URL}/api/orders` );
//       console.log("ADMIN ORDERS =", res.data);

//       setData(res.data);

//     } catch(error) {

//       console.log("FETCH ORDERS ERROR =", error);

//     }

//   };



//   const updateStatus = async(id, status) => {

//     try {

//       await axios.put(
//         `${API_URL}/api/orders/${id}/status`,
//         {
//           status
//         }
//       );


//       alert("Order status updated");

//       fetchOrders();


//     } catch(error) {

//       console.log("UPDATE ERROR =", error);

//       alert("Status update failed");

//     }

//   };



//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">


//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Orders
//       </h1>



//       {/* SUMMARY */}

//       <div className="grid grid-cols-4 gap-6 mb-8">


//         <div className="bg-white shadow rounded-xl p-5">
//           <h3>Total Orders</h3>
//           <p className="text-3xl font-bold">
//             {data.summary?.total || 0}
//           </p>
//         </div>



//         <div className="bg-white shadow rounded-xl p-5">
//           <h3>Delivered</h3>
//           <p className="text-3xl font-bold">
//             {data.summary?.delivered || 0}
//           </p>
//         </div>



//         <div className="bg-white shadow rounded-xl p-5">
//           <h3>Pending</h3>
//           <p className="text-3xl font-bold">
//             {data.summary?.pending || 0}
//           </p>
//         </div>



//         <div className="bg-white shadow rounded-xl p-5">
//           <h3>Cancelled</h3>
//           <p className="text-3xl font-bold">
//             {data.summary?.cancelled || 0}
//           </p>
//         </div>


//       </div>




//       {/* TABLE */}


//       <div className="bg-white rounded-xl shadow overflow-hidden">


//         <table className="w-full">


//           <thead className="bg-gray-100">

//             <tr className="text-left">

//               <th className="p-4">
//                 Order ID
//               </th>

//               <th>
//                 Customer
//               </th>

//               <th>
//                 Products
//               </th>

//               <th>
//                 Price
//               </th>

//               <th>
//                 Address
//               </th>

//               <th>
//                 Status
//               </th>

//             </tr>

//           </thead>



//           <tbody>


//           {
//             data.orders?.map((order)=>(


//               <tr
//                 key={order.order_id}
//                 className="border-t"
//               >



//                 <td className="p-4">
//                   #{order.order_id}
//                 </td>



//                 <td>
//                   {order.customer_name}
//                 </td>




//                 <td>


//                 {
//                   order.products?.map(
//                     (product,index)=>(

//                       <div key={index}>

//                         {product.product_name}
//                         {" x "}
//                         {product.quantity}

//                       </div>

//                     )
//                   )
//                 }


//                 </td>




//                 <td>


//                 {
//                   order.products?.map(
//                     (product,index)=>(

//                       <div key={index}>
//                         ₹{product.price}
//                       </div>

//                     )
//                   )
//                 }


//                 </td>




//                 <td>

//                   {order.address || "No Address"}

//                 </td>




//                 <td>


//                   <span
//                   className={`
//                   px-3 py-1 rounded-full text-sm

//                   ${
//                     order.status?.toLowerCase()==="delivered"
//                     ?
//                     "bg-green-100 text-green-700"

//                     :

//                     order.status?.toLowerCase()==="pending"
//                     ?
//                     "bg-yellow-100 text-yellow-700"

//                     :

//                     "bg-blue-100 text-blue-700"
//                   }

//                   `}
//                   >

//                     {order.status}

//                   </span>




//                   <div className="flex gap-2 mt-4 flex-wrap">


//                     <button

//                     className="bg-blue-500 text-white px-3 py-1 rounded"

//                     onClick={()=>
//                       updateStatus(
//                         order.order_id,
//                         "Accepted"
//                       )
//                     }

//                     >

//                     Accept

//                     </button>




//                     <button

//                     className="bg-purple-500 text-white px-3 py-1 rounded"

//                     onClick={()=>
//                       updateStatus(
//                         order.order_id,
//                         "Packed"
//                       )
//                     }

//                     >

//                     Packed

//                     </button>





//                     <button

//                     className="bg-orange-500 text-white px-3 py-1 rounded"

//                     onClick={()=>
//                       updateStatus(
//                         order.order_id,
//                         "Out for Delivery"
//                       )
//                     }

//                     >

//                     Out For Delivery

//                     </button>





//                     <button

//                     className="bg-green-600 text-white px-3 py-1 rounded"

//                     onClick={()=>
//                       updateStatus(
//                         order.order_id,
//                         "Delivered"
//                       )
//                     }

//                     >

//                     Delivered

//                     </button>




//                     <button

//                     className="bg-red-600 text-white px-3 py-1 rounded"

//                     onClick={()=>
//                       updateStatus(
//                         order.order_id,
//                         "Cancelled"
//                       )
//                     }

//                     >

//                     Cancel

//                     </button>


//                   </div>



//                 </td>



//               </tr>


//             ))
//           }


//           </tbody>



//         </table>



//       </div>



//     </div>

//   );

// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

export default function Orders() {

  const [data, setData] = useState({
    summary: {},
    orders: []
  });

  // Store all riders
  const [riders, setRiders] = useState([]);


  // ============================================================
  // LOAD ORDERS + RIDERS
  // ============================================================

  useEffect(() => {

    fetchOrders();
    fetchRiders();

  }, []);


  // ============================================================
  // FETCH ORDERS
  // ============================================================

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/orders`
      );

      console.log(
        "ADMIN ORDERS =",
        res.data
      );

      setData(res.data);

    } catch (error) {

      console.log(
        "FETCH ORDERS ERROR =",
        error
      );

    }

  };


  // ============================================================
  // FETCH RIDERS
  // ============================================================

  const fetchRiders = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/riders/all`
      );

      console.log(
        "ADMIN RIDERS =",
        res.data
      );

      setRiders(
        res.data.riders || []
      );

    } catch (error) {

      console.log(
        "FETCH RIDERS ERROR =",
        error.response?.data || error
      );

    }

  };


  // ============================================================
  // ASSIGN RIDER
  // ============================================================

  const assignRider = async (
    orderId,
    riderId
  ) => {

    try {

      if (!riderId) {
        return;
      }

      console.log(
        "ASSIGNING RIDER:",
        riderId,
        "TO ORDER:",
        orderId
      );


      const res = await axios.put(
        `${API_URL}/api/orders/${orderId}/assign-rider`,
        {
          rider_id: Number(riderId)
        }
      );


      console.log(
        "ASSIGN RIDER RESPONSE =",
        res.data
      );


      alert(
        "Rider assigned successfully"
      );


      // Refresh orders
      fetchOrders();


    } catch (error) {

      console.log(
        "ASSIGN RIDER ERROR =",
        error.response?.data || error
      );


      alert(
        error.response?.data?.message ||
        "Failed to assign rider"
      );

    }

  };


  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
        `${API_URL}/api/orders/${id}/status`,
        {
          status
        }
      );


      alert(
        "Order status updated"
      );


      fetchOrders();


    } catch (error) {

      console.log(
        "UPDATE ERROR =",
        error
      );


      alert(
        "Status update failed"
      );

    }

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="p-6 bg-gray-50 min-h-screen">


      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Orders
      </h1>


      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-4 gap-6 mb-8">


        <div className="bg-white shadow rounded-xl p-5">

          <h3>
            Total Orders
          </h3>

          <p className="text-3xl font-bold">
            {data.summary?.total || 0}
          </p>

        </div>


        <div className="bg-white shadow rounded-xl p-5">

          <h3>
            Delivered
          </h3>

          <p className="text-3xl font-bold">
            {data.summary?.delivered || 0}
          </p>

        </div>


        <div className="bg-white shadow rounded-xl p-5">

          <h3>
            Pending
          </h3>

          <p className="text-3xl font-bold">
            {data.summary?.pending || 0}
          </p>

        </div>


        <div className="bg-white shadow rounded-xl p-5">

          <h3>
            Cancelled
          </h3>

          <p className="text-3xl font-bold">
            {data.summary?.cancelled || 0}
          </p>

        </div>


      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">


        <table className="w-full">


          <thead className="bg-gray-100">

            <tr className="text-left">


              <th className="p-4">
                Order ID
              </th>


              <th className="p-4">
                Customer
              </th>


              <th className="p-4">
                Products
              </th>


              <th className="p-4">
                Price
              </th>


              <th className="p-4">
                Address
              </th>


              <th className="p-4">
                Rider
              </th>


              <th className="p-4">
                Status
              </th>


            </tr>

          </thead>


          <tbody>


            {data.orders?.map(
              (order) => (

                <tr
                  key={order.order_id}
                  className="border-t"
                >


                  {/* ORDER ID */}

                  <td className="p-4">

                    #{order.order_id}

                  </td>


                  {/* CUSTOMER */}

                  <td className="p-4">

                    <div>
                      {order.customer_name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {order.customer_phone}
                    </div>

                  </td>


                  {/* PRODUCTS */}

                  <td className="p-4">

                    {order.products?.map(
                      (product, index) => (

                        <div
                          key={index}
                          className="mb-1"
                        >

                          {product.product_name}

                          {" x "}

                          {product.quantity}

                        </div>

                      )
                    )}

                  </td>


                  {/* PRICE */}

                  <td className="p-4">

                    <div className="font-semibold">

                      ₹{order.total_amount}

                    </div>

                  </td>


                  {/* ADDRESS */}

                  <td className="p-4">

                    {order.address ||
                      "No Address"}

                  </td>


                  {/* =================================================
                      RIDER
                  ================================================== */}

                  <td className="p-4">


                    <select

                      value={
                        order.rider_id || ""
                      }

                      onChange={(e) =>
                        assignRider(
                          order.order_id,
                          e.target.value
                        )
                      }

                      className="
                        border
                        border-gray-300
                        rounded-lg
                        px-3
                        py-2
                        bg-white
                        min-w-[180px]
                      "
                    >


                      <option value="">

                        Select Rider

                      </option>


                      {riders.map(
                        (rider) => (

                          <option
                            key={rider.id}
                            value={rider.id}
                          >

                            {rider.name}

                            {" - "}

                            {rider.phone}

                          </option>

                        )
                      )}


                    </select>


                    {/* SHOW ASSIGNED RIDER */}

                    {order.rider_name && (

                      <div className="
                        mt-2
                        text-sm
                        text-green-600
                        font-medium
                      ">

                        Assigned:

                        {" "}

                        {order.rider_name}

                      </div>

                    )}


                  </td>


                  {/* =================================================
                      STATUS
                  ================================================== */}

                  <td className="p-4">


                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm

                        ${
                          order.status
                            ?.toLowerCase() ===
                          "delivered"

                            ? "bg-green-100 text-green-700"

                            : order.status
                                ?.toLowerCase() ===
                              "pending"

                            ? "bg-yellow-100 text-yellow-700"

                            : order.status
                                ?.toLowerCase() ===
                              "cancelled"

                            ? "bg-red-100 text-red-700"

                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >

                      {order.status}

                    </span>


                    {/* STATUS BUTTONS */}

                    <div className="
                      flex
                      gap-2
                      mt-4
                      flex-wrap
                    ">


                      <button

                        className="
                          bg-blue-500
                          text-white
                          px-3
                          py-1
                          rounded
                        "

                        onClick={() =>
                          updateStatus(
                            order.order_id,
                            "Accepted"
                          )
                        }

                      >

                        Accept

                      </button>


                      <button

                        className="
                          bg-purple-500
                          text-white
                          px-3
                          py-1
                          rounded
                        "

                        onClick={() =>
                          updateStatus(
                            order.order_id,
                            "Packed"
                          )
                        }

                      >

                        Packed

                      </button>


                      <button

                        className="
                          bg-orange-500
                          text-white
                          px-3
                          py-1
                          rounded
                        "

                        onClick={() =>
                          updateStatus(
                            order.order_id,
                            "Out for Delivery"
                          )
                        }

                      >

                        Out For Delivery

                      </button>


                      <button

                        className="
                          bg-green-600
                          text-white
                          px-3
                          py-1
                          rounded
                        "

                        onClick={() =>
                          updateStatus(
                            order.order_id,
                            "Delivered"
                          )
                        }

                      >

                        Delivered

                      </button>


                      <button

                        className="
                          bg-red-600
                          text-white
                          px-3
                          py-1
                          rounded
                        "

                        onClick={() =>
                          updateStatus(
                            order.order_id,
                            "Cancelled"
                          )
                        }

                      >

                        Cancel

                      </button>


                    </div>


                  </td>


                </tr>

              )
            )}


          </tbody>


        </table>


      </div>


    </div>

  );

}