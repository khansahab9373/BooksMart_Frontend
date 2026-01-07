import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5 ${className}`}
    >
      {children}
    </div>
  );
}
