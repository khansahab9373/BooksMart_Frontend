import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle"; // Import the ThemeToggle component

const Navbar = () => {
  const baseLinks = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Admin Profile", link: "/profile" },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const avatar = useSelector((state) => state.auth.avatar);
  const username = useSelector((state) => state.auth.username);

  // Filter links based on role and login status
  const links = baseLinks.filter((item) => {
    if (!isLoggedIn) {
      return (
        item.title !== "Cart" &&
        item.title !== "Profile" &&
        item.title !== "Admin Profile"
      );
    }
    if (isLoggedIn && role === "user") {
      return item.title !== "Admin Profile";
    }
    if (isLoggedIn && role === "admin") {
      return item.title !== "Profile" && item.title !== "Cart";
    }
    return true; // Default case
  });

  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible);
  };

  return (
    <>
      <nav className="z-50 relative flex bg-gray-100 dark:bg-zinc-800 text-black dark:text-white px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BooksMart</h1>
        </Link>
        <div className="nav-links-bookheaven block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((item, i) => {
              // Show avatar instead of 'Profile' when logged in
              if (item.title === "Profile" && isLoggedIn) {
                const imgSrc =
                  avatar ||
                  "https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--telegram-logo-man-ui-pack-miscellaneous-icons-840229.png?f=webp&w=256";
                return (
                  <Link to={item.link} key={i} className="px-1">
                    <img
                      src={imgSrc}
                      alt={username || "profile"}
                      className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                    />
                  </Link>
                );
              }

              return (
                <Link
                  to={item.link}
                  className={`${
                    item.title === "Admin Profile"
                      ? "px-4 py-1 border border-blue-500 rounded hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
                      : "hover:text-blue-500"
                  } transition duration-300`}
                  key={i}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
          {!isLoggedIn && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/LogIn"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition duration-300"
              >
                LogIn
              </Link>
              <Link
                to="/SignUp"
                className="px-4 py-1 bg-blue-500 rounded hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition duration-300"
              >
                SignUp
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={toggleMobileNav}
              className="block md:hidden flex items-center justify-center
               w-10 h-10 rounded
               text-black dark:text-white
               hover:bg-gray-200 dark:hover:bg-zinc-700
               transition"
            >
              <FaGripLines size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={`${
          mobileNavVisible ? "block" : "hidden"
        } bg-gray-100 dark:bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((item, i) => {
          if (item.title === "Profile" && isLoggedIn) {
            const imgSrc =
              avatar ||
              "https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--telegram-logo-man-ui-pack-miscellaneous-icons-840229.png?f=webp&w=256";
            return (
              <Link
                to={item.link}
                key={i}
                onClick={toggleMobileNav}
                className="mb-6"
              >
                <img
                  src={imgSrc}
                  alt={username || "profile"}
                  className="h-28 w-28 rounded-full object-cover mx-auto"
                />
                <p className="text-center mt-2 text-2xl text-black dark:text-white">
                  {username || "Profile"}
                </p>
              </Link>
            );
          }

          return (
            <Link
              to={item.link}
              className="text-black dark:text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
              key={i}
              onClick={toggleMobileNav} // Close mobile nav on link click
            >
              {item.title}
            </Link>
          );
        })}

        {!isLoggedIn && (
          <>
            <Link
              to="/LogIn"
              className="px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-all duration-300"
              onClick={toggleMobileNav} // Close mobile nav on link click
            >
              LogIn
            </Link>
            <Link
              to="/SignUp"
              className="px-8 mb-8 text-3xl font-semibold py-2 bg-blue-500 rounded hover:bg-gray-200 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-all duration-300"
              onClick={toggleMobileNav} // Close mobile nav on link click
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
