import React, { useEffect, useState } from "react";
import Sidebar_temp from "../components/Profile/Sidebar_temp";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import MobileNav from "../components/Profile/MobileNav";
import BaseURL from "../assets/baseURL";

const Profile = () => {
  const [Profile, setProfile] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}api/v1/get-user-information`,
          { headers },
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfile(null);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4">
      {!Profile && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {Profile && (
        <>
          <div className="w-full md:w-1/6 h-auto lg:h-screen">
            <div className="hidden md:block">
              <Sidebar_temp data={Profile} />
            </div>
            <div className="block md:hidden">
              <MobileNav />
            </div>
          </div>
          <div className="w-full md:w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
