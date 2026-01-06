import  { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import BaseULR from "../../assets/baseURL";

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${BaseULR}api/v1/get-order-history`, {
          headers,
        });
        setOrderHistory(response.data.data);
      } catch (error) {
        console.log("Error fetching order history:", error);
      }
    };
    fetch();
  }, []);

  const validOrders = OrderHistory
    ? OrderHistory.filter((o) => o && o.book)
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {!OrderHistory && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {OrderHistory && validOrders.length === 0 && (
        <div className="h-[80vh] p-4 text-gray-800 dark:text-zinc-300">
          <div className="h-[100%] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-gray-500 dark:text-zinc-400 mb-8">
              No Order History
            </h1>
            <img
              src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
              alt="No orders"
              className="h-[20vh] mb-8"
            />
          </div>
        </div>
      )}

      {OrderHistory && validOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            Your Order History
          </h1>

          <div className="mt-4 bg-gray-200 dark:bg-zinc-700 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center text-black dark:text-white">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1 className="text-black dark:text-white">Books</h1>
            </div>
            <div className="w-[45%]">
              <h1 className="text-black dark:text-white">Description</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="text-black dark:text-white">Price</h1>
            </div>
            <div className="w-[16%]">
              <h1 className="text-black dark:text-white">Status</h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block">
              <h1 className="text-black dark:text-white">Mode</h1>
            </div>
          </div>

          {validOrders.map((order, index) => (
            <div
              key={order._id}
              className="mt-4 bg-gray-100 dark:bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 items-center hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all duration-300"
            >
              <div className="w-[3%]">
                <h1 className="text-center text-black dark:text-white">
                  {index + 1}
                </h1>
              </div>
              <div className="w-[22%]">
                <Link
                  to={`/view-book-details/${order.book._id}`}
                  className="text-black dark:text-white hover:text-blue-500"
                >
                  {order.book.title}
                </Link>
              </div>
              <div className="w-[45%]">
                <h1 className="text-black dark:text-white">
                  {order.book.desc.slice(0, 50)}...
                </h1>
              </div>
              <div className="w-[9%]">
                <h1 className="text-black dark:text-white">
                  ₹{order.book.price}
                </h1>
              </div>
              <div className="w-[16%]">
                <h1 className="font-semibold">
                  {(() => {
                    const s = (order.status || "").toLowerCase();
                    if (s.includes("placed"))
                      return (
                        <div className="text-yellow-500">{order.status}</div>
                      );
                    if (s.includes("cancel"))
                      return <div className="text-red-500">{order.status}</div>;
                    return <div className="text-green-500">{order.status}</div>;
                  })()}
                </h1>
              </div>
              <div className="w-none md:w-[5%] hidden md:block">
                <h1 className="text-sm text-gray-600 dark:text-zinc-400">
                  COD
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
