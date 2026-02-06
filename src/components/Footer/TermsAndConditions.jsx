import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Terms & Conditions
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Please read these terms carefully before using the BooksMart platform.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* INTRO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to BooksMart
          </h2>
          <p>
            These Terms & Conditions govern your access to and use of the
            BooksMart website and services. By using our platform, you agree
            to comply with these terms.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1519682337058-a94d519337bc"
          alt="Reading books"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* USER ACCOUNTS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Accounts
          </h2>
          <p>
            To access certain features, you may need to create an account.
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Keep your account secure</li>
            <li>Do not share your password</li>
          </ul>
        </div>

        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
          alt="Account security"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* ORDERS & PAYMENTS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders & Payments
          </h2>
          <p>
            All orders placed on BooksMart are subject to acceptance and
            availability. Payments must be completed before order processing.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Secure online payment gateways</li>
            <li>Prices may change without notice</li>
            <li>Order cancellation depends on status</li>
          </ul>
        </div>

        <img
          src="https://images.unsplash.com/photo-1556740772-1a741367b93e"
          alt="Online payment"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* RETURNS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Returns & Refunds
          </h2>
          <p>
            If you are not satisfied with your purchase, you may request a
            return or refund according to our policy.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
          alt="Customer support"
          className="rounded-xl shadow-md w-full object-cover max-h-[400px]"
        />

        {/* CONTACT */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-gray-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Us
          </h2>
          <p className="mb-2">
            If you have any questions about these Terms & Conditions, feel free
            to contact us.
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

export default TermsAndConditions;
