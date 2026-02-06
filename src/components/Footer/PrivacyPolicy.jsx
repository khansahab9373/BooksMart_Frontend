import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Your privacy is important to us. This policy explains how BooksMart
            collects and protects your data.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* INTRO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Introduction
          </h2>
          <p>
            This Privacy Policy describes how BooksMart collects, uses, and
            protects your personal information when you use our website and
            services.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87"
          alt="Data privacy and security"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* INFORMATION WE COLLECT */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Information We Collect
          </h2>
          <p>
            We may collect personal information such as your name, email
            address, phone number, and payment details when you use BooksMart.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Account information</li>
            <li>Order and payment details</li>
            <li>Device and usage information</li>
          </ul>
        </div>

        <img
          src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
          alt="Personal data protection"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* HOW WE USE DATA */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            How We Use Your Information
          </h2>
          <p>
            The information we collect is used to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Process orders and payments</li>
            <li>Improve our website and services</li>
            <li>Communicate with users</li>
            <li>Ensure platform security</li>
          </ul>
        </div>

        <img
          src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8"
          alt="Secure data usage"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* DATA SHARING */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Data Sharing & Security
          </h2>
          <p>
            BooksMart does not sell your personal information. Data may only be
            shared with trusted third-party services required for order
            fulfillment and payment processing.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1508780709619-79562169bc64"
          alt="Secure servers and privacy"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* USER RIGHTS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Rights
          </h2>
          <p>
            You have the right to access, update, or delete your personal
            information stored with BooksMart.
          </p>
        </div>

        {/* CONTACT */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-gray-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Us
          </h2>
          <p className="mb-2">
            If you have any questions about this Privacy Policy, you can contact
            us at:
          </p>
          <p className="font-medium">
            Email:{" "}
            <a
              href="mailto:abdulrahmankhan9373@gmail.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              abdulrahmankhan9373@gmail.com
            </a>
          </p>

          <Link
            to="/"
            className="inline-block mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

      </section>
    </div>
  );
};

export default PrivacyPolicy;
