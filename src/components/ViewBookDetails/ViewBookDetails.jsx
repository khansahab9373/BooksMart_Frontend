import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import Loader from "../Loader/Loader";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../../assets/baseURL";

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

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
        { headers }
      );

      // SweetAlert for success
      Swal.fire("Added to Favourites", response.data.message, "success");
    } catch (error) {
      console.error("Error adding to favourites:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the book to favourites.",
      });
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/add-to-cart`,
        {},
        { headers }
      );

      // SweetAlert for success
      Swal.fire("Added to Cart", response.data.message, "success");
    } catch (error) {
      console.error("Error adding to cart:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the book to cart.",
      });
    }
  };

  const deleteBook = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this book?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${BaseULR}api/v1/delete-book`, {
            headers,
          });

          // SweetAlert for success
          Swal.fire("Deleted", response.data.message, "success");
          navigate("/all-books");
        } catch (error) {
          console.error("Error deleting book:", error);

          // SweetAlert for error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the book.",
          });
        }
      }
    });
  };

  if (!Data) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 md:px-12 py-8 bg-white dark:bg-gray-900 flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-3/6">
          <div className="flex flex-col lg:flex-row justify-around bg-gray-100 dark:bg-zinc-800 p-12 rounded">
            <img
              src={Data.url}
              alt=""
              className="h-[70vh] md:h-[60vh] lg:h-[70vh] rounded"
            />

            {isLoggedIn === true && role === "user" && (
              <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
                <button
                  className="text-white rounded lg:rounded-full text-3xl p-3 bg-red-500 flex items-center justify-center"
                  onClick={handleFavourite}
                >
                  <FaHeart />
                  <span className="ms-4 block lg:hidden">Favourites</span>
                </button>
                <button
                  className="text-white rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 bg-blue-500 flex items-center justify-center"
                  onClick={handleCart}
                >
                  <FaShoppingCart />
                  <span className="ms-4 block lg:hidden">Add to cart</span>
                </button>
              </div>
            )}

            {isLoggedIn === true && role === "admin" && (
              <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
                <Link
                  to={`/updateBook/${id}`}
                  className="text-black dark:text-white rounded lg:rounded-full text-3xl p-3 bg-white dark:bg-gray-700 flex items-center justify-center"
                >
                  <FaEdit />
                  <span className="ms-4 block lg:hidden">Edit</span>
                </Link>
                <button
                  className="text-red-600 rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 bg-white dark:bg-gray-700 flex items-center justify-center"
                  onClick={deleteBook}
                >
                  <MdDeleteOutline />
                  <span className="ms-4 block lg:hidden">Delete Book</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 w-full lg:w-3/6">
          <h1 className="text-4xl text-gray-800 dark:text-yellow-100 font-semibold">
            {Data.title}
          </h1>
          <p className="text-gray-600 dark:text-zinc-300 mt-1">
            by {Data.author}
          </p>
          <p className="text-gray-500 dark:text-zinc-400 mt-4 text-xl">
            {Data.desc}
          </p>
          <p className="flex mt-4 items-center justify-start text-gray-400 dark:text-zinc-500">
            <GrLanguage className="me-3" />
            {Data.language}
          </p>
          <p className="mt-4 text-gray-900 dark:text-white text-3xl font-semibold">
            Price: ₹ {Data.price}
          </p>
        </div>
      </div>
    </>
  );
};

export default ViewBookDetails;
