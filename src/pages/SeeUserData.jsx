import React, { useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";

const SeeUserData = ({ userDivData, userDiv, setuserDiv }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (userDiv !== "hidden" && closeRef.current) closeRef.current.focus();
  }, [userDiv]);
  return (
    <>
      {/* Background Overlay */}
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full bg-zinc-800 dark:bg-black opacity-80`}
      ></div>

      {/* Modal Container */}
      <div
        className={`${userDiv} top-0 left-0 h-screen w-full flex items-center justify-center`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-data-title"
        onKeyDown={(e) => {
          if (e.key === "Escape") setuserDiv("hidden");
        }}
      >
        <div className="bg-white dark:bg-gray-900 rounded p-4 w-[80%] md:w-[50%] lg:w-[40%] text-zinc-800 dark:text-white">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 id="user-data-title" className="text-2xl font-semibold">
              User Information
            </h1>
            <button
              ref={closeRef}
              onClick={() => setuserDiv("hidden")}
              className="text-zinc-800 dark:text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              aria-label="Close user details dialog"
            >
              <RxCross1 aria-hidden="true" />
            </button>
          </div>

          {/* User Details */}
          <div className="mt-2">
            <label className="text-gray-600 dark:text-zinc-400">
              Username:{" "}
              <span className="font-semibold">{userDivData.username}</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="text-gray-600 dark:text-zinc-400">
              Email: <span className="font-semibold">{userDivData.email}</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="text-gray-600 dark:text-zinc-400">
              Address:{" "}
              <span className="font-semibold">{userDivData.address}</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeeUserData;
