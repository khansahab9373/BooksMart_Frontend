import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BaseULR from "../assets/baseURL";

const UpdateBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    discountPrice: "",
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

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

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
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "All required fields must be filled!",
        });
        return;
      }

      const price = Number(Data.price);
      const discountPrice = Data.discountPrice
        ? Number(Data.discountPrice)
        : 0;

      if (discountPrice > price) {
        Swal.fire({
          icon: "error",
          title: "Invalid Discount",
          text: "Discount price cannot be greater than original price!",
        });
        return;
      }

      const response = await axios.put(
        `${BaseULR}api/v1/update-book`,
        {
          ...Data,
          price,
          discountPrice,
        },
        { headers },
      );

      Swal.fire({
        icon: "success",
        title: "Book Updated",
        text: response.data.message,
      });

      navigate(`/view-book-details/${id}`);
    } catch (error) {
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
          `${BaseULR}api/v1/get-book-by-id/${id}`,
        );

        setData({
          ...response.data.data,
          discountPrice: response.data.data.discountPrice || "",
        });
      } catch (error) {
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
      <h1 className="text-3xl md:text-5xl font-semibold mb-8">
        Update Book
      </h1>

      <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">

        {/* Image URL */}
        <div className="mb-4">
          <label className="block mb-2">Image URL</label>
          <input
            type="text"
            name="url"
            value={Data.url}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={Data.title}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={Data.author}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="block mb-2">Language</label>
          <input
            type="text"
            name="language"
            value={Data.language}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={Data.price}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* 🔥 Fixed Discount Price */}
        <div className="mb-4">
          <label className="block mb-2">
            Discount Price (Optional)
          </label>
          <input
            type="number"
            name="discountPrice"
            value={Data.discountPrice}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="desc"
            value={Data.desc}
            onChange={change}
            rows="4"
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;
