import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../assets/baseURL";

const Login = () => {
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (Values.username === "" || Values.password === "") {
        // SweetAlert for missing fields
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "All fields are required!",
        });
        return;
      } else {
        const response = await axios.post(`${BaseULR}api/v1/sign-in`, Values);

        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        // SweetAlert for success
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });

        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        // SweetAlert for server error
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response.data.message || "Something went wrong.",
        });
      } else if (error.request) {
        console.error("Error request:", error.request);

        // SweetAlert for no server response
        Swal.fire({
          icon: "error",
          title: "No Response",
          text: "No response received from server. Please try again.",
        });
      } else {
        console.error("Error message:", error.message);

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
        <p className="text-gray-800 dark:text-zinc-200 text-xl">Log In</p>
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
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none"
              placeholder="username"
              name="username"
              required
              value={Values.username}
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
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none"
              placeholder="password"
              name="password"
              required
              value={Values.password}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:text-black"
              onClick={submit}
            >
              LogIn
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-gray-800 dark:text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-gray-800 dark:text-zinc-200 font-semibold">
            Don't have an account? &nbsp;
            <Link to="/signup" className="hover:text-blue-500">
              <u>SignUp</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
