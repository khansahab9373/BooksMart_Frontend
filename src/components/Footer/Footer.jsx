import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

const Footer = () => {

  // 🔹 ADDED (ONLY FUNCTIONALITY)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400">

      {/* ===== TOP SECTION ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* BRAND */}
        <div className="space-y-3">
          <Link
            to="/"
            onClick={scrollToTop}   // ✅ added
            className="
              inline-block text-3xl font-extrabold tracking-tight
              bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500
              bg-clip-text text-transparent
              hover:from-purple-500 hover:via-indigo-500 hover:to-blue-600
              hover:tracking-wide
              transition-all duration-300 ease-out
            "
          >
            BooksMart
          </Link>

          <p className="text-sm">
            Your one-stop destination for buying books online.
          </p>

          <p className="text-sm">
            Designed & Developed by{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              Abdul Rahman Khan
            </span>
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Quick Links
          </h4>

          <nav className="flex flex-col gap-2 text-sm">
            {[
              { name: "Home", to: "/" },
              { name: "All Books", to: "/all-books" },
              { name: "Cart", to: "/cart" },
              { name: "Profile", to: "/profile" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={scrollToTop}   // ✅ added
                className="
                  w-fit
                  hover:text-blue-600 dark:hover:text-blue-400
                  hover:translate-x-1
                  transition-all duration-200
                "
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* LEGAL */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Legal
          </h4>

          <nav className="flex flex-col gap-2 text-sm">
            {[
              { name: "Terms & Conditions", to: "/terms" },
              { name: "Privacy Policy", to: "/privacy" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={scrollToTop}   // ✅ added
                className="
                  w-fit
                  hover:text-blue-600 dark:hover:text-blue-400
                  hover:translate-x-1
                  transition-all duration-200
                "
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* SOCIAL & CONTACT */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Connect with Me
          </h4>

          <div className="flex gap-4 pt-1">
            <a
              href="https://www.instagram.com/khansahabplays?igsh=MTE1anhodXJuMzlucQ=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="
                hover:text-pink-500
                hover:-translate-y-1
                transition-all duration-200
              "
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://www.facebook.com/share/182CJYkdDP/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="
                hover:text-blue-600
                hover:-translate-y-1
                transition-all duration-200
              "
            >
              <Facebook size={18} />
            </a>

            <a
              href="https://x.com/khansahabplays"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="
                hover:text-sky-500
                hover:-translate-y-1
                transition-all duration-200
              "
            >
              <Twitter size={18} />
            </a>

            <a
              href="https://www.linkedin.com/in/abdulrahmankhan0"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="
                hover:text-blue-700 dark:hover:text-blue-400
                hover:-translate-y-1
                transition-all duration-200
              "
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://github.com/khansahab9373"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="
                hover:text-gray-900 dark:hover:text-white
                hover:-translate-y-1
                transition-all duration-200
              "
            >
              <Github size={18} />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm break-all">
            <Mail size={14} />
            abdulrahmankhan9373@gmail.com
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-200 dark:border-zinc-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} BooksMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
