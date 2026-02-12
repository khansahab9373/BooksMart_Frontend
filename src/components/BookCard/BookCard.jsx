import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";
import BaseULR from "../../assets/baseURL";
import Card from "../ui/Card";
import { addToCart } from "../../store/cart";

const BookCard = ({ data, favourite, onRemove, highlightQuery = "" }) => {
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  const headers = {
    id: localStorage.getItem("id"),
    bookid: data._id,
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  /* ===============================
        REMOVE FROM FAVOURITE
  =============================== */
  const handleRemoveBook = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${BaseULR}api/v1/remove-book-from-favourite`,
        {},
        { headers }
      );

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: response.data.message,
        timer: 1200,
        showConfirmButton: false,
      });

      if (onRemove) onRemove(data._id);
    } catch {
      Swal.fire("Error", "Failed to remove book.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
          ADD TO CART
  =============================== */
  const handleAddToCart = async () => {
    try {
      setAdding(true);

      const response = await axios.put(
        `${BaseULR}api/v1/add-to-cart`,
        {},
        { headers }
      );

      dispatch(addToCart(data));

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: response.data.message,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "Failed to add book to cart.", "error");
    } finally {
      setAdding(false);
    }
  };

  /* ===============================
          SEARCH HIGHLIGHT
  =============================== */
  const escapeRegExp = (s) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const renderHighlighted = (text, query) => {
    if (!query) return text;

    const q = query.toString();
    const parts = text.split(
      new RegExp(`(${escapeRegExp(q)})`, "i")
    );

    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded"
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  /* ===============================
            DISCOUNT LOGIC
  =============================== */
  const hasDiscount =
  Number(data.discountPrice) > 0 &&
  Number(data.discountPrice) < Number(data.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((data.price - data.discountPrice) / data.price) * 100
      )
    : null;

  /* ===============================
              UI
  =============================== */
  return (
    <Card className="bg-white dark:bg-zinc-900 p-4 flex flex-col justify-between h-full rounded-2xl shadow-md hover:shadow-lg transition">

      <Link to={`/view-book-details/${data._id}`} className="flex-1">
        <div className="flex flex-col h-full">

          {/* IMAGE */}
          <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={data.url}
              alt={data.title}
              className="h-44 md:h-[25vh] object-contain"
            />

            {hasDiscount && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                SALE
              </span>
            )}
          </div>

          {/* TITLE */}
          <h2 className="mt-4 text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
            {renderHighlighted(data.title || "", highlightQuery)}
          </h2>

          {/* AUTHOR */}
          <p className="mt-1 text-gray-500 dark:text-zinc-400 text-sm">
            {data.author}
          </p>

          {/* PRICE */}
          <div className="mt-2">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-400 line-through text-sm">
                  ₹{data.price}
                </span>

                <span className="text-green-500 font-bold text-lg">
                  ₹{data.discountPrice}
                </span>

               {discountPercentage !== null && discountPercentage > 0 && (

                  <span className="text-red-500 text-xs font-semibold">
                    ({discountPercentage}% OFF)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-800 dark:text-white font-bold text-lg">
                ₹{data.price}
              </span>
            )}
          </div>

          <p className="mt-1 text-green-500 text-sm font-medium">
            In Stock
          </p>

        </div>
      </Link>

      {/* ADD TO CART BUTTON */}
      {isLoggedIn && role === "user" && !favourite && (
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition
                     bg-gray-200 text-black hover:bg-gray-300
                     dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          <FaShoppingCart />
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      )}

      {/* REMOVE FAVOURITE */}
      {favourite && (
        <button
          onClick={handleRemoveBook}
          disabled={loading}
          className={`mt-4 w-full py-3 rounded-xl font-semibold transition
                     bg-red-500 text-white hover:bg-red-600
                     ${loading ? "opacity-60" : ""}`}
        >
          {loading ? "Removing..." : "Remove From Favourite"}
        </button>
      )}

    </Card>
  );
};

export default BookCard;
