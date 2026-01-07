import React from "react";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary/95 focus-visible:ring-2 focus-visible:ring-primary/40",
  secondary:
    "bg-secondary text-white hover:bg-secondary/95 focus-visible:ring-2 focus-visible:ring-secondary/40",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 min-h-[44px] transition-all duration-150 ease-in-out focus:outline-none";
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const disabledClasses =
    disabled || loading ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`${base} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {loading
        ? typeof children === "string"
          ? `${children}`
          : children
        : children}
    </button>
  );
}
