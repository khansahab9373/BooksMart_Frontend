import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "../ThemeToggle"; // Import the ThemeToggle component
import axios from "axios";
import BaseURL from "../../assets/baseURL";
import { setCart } from "../../store/cart";

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
  const cartCount = useSelector(
    (state) =>
      state.cart.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
  );
  const dispatch = useDispatch();

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
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAllBooks = location.pathname.startsWith("/all-books");

  // Debounce live-search navigation while typing, but only when on All Books page
  useEffect(() => {
    if (!isAllBooks) return;
    const q = (searchQuery || "").trim();
    const timer = setTimeout(() => {
      if (q) {
        navigate(`/all-books?search=${encodeURIComponent(q)}`, {
          replace: true,
        });
      } else {
        navigate(`/all-books`, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, navigate, isAllBooks]);

  // Fetch cart when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchCart = async () => {
        try {
          const headers = {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          };
          const res = await axios.get(`${BaseURL}api/v1/get-user-cart`, {
            headers,
          });
          dispatch(setCart(res.data.data || []));
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      };
      fetchCart();
    }
  }, [isLoggedIn, dispatch]);

  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = (searchQuery || "").trim();
    if (!q) return;
    // If not already on All Books, navigate there; otherwise the debounce effect will update
    if (!isAllBooks) {
      navigate(`/all-books?search=${encodeURIComponent(q)}`);
    }
    setMobileNavVisible(false);
    setMobileSearchVisible(false);
  };

  return (
    <>
      <nav className="z-50 relative flex bg-gray-100 dark:bg-zinc-800 text-black dark:text-white px-4 sm:px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BooksMart</h1>
        </Link>
        <div className="nav-links-bookheaven block md:flex items-center gap-4">
          {/* Desktop search (visible md and up) - only on /all-books */}
          {isAllBooks && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center mr-4"
              role="search"
              aria-label="Search books"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-64 md:w-80 px-3 py-2 rounded-l border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </form>
          )}
          <div className="hidden md:flex gap-4 items-center">
            {links.map((item, i) => {
              // Show avatar instead of 'Profile' when logged in
              if (item.title === "Profile" && isLoggedIn) {
                const imgSrc =
                  avatar ||
                  "https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--telegram-logo-man-ui-pack-miscellaneous-icons-840229.png?f=webp&w=256";
                return (
                  <Link
                    to={item.link}
                    key={i}
                    className="px-1 flex items-center"
                  >
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
                      : item.title === "Cart"
                        ? "px-4 py-1 hover:text-blue-500 relative"
                        : "px-4 py-1 hover:text-blue-500"
                  } transition duration-300`}
                  key={i}
                >
                  {item.title}
                  {item.title === "Cart" && isLoggedIn && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
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
              aria-expanded={mobileNavVisible}
              aria-controls="mobile-nav"
              className="block md:hidden flex items-center justify-center
               w-10 h-10 rounded
               text-black dark:text-white
               hover:bg-gray-200 dark:hover:bg-zinc-700
               transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            >
              <FaGripLines size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        id="mobile-nav"
        className={`${
          mobileNavVisible ? "block" : "hidden"
        } bg-gray-100 dark:bg-zinc-800 absolute inset-0 z-40 flex flex-col items-center justify-center overflow-auto p-6`}
      >
        {/* Mobile search: show icon first, reveal field when tapped. Only on /all-books */}
        {isAllBooks && (
          <div className="w-full max-w-md mb-4">
            <button
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-700 w-full justify-start"
              aria-expanded={mobileSearchVisible}
              aria-controls="mobile-search-field"
            >
              <FaSearch />
              <span className="ml-2">Search books</span>
            </button>

            {mobileSearchVisible && (
              <form
                id="mobile-search-field"
                onSubmit={handleSearchSubmit}
                className="mt-3"
                role="search"
                aria-label="Search books mobile"
              >
                <div className="flex w-full">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 text-base focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
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
                  className="h-20 w-20 sm:h-28 sm:w-28 rounded-full object-cover mx-auto"
                />
                <p className="text-center mt-2 text-xl sm:text-2xl text-black dark:text-white">
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
