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
    [],
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BaseURL}api/v1/get-all-orders`, { headers });
      setOrders(res.data.data || []);
    } catch (err) {
      setError("Failed to load orders.");
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
        { headers },
      );

      Swal.fire("Updated", res.data.message, "success");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: statusValue } : o,
        ),
      );

      setActiveOrderId(null);
      setStatusValue("");
    } catch {
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 px-4 py-6">
      {loading && (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="flex justify-center">
          <Card className="p-6 text-center">
            <p className="mb-4">{error}</p>
            <Button onClick={fetchOrders}>Retry</Button>
          </Card>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
            All Orders
          </h1>

          {orders
            .filter((o) => o?.book)
            .map((order, index) => {
              const statusLower = order.status?.toLowerCase() || "";

              const statusBadge = statusLower.includes("cancel")
                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                : statusLower.includes("placed")
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                : "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";

              return (
                <Card
                  key={order._id}
                  className="
                    mb-4 px-4 py-3
                    flex flex-col sm:flex-row
                    items-center
                    gap-3
                    relative overflow-visible
                    bg-white dark:bg-zinc-800
                    border border-gray-200 dark:border-zinc-700
                    rounded-xl
                    shadow-sm hover:shadow-md
                    transition-all duration-300
                  "
                >
                  {/* Index */}
                  <div className="w-full sm:w-[5%] flex items-center justify-center font-medium">
                    {index + 1}
                  </div>

                  {/* Book */}
                  <div className="w-full sm:w-[25%] flex items-center justify-center sm:justify-start font-semibold">
                    <Link
                      to={`/view-book-details/${order.book._id}`}
                      className="hover:text-blue-500 text-center sm:text-left"
                    >
                      {order.book.title}
                    </Link>
                  </div>

                  {/* Description */}
                  <div className="hidden md:flex md:w-[25%] items-center text-sm text-gray-600 dark:text-zinc-400">
                    {order.book.desc?.slice(0, 60)}...
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-[8%] flex items-center justify-center font-medium">
                    ₹{order.book.price}
                  </div>

                  {/* Qty */}
                  <div className="w-full sm:w-[8%] flex items-center justify-center">
                    {order.quantity || 1}
                  </div>

                  {/* Status */}
                  <div className="w-full sm:w-[12%] relative flex items-center justify-center">
                    <button
                      className={`
                        min-w-[130px]
                        px-4 py-1.5
                        rounded-full
                        text-sm font-semibold
                        flex items-center justify-center
                        ${statusBadge}
                      `}
                      onClick={() => {
                        setActiveOrderId(order._id);
                        setStatusValue(order.status);
                      }}
                    >
                      {order.status}
                    </button>

                    {activeOrderId === order._id && (
                      <div
                        className="
                          absolute top-full mt-2
                          bg-white dark:bg-zinc-900
                          border border-gray-200 dark:border-zinc-700
                          rounded-lg p-2
                          flex items-center gap-2
                          z-50 shadow-xl
                        "
                      >
                        <select
                          className="
                            bg-gray-100 dark:bg-zinc-800
                            text-gray-800 dark:text-white
                            border border-gray-300 dark:border-zinc-600
                            rounded-md px-2 py-1 text-sm
                          "
                          value={statusValue}
                          onChange={(e) =>
                            setStatusValue(e.target.value)
                          }
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <button
                          className="
                            text-green-600 dark:text-green-400
                            p-2 rounded-full
                            hover:bg-green-500/10
                          "
                          onClick={() =>
                            updateOrderStatus(order._id)
                          }
                        >
                          <FaCheck size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="w-full sm:w-[12%] flex items-center justify-center text-sm text-gray-500 dark:text-zinc-400 text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>

                  {/* Action */}
                  <div className="w-full sm:w-[5%] flex items-center justify-center">
                    <button
                      className="text-xl text-gray-600 dark:text-zinc-300 hover:text-orange-500"
                      onClick={() => {
                        setUserModalState("fixed");
                        setSelectedUser(order.user);
                      }}
                    >
                      <IoOpenOutline />
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
