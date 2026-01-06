import axios from "axios";
import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {  FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import Swal from "sweetalert2"; // Import SweetAlert2
import SeeUserData from "./SeeUserData";
import BaseULR from "../assets/baseURL";

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(null);
  const [Values, setValues] = useState({ status: "" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BaseULR}api/v1/get-all-orders`, {
          headers,
        });
        const orders = response.data.data || [];
        setAllOrders(orders); // Directly set all orders without modifying the array
      } catch (error) {
        console.error("Error fetching order history:", error);

        // SweetAlert for error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch orders.",
        });
      }
    };

    fetchOrders();
  }, []); // Only once on mount

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const submitChanges = async (orderId) => {
    const id = orderId;
    if (!Values.status) {
      Swal.fire(
        "Select status",
        "Please select a status before updating.",
        "warning"
      );
      return;
    }
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/update-status/${id}`,
        Values,
        { headers }
      );

      // SweetAlert for success
      Swal.fire("Updated", response.data.message, "success");

      // Update local state so the change is reflected without a page refresh
      setAllOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: Values.status } : o))
      );

      setOptions(null); // Reset the option select after updating
      setValues({ status: "" });
    } catch (error) {
      console.error("Error updating status:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the order status.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center justify-center">
      {AllOrders.length === 0 ? (
        <div className="h-screen flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl text-zinc-400 animate-bounce">
            No Orders Yet 🛒
          </h1>
        </div>
      ) : (
        <div className="w-full p-4 bg-gray-100 dark:bg-zinc-800 text-zinc-100 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            All Orders
          </h1>

          <div className="mt-4 bg-gray-200 dark:bg-zinc-700 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center text-black dark:text-white">Sr.</h1>
            </div>
            <div className="w-[40%] md:w-[22%]">
              <h1 className="text-black dark:text-white">Book</h1>
            </div>
            <div className="w-0 md:w-[45%] hidden md:block">
              <h1 className="text-black dark:text-white">Description</h1>
            </div>
            <div className="w-[17%] md:w-[9%]">
              <h1 className="text-black dark:text-white">Price</h1>
            </div>
            <div className="w-[30%] md:w-[16%]">
              <h1 className="text-black dark:text-white">Status</h1>
            </div>
            <div className="w-[10%] md:w-[5%]">
              <h1 className="text-black dark:text-white">Actions</h1>
            </div>
          </div>

          {AllOrders.filter((it) => it && it.book).map((items, i) => (
            <div
              key={items._id}
              className="bg-gray-200 dark:bg-zinc-700 w-full rounded py-2 px-4 flex gap-2 hover:bg-gray-300 dark:hover:bg-zinc-600 hover:cursor-pointer transition-all duration-300"
            >
              <div className="w-[3%]">
                <h1 className="text-center text-black dark:text-white">
                  {i + 1}
                </h1>
              </div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${items.book._id}`}
                  className="text-black dark:text-white hover:text-blue-500"
                >
                  {items.book.title}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1 className="text-black dark:text-white">
                  {items.book.desc.slice(0, 50)}...
                </h1>
              </div>
              <div className="w-[17%] md:w-[9%]">
                <h1 className="text-black dark:text-white">
                  ₹{items.book.price}
                </h1>
              </div>
              <div className="w-[30%] md:w-[16%]">
                <h1 className="font-semibold">
                  <button
                    className="hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      setOptions(items._id);
                      setValues({ status: items.status });
                    }}
                  >
                    {(() => {
                      const s = (items.status || "").toLowerCase();
                      if (s.includes("placed"))
                        return (
                          <div className="text-yellow-500">{items.status}</div>
                        );
                      if (s.includes("cancel"))
                        return (
                          <div className="text-red-500">{items.status}</div>
                        );
                      return (
                        <div className="text-green-500">{items.status}</div>
                      );
                    })()}
                  </button>
                </h1>

                <div
                  className={`${
                    Options === items._id ? "flex mt-2" : "hidden"
                  }`}
                >
                  <select
                    name="status"
                    className="bg-gray-800 p-1 rounded text-white"
                    onChange={change}
                    value={Values.status}
                  >
                    {[
                      "Order Placed",
                      "Out for delivery",
                      "Delivered",
                      "Cancelled",
                    ].map((statusOption, idx) => (
                      <option key={idx} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-green-500 hover:text-pink-600 mx-2"
                    onClick={() => submitChanges(items._id)}
                  >
                    <FaCheck />
                  </button>
                </div>
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl text-black dark:text-white hover:text-orange-500"
                  onClick={() => {
                    setuserDiv("fixed");
                    setuserDivData(items.user);
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </div>
  );
};

export default AllOrders;
