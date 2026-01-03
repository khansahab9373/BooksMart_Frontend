import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../../assets/baseURL";

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [value, setValue] = useState({ address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${BaseULR}api/v1/get-user-information`,
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
      } catch (error) {
        console.error("Error fetching user data:", error);

        // SweetAlert for error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user data.",
        });
      }
    };
    fetchUserData();
  }, []);

  // Handle address change
  const handleAddressChange = (e) => {
    setValue({ ...value, address: e.target.value });
  };

  // Submit updated address
  const submitAddress = async () => {
    setIsSubmitting(true); // Show loading state
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/update-address`,
        value,
        { headers }
      );
      console.log("Address updated successfully:", response.data);

      // SweetAlert for success
      Swal.fire("Updated", "Address updated successfully!", "success");
    } catch (error) {
      console.error("Error updating address:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the address. Please try again.",
      });
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {!profileData && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {profileData && (
        <div className="h-[100%] p-0 md:p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            Settings
          </h1>
          <div className="flex gap-12">
            <div>
              <label
                htmlFor="username"
                className="text-gray-600 dark:text-zinc-400"
              >
                Username
              </label>
              <p className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100">
                {profileData.username}
              </p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-gray-600 dark:text-zinc-400"
              >
                Email
              </label>
              <p className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100">
                {profileData.email}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="address"
              className="text-gray-600 dark:text-zinc-400"
            >
              Address
            </label>
            <textarea
              className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100"
              rows="5"
              placeholder="Address"
              name="address"
              value={value.address}
              onChange={handleAddressChange}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-black dark:text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400"
              onClick={submitAddress}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
