import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { authActions } from "../../store/auth";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded flex flex-col items-center justify-between h-auto lg:h-full">
      <div className="flex flex-col items-center w-full">
        <img
          src={data.avatar}
          alt="User Avatar"
          className="h-[12vh] rounded-full"
        />
        <p className="mt-4 text-xl text-gray-800 dark:text-zinc-100 font-semibold">
          {data.username}
        </p>
       <p className="mt-1 text-sm text-gray-600 dark:text-zinc-300 
              break-all text-center max-w-full">
  {data.email}
</p>

        <div className="w-full mt-4 h-[1px] bg-gray-300 dark:bg-zinc-500"></div>
      </div>

      {role === "user" && (
        <div className="w-full flex flex-col items-center mt-6">
          <Link
            to="/profile"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Favourite
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Settings
          </Link>
        </div>
      )}

      {role === "admin" && (
        <div className="w-full flex flex-col items-center mt-6">
          <Link
            to="/profile"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-gray-800 dark:text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Add Book
          </Link>
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-6 w-full flex justify-center">
        <button
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole("user"));
            localStorage.clear("id");
            localStorage.clear("token");
            localStorage.clear("role");
            history("/");
          }}
          className="text-gray-800 dark:text-zinc-100 font-semibold w-full lg:w-3/6 py-2 mt-4 text-center hover:bg-gray-200 dark:hover:bg-zinc-900 rounded flex items-center justify-center transition-all duration-300"
        >
          <FaSignOutAlt className="mr-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
