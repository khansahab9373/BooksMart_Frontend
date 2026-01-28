import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseURL from "../../assets/baseURL";
import Card from "../ui/Card";
import Button from "../ui/Button";

const BookCard = ({ data, favourite, onRemove, highlightQuery = "" }) => {
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    bookid: data._id, // Add bookid from `data` to headers
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleRemoveBook = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BaseURL}api/v1/remove-book-from-favourite`,
        {}, // Empty body as headers contain data
        { headers },
      );
      console.log("Book removed from favourites:", response.data.message);

      // SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      // Notify the parent component to remove the book from the list
      if (onRemove) {
        onRemove(data._id); // Trigger parent function to update the list
      }
    } catch (error) {
      console.error("Error removing book from favourites:", error);

      // SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while removing the book.",
      });
    } finally {
      setLoading(false);
    }
  };

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const renderHighlighted = (text, query) => {
    if (!query) return text;
    const q = query.toString();
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "i"));
    return parts.map((part, i) => {
      if (part.toLowerCase() === q.toLowerCase()) {
        return (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-600 px-0.5">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Card className="bg-gray-100 dark:bg-zinc-800 p-4 flex flex-col justify-between h-full overflow-hidden">
      <Link to={`/view-book-details/${data._id}`} className="flex-1">
        <div className="flex flex-col h-full">
          <div className="bg-gray-200 dark:bg-zinc-900 rounded flex items-center justify-center overflow-hidden">
            <img
              src={data.url}
              alt={`${data.title} cover`}
              className="h-44 md:h-[25vh] object-contain"
            />
          </div>
          <h2 className="mt-4 text-xl text-gray-800 dark:text-white font-semibold">
            {renderHighlighted(data.title || "", highlightQuery)}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400 font-semibold">
            by {data.author}
          </p>
          <p className="mt-2 text-gray-600 dark:text-zinc-400 font-semibold text-xl">
            ₹ {data.price}
          </p>
        </div>
      </Link>

      {favourite && (
        <Button
          variant="secondary"
          onClick={handleRemoveBook}
          className={`mt-4 w-full ${loading ? "opacity-60" : ""}`}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove From Favourite"}
        </Button>
      )}
    </Card>
  );
};

export default BookCard;
