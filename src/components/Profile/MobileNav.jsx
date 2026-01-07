import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import { authActions } from "../../store/auth";

const MobileNav = () => {
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      {role === "user" && (
        <div className="w-full flex flex-col lg:hidden items-stretch my-4 mt-4 bg-gray-100 dark:bg-zinc-800 p-4 rounded gap-2">
          <Link
            to="/profile"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full text-center py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Favourite
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full text-center py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full text-center py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Settings
          </Link>
          <button
            onClick={() => {
              dispatch(authActions.logout());
              dispatch(authActions.changeRole("user"));
              localStorage.removeItem("id");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
            className="w-full py-2 mt-2 bg-red-500 text-white rounded flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      )}

      {role === "admin" && (
        <div className="w-full flex flex-col lg:hidden items-stretch my-4 mt-4 bg-gray-100 dark:bg-zinc-800 p-4 rounded gap-2">
          <Link
            to="/profile"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full text-center py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full text-center py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Add Book
          </Link>
          <button
            onClick={() => {
              dispatch(authActions.logout());
              dispatch(authActions.changeRole("user"));
              localStorage.removeItem("id");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
            className="w-full py-2 mt-2 bg-red-500 text-white rounded flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      )}
    </>
  );
};

export default MobileNav;
