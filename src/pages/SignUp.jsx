import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BaseURL from "../assets/baseURL";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const fileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  // Avatar preview + cleanup
  useEffect(() => {
    if (!avatar) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatar);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

  const submit = async () => {
    const { username, email, password, address } = values;

    if (!username || !email || !password || !address) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "All fields are required!",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("address", address);
      if (avatar) formData.append("avatar", avatar);

      const response = await axios.post(
        `${BaseURL}api/v1/sign-up`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Sign Up Successful",
        text: response.data.message || "Your account has been created!",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-12 py-8">
      <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-xl text-gray-800 dark:text-zinc-200">Sign Up</p>

        <div className="mt-4">
          <label className="text-gray-600 dark:text-zinc-400">Username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={change}
            className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 dark:text-zinc-400">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={change}
            className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 dark:text-zinc-400">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={change}
            className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-600 dark:text-zinc-400">
            Avatar (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={fileChange}
            className="w-full mt-2"
          />
          {preview && (
            <img
              src={preview}
              alt="avatar"
              className="mt-2 h-24 w-24 rounded-full object-cover"
            />
          )}
        </div>

        <div className="mt-4">
          <label className="text-gray-600 dark:text-zinc-400">Address</label>
          <textarea
            name="address"
            rows="4"
            value={values.address}
            onChange={change}
            className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        <button
          type="button"
          onClick={submit}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-800 dark:text-zinc-200">
          Already have an account?
          <Link to="/login" className="text-blue-500 ml-1 underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
