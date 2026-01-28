import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../assets/baseURL";

const UpdateBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  // Handle input change
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  // Submit function
  const submit = async () => {
    try {
      if (
        Data.url === "" ||
        Data.title === "" ||
        Data.author === "" ||
        Data.price === "" ||
        Data.desc === "" ||
        Data.language === ""
      ) {
        // SweetAlert for missing fields
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "All fields are required!",
        });
        return;
      } else {
        const response = await axios.put(`${BaseULR}api/v1/update-book`, Data, {
          headers,
        });
        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          desc: "",
          language: "",
        });

        // SweetAlert for success
        Swal.fire({
          icon: "success",
          title: "Book Updated",
          text: response.data.message,
        });

        navigate(`/view-book-details/${id}`);
      }
    } catch (error) {
      console.error("Error updating book:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while updating the book.",
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${BaseULR}api/v1/get-book-by-id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);

        // SweetAlert for error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch book details.",
        });
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
        Update Book
      </h1>

      <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-800 dark:text-zinc-100">
        {/* Image URL */}
        <div className="mb-4">
          <label
            htmlFor="url"
            className="text-gray-600 dark:text-zinc-400 block mb-2"
          >
            Image URL
          </label>
          <input
            id="url"
            type="text"
            className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
            placeholder="Enter Image URL"
            name="url"
            value={Data.url}
            onChange={change}
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="text-gray-600 dark:text-zinc-400 block mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
            placeholder="Enter Book Title"
            name="title"
            value={Data.title}
            onChange={change}
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label
            htmlFor="author"
            className="text-gray-600 dark:text-zinc-400 block mb-2"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
            placeholder="Enter Author Name"
            name="author"
            value={Data.author}
            onChange={change}
          />
        </div>

        {/* Flex Row: Language & Price */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="language"
              className="text-gray-600 dark:text-zinc-400 block mb-2"
            >
              Language
            </label>
            <input
              id="language"
              type="text"
              className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              placeholder="Enter Language"
              name="language"
              value={Data.language}
              onChange={change}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label
              htmlFor="price"
              className="text-gray-600 dark:text-zinc-400 block mb-2"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
              placeholder="Enter Price"
              name="price"
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="desc"
            className="text-gray-600 dark:text-zinc-400 block mb-2"
          >
            Description
          </label>
          <textarea
            id="desc"
            className="w-full bg-gray-200 dark:bg-zinc-900 text-black dark:text-zinc-100 p-2 outline-none rounded"
            rows="5"
            placeholder="Enter Description"
            name="desc"
            value={Data.desc}
            onChange={change}
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          onClick={submit}
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;
