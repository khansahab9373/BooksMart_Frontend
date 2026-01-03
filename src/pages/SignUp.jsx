import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../assets/baseURL";

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        // SweetAlert for missing fields
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "All fields are required!",
        });
        return;
      } else {
        const response = await axios.post(`${BaseULR}api/v1/sign-up`, Values);

        // SweetAlert for success
        Swal.fire({
          icon: "success",
          title: "Sign Up Successful",
          text: response.data.message || "Your account has been created!",
        });

        navigate("/LogIn");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      if (error.response) {
        // SweetAlert for server error
        Swal.fire({
          icon: "error",
          title: "Sign Up Failed",
          text: error.response.data.message || "Something went wrong.",
        });
      } else if (error.request) {
        // SweetAlert for no server response
        Swal.fire({
          icon: "error",
          title: "No Response",
          text: "No response received from server. Please try again.",
        });
      } else {
        // SweetAlert for unexpected error
        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-12 py-8 flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-gray-800 dark:text-zinc-200 text-xl">Sign Up</p>
        <div className="mt-4">
          <div>
            <label
              htmlFor="username"
              className="text-gray-600 dark:text-zinc-400"
            >
              Username
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              placeholder="username"
              name="username"
              required
              value={Values.username}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="text-gray-600 dark:text-zinc-400">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              placeholder="xyz@example.com"
              name="email"
              required
              value={Values.email}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-gray-600 dark:text-zinc-400"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              placeholder="password"
              name="password"
              required
              value={Values.password}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="address"
              className="text-gray-600 dark:text-zinc-400"
            >
              Address
            </label>
            <textarea
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              rows="5"
              placeholder="address"
              name="address"
              required
              value={Values.address}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
              onClick={submit}
            >
              SignUp
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-gray-800 dark:text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-gray-800 dark:text-zinc-200 font-semibold">
            Already have an account? &nbsp;
            <Link to="/login" className="hover:text-blue-500">
              <u>LogIn</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
