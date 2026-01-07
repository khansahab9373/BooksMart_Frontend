import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/Loader/Loader";
import SeeUserData from "./SeeUserData";

import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";

import BaseURL from "../assets/baseURL";

const ORDER_STATUSES = [
  "Order Placed",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [userModalState, setUserModalState] = useState("hidden");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = useMemo(
    () => ({
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
    []
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${BaseURL}api/v1/get-all-orders`, {
        headers,
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
      Swal.fire("Error", "Failed to fetch orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId) => {
    if (!statusValue) {
      Swal.fire("Select status", "Please select a status.", "warning");
      return;
    }

    try {
      const res = await axios.put(
        `${BaseURL}api/v1/update-status/${orderId}`,
        { status: statusValue },
        { headers }
      );

      Swal.fire("Updated", res.data.message, "success");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: statusValue } : order
        )
      );

      setActiveOrderId(null);
      setStatusValue("");
    } catch {
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-6">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex justify-center">
          <Card className="max-w-md text-center p-6">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="mb-4 text-gray-700 dark:text-zinc-200">{error}</p>
            <Button onClick={fetchOrders}>Retry</Button>
          </Card>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex justify-center items-center h-[60vh]">
          <Card className="p-10 text-center">
            <div className="text-4xl mb-3">🛒</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-zinc-200">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mt-2">
              Orders will appear here once placed.
            </p>
          </Card>
        </div>
      )}

      {/* Orders */}
      {!loading && !error && orders.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800 dark:text-white">
            All Orders
          </h1>

          {orders
            .filter((order) => order?.book)
            .map((order, index) => {
              const statusLower = order.status?.toLowerCase() || "";

              const statusColor = statusLower.includes("cancel")
                ? "text-red-500"
                : statusLower.includes("placed")
                ? "text-yellow-500"
                : "text-green-500";

              return (
                <Card
                  key={order._id}
                  className="mb-3 p-4 flex flex-col sm:flex-row gap-3"
                >
                  <div className="w-full sm:w-[5%] text-center">
                    {index + 1}
                  </div>

                  <div className="w-full sm:w-[30%]">
                    <Link
                      to={`/view-book-details/${order.book._id}`}
                      className="font-semibold hover:text-blue-500"
                    >
                      {order.book.title}
                    </Link>
                  </div>

                  <div className="hidden md:block md:w-[35%] text-sm">
                    {order.book.desc?.slice(0, 60)}...
                  </div>

                  <div className="w-full sm:w-[10%]">₹{order.book.price}</div>

                  <div className="w-full sm:w-[15%]">
                    <button
                      className={`font-semibold ${statusColor}`}
                      onClick={() => {
                        setActiveOrderId(order._id);
                        setStatusValue(order.status);
                      }}
                    >
                      {order.status}
                    </button>

                    {activeOrderId === order._id && (
                      <div className="mt-2 flex items-center gap-2">
                        <label
                          htmlFor={`status-${order._id}`}
                          className="sr-only"
                        >
                          Change order status
                        </label>

                        <select
                          id={`status-${order._id}`}
                          className="bg-gray-800 text-white rounded p-1"
                          value={statusValue}
                          onChange={(e) => setStatusValue(e.target.value)}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <button
                          className="text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                          onClick={() => updateOrderStatus(order._id)}
                          aria-label={`Confirm status update for order ${
                            index + 1
                          }`}
                        >
                          <FaCheck aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-[5%]">
                    <button
                      className="text-xl hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                      onClick={() => {
                        setUserModalState("fixed");
                        setSelectedUser(order.user);
                      }}
                      aria-label={`View user details for order ${index + 1}`}
                    >
                      <IoOpenOutline aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {selectedUser && (
        <SeeUserData
          userDiv={userModalState}
          setuserDiv={setUserModalState}
          userDivData={selectedUser}
        />
      )}
    </div>
  );
};

export default AllOrders;
