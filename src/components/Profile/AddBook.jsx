import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BaseULR from "../../assets/baseURL";

const AddBook = () => {
  const [data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    discountPrice: "",
    desc: "",
    language: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async () => {
    try {
      /* ===========================
            BASIC REQUIRED VALIDATION
      =========================== */
      if (
        !data.url ||
        !data.title ||
        !data.author ||
        !data.price ||
        !data.desc ||
        !data.language
      ) {
        return Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "All required fields must be filled!",
        });
      }

      const price = Number(data.price);
      let discountPrice = Number(data.discountPrice);

      if (price <= 0) {
        return Swal.fire({
          icon: "error",
          title: "Invalid Price",
          text: "Price must be greater than 0",
        });
      }

      /* ===========================
            DISCOUNT VALIDATION
      =========================== */
      if (!discountPrice || discountPrice <= 0) {
        discountPrice = 0; // treat as no discount
      }

      if (discountPrice >= price) {
        return Swal.fire({
          icon: "error",
          title: "Invalid Discount",
          text: "Discount price must be less than original price",
        });
      }

      await axios.post(
        `${BaseULR}api/v1/add-book`,
        {
          ...data,
          price,
          discountPrice,
        },
        { headers }
      );

      setData({
        url: "",
        title: "",
        author: "",
        price: "",
        discountPrice: "",
        desc: "",
        language: "",
      });

      Swal.fire({
        icon: "success",
        title: "Book Added Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while adding the book.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
        Add Book
      </h1>

      <div className="p-6 bg-gray-100 dark:bg-zinc-800 rounded-xl shadow-lg max-w-3xl mx-auto">

        {/* Image URL */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Image URL</label>
          <input
            type="text"
            name="url"
            value={data.url}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Image URL"
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Book Title"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={data.author}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Author Name"
          />
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Language</label>
          <input
            type="text"
            name="language"
            value={data.language}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Language"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Price"
          />
        </div>

        {/* Discount Price */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Discount Price (Optional)
          </label>
          <input
            type="number"
            name="discountPrice"
            value={data.discountPrice}
            onChange={change}
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Discount Price"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="desc"
            value={data.desc}
            onChange={change}
            rows="4"
            className="w-full p-2 rounded bg-gray-200 dark:bg-zinc-900"
            placeholder="Enter Description"
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Add Book
        </button>
      </div>
    </div>
  );
};

export default AddBook;
