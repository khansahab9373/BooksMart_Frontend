import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import Loader from "../Loader/Loader";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import BaseULR from "../../assets/baseURL";
import { addToCart } from "../../store/cart";

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${BaseULR}api/v1/get-book-by-id/${id}`);
      setData(response.data.data);
    };
    fetch();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/add-book-to-favourite`,
        {},
        { headers },
      );
      Swal.fire("Added to Favourites", response.data.message, "success");
    } catch {
      Swal.fire("Error", "Failed to add to favourites.", "error");
    }
  };

  const handleCart = async () => {
    const existing = cartItems.find((item) => item._id === Data._id);

    if (existing) {
      const result = await Swal.fire({
        title: "Book already in cart",
        text: `You have ${existing.quantity} of this book. Add another?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, add one more",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await axios.put(`${BaseULR}api/v1/add-to-cart`, {}, { headers });
      dispatch(addToCart(Data));
      Swal.fire(
        "Added to Cart",
        existing ? "Quantity increased!" : "Book added successfully!",
        "success",
      );
    } catch {
      Swal.fire("Error", "Failed to add book to cart.", "error");
    }
  };

  const deleteBook = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this book?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${BaseULR}api/v1/delete-book`, {
        headers,
      });
      Swal.fire("Deleted", response.data.message, "success");
      navigate("/all-books");
    } catch {
      Swal.fire("Error", "Failed to delete the book.", "error");
    }
  };

  if (!Data) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const hasDiscount =
    Data.discountPrice &&
    Data.discountPrice > 0 &&
    Data.discountPrice < Data.price;

  const discountPercentage = hasDiscount
    ? Math.round(((Data.price - Data.discountPrice) / Data.price) * 100)
    : 0;

  return (
    <div className="px-4 sm:px-6 md:px-12 py-6 bg-white dark:bg-gray-900 flex flex-col lg:flex-row gap-8">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col items-center bg-gray-100 dark:bg-zinc-800 p-8 md:p-12 rounded">

          <img
            src={Data.url}
            alt={`${Data.title} cover`}
            className="w-full max-w-sm md:h-[60vh] object-contain rounded"
          />

          {/* USER BUTTONS */}
          {isLoggedIn && role === "user" && (
            <div className="flex flex-col gap-4 mt-6 w-full max-w-sm">
              <button
                className="text-white rounded-lg text-lg py-3 bg-red-500 flex items-center justify-center gap-2"
                onClick={handleFavourite}
              >
                <FaHeart />
                Favourites
              </button>

              <button
                className="text-white rounded-lg text-lg py-3 bg-blue-500 flex items-center justify-center gap-2"
                onClick={handleCart}
              >
                <FaShoppingCart />
                Add to cart
              </button>
            </div>
          )}

          {/* ADMIN BUTTONS */}
          {isLoggedIn && role === "admin" && (
            <div className="flex flex-col gap-4 mt-6 w-full max-w-sm">
              <Link
                to={`/updateBook/${id}`}
                className="text-black dark:text-white rounded-lg text-lg py-3 bg-white dark:bg-gray-700 flex items-center justify-center gap-2"
              >
                <FaEdit />
                Edit
              </Link>

              <button
                className="text-red-600 rounded-lg text-lg py-3 bg-white dark:bg-gray-700 flex items-center justify-center gap-2"
                onClick={deleteBook}
              >
                <MdDeleteOutline />
                Delete Book
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE DETAILS */}
      <div className="w-full lg:w-1/2 p-4">
        <h1 className="text-4xl text-gray-800 dark:text-yellow-100 font-semibold">
          {Data.title}
        </h1>

        <p className="text-gray-600 dark:text-zinc-300 mt-2">
          by {Data.author}
        </p>

        <p className="text-gray-500 dark:text-zinc-400 mt-4 text-lg">
          {Data.desc}
        </p>

        <p className="flex mt-4 items-center text-gray-400 dark:text-zinc-500">
          <GrLanguage className="me-3" />
          {Data.language}
        </p>

        {/* PRICE */}
        <div className="mt-6">
          {hasDiscount ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-400 line-through text-xl">
                ₹ {Data.price}
              </span>

              <span className="text-green-500 text-3xl font-bold">
                ₹ {Data.discountPrice}
              </span>

              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {discountPercentage}% OFF
              </span>
            </div>
          ) : (
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">
              ₹ {Data.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBookDetails;
