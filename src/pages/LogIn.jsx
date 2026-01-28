import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import BaseURL from "../assets/baseURL";

const Login = () => {
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
    setFormErrors({ ...formErrors, [name]: undefined });
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      const errors = {};
      if (!Values.username) errors.username = "Username is required.";
      if (!Values.password) errors.password = "Password is required.";
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      } else {
        setLoading(true);
        const response = await axios.post(`${BaseURL}api/v1/sign-in`, Values);

        // save tokens and basic info
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        dispatch(authActions.changeRole(response.data.role));

        // fetch full user info (to get avatar and username)
        try {
          const userRes = await axios.get(
            `${BaseURL}api/v1/get-user-information`,
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
                id: response.data.id,
              },
            },
          );
          const user = userRes.data;
          dispatch(
            authActions.setUser({
              id: response.data.id,
              token: response.data.token,
              username: user.username,
              avatar: user.avatar,
            }),
          );
        } catch (err) {
          console.warn("Could not fetch user info after login:", err);
          // still mark logged in
          dispatch(authActions.login());
          dispatch(
            authActions.setUser({
              id: response.data.id,
              token: response.data.token,
            }),
          );
        }

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-12 py-8 flex items-center justify-center">
      <Card className="w-full md:w-3/6 lg:w-2/6 px-8 py-5">
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
              id="login-username"
              type="text"
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-3 rounded"
              placeholder="username"
              name="username"
              required
              value={Values.username}
              onChange={change}
              aria-invalid={!!formErrors.username}
              aria-describedby={
                formErrors.username ? "login-username-error" : undefined
              }
            />
            {formErrors.username && (
              <p
                id="login-username-error"
                className="text-sm text-red-600 mt-1"
              >
                {formErrors.username}
              </p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-gray-600 dark:text-zinc-400"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="w-full mt-2 bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-3 rounded"
              placeholder="password"
              name="password"
              required
              value={Values.password}
              onChange={change}
              aria-invalid={!!formErrors.password}
              aria-describedby={
                formErrors.password ? "login-password-error" : undefined
              }
            />
            {formErrors.password && (
              <p
                id="login-password-error"
                className="text-sm text-red-600 mt-1"
              >
                {formErrors.password}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Button
              className="w-full font-semibold"
              onClick={submit}
              loading={loading}
              disabled={loading}
            >
              LogIn
            </Button>
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
      </Card>
    </div>
  );
};

export default Login;
