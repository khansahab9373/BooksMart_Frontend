import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import BaseULR from "../../assets/baseURL";
import Card from "../ui/Card";
import Button from "../ui/Button";

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BaseULR}api/v1/get-order-history`, {
          headers,
        });
        setOrderHistory(response.data.data);
      } catch (err) {
        console.log("Error fetching order history:", err);
        setError("Failed to load order history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const validOrders = OrderHistory
    ? OrderHistory.filter((o) => o && o.book)
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {loading && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-lg text-gray-700 dark:text-zinc-200 mb-3">
                {error}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {!loading && !error && OrderHistory && validOrders.length === 0 && (
        <div className="min-h-[60vh] p-4 text-gray-800 dark:text-zinc-300 flex items-center justify-center">
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <h1 className="text-3xl sm:text-5xl font-semibold text-gray-500 dark:text-zinc-400 mb-2">
              No Order History
            </h1>
            <p className="text-gray-600 dark:text-zinc-300">
              You haven't placed any orders yet.
            </p>
            <div className="mt-4">
              <Button onClick={() => (window.location.href = "/all-books")}>
                Browse Books
              </Button>
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && OrderHistory && validOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            Your Order History
          </h1>

          <div className="mt-4 bg-gray-200 dark:bg-zinc-700 w-full rounded py-2 px-4 hidden sm:flex flex-row gap-2">
            <div className="w-[3%]">
              <h1 className="text-center text-black dark:text-white">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1 className="text-black dark:text-white">Books</h1>
            </div>
            <div className="hidden md:block md:w-[35%]">
              <h1 className="text-black dark:text-white">Description</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="text-black dark:text-white">Price</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="text-black dark:text-white">Qty</h1>
            </div>
            <div className="w-[12%]">
              <h1 className="text-black dark:text-white">Status</h1>
            </div>
            <div className="w-[10%]">
              <h1 className="text-black dark:text-white">Time</h1>
            </div>
          </div>

          {validOrders.map((order, index) => (
            <div
              key={order._id}
              className="mt-4 bg-gray-100 dark:bg-zinc-800 w-full rounded py-2 px-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all duration-300"
            >
              <div className="w-full sm:w-[3%]">
                <h1 className="text-center text-black dark:text-white">
                  {index + 1}
                </h1>
              </div>
              <div className="w-full sm:w-[22%]">
                <div className="sm:hidden text-sm text-gray-600 dark:text-zinc-300 mb-1">
                  Books
                </div>
                <Link
                  to={`/view-book-details/${order.book._id}`}
                  className="text-black dark:text-white hover:text-blue-500 block"
                >
                  {order.book.title}
                </Link>
              </div>
              <div className="w-full hidden md:block md:w-[35%]">
                <h1 className="text-black dark:text-white">
                  {order.book.desc.slice(0, 50)}...
                </h1>
              </div>
              <div className="w-full sm:w-[9%]">
                <div className="sm:hidden text-sm text-gray-600 dark:text-zinc-300 mb-1">
                  Price
                </div>
                <h1 className="text-black dark:text-white">
                  ₹{order.book.price}
                </h1>
              </div>
              <div className="w-full sm:w-[9%]">
                <div className="sm:hidden text-sm text-gray-600 dark:text-zinc-300 mb-1">
                  Qty
                </div>
                <h1 className="text-black dark:text-white">
                  {order.quantity || 1}
                </h1>
              </div>
              <div className="w-full sm:w-[12%]">
                <div className="sm:hidden text-sm text-gray-600 dark:text-zinc-300 mb-1">
                  Status
                </div>
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
              <div className="w-full sm:w-[10%]">
                <div className="sm:hidden text-sm text-gray-600 dark:text-zinc-300 mb-1">
                  Time
                </div>
                <h1 className="text-sm text-gray-600 dark:text-zinc-400">
                  {new Date(order.createdAt).toLocaleString()}
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
