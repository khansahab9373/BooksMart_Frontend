import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../components/Loader/Loader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../assets/baseURL";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch cart data
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BaseULR}api/v1/get-user-cart`, {
        headers,
      });
      setCart(res.data.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch cart data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update total amount whenever Cart changes
  useEffect(() => {
    if (Cart && Cart.length > 0) {
      let total = 0;
      Cart.map((items) => {
        total += items.price;
      });
      setTotal(total);
      total = 0;
    }
  }, [Cart]);

  // Delete item from cart
  const deleteItem = async (bookid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this book from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `${BaseULR}api/v1/remove-from-cart/${bookid}`,
            {},
            { headers }
          );

          // SweetAlert for success
          Swal.fire(
            "Removed",
            "The book has been removed from your cart.",
            "success"
          );

          fetchCart(); // Refresh cart data
        } catch (error) {
          console.error("Error removing book from cart:", error);

          // SweetAlert for error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while removing the book.",
          });
        }
      }
    });
  };

  const PlaceOrder = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to place the order for all items in your cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${BaseULR}api/v1/place-order`,
            { order: Cart },
            { headers }
          );

          // SweetAlert for success
          Swal.fire("Order Placed", response.data.message, "success");

          navigate("/profile/orderHistory");
        } catch (error) {
          console.error("Error placing order:", error);

          // SweetAlert for error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while placing the order.",
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-12 py-8">
      {loading && (
        <div className="w-full h-64 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-lg text-gray-700 dark:text-zinc-200 mb-3">
                {error}
              </p>
              <div className="flex justify-center">
                <Button onClick={fetchCart}>Retry</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {!loading && !error && Cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <Card className="p-12 text-center">
              <div className="text-5xl mb-3">🛒</div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-zinc-400">
                Your cart is empty
              </h1>
              <p className="text-gray-600 dark:text-zinc-300 mt-2">
                Add books to your cart to get started.
              </p>
              <div className="mt-4">
                <Button onClick={() => (window.location.href = "/all-books")}>
                  Browse Books
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
      {!loading && Cart.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-gray-800 dark:text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Cart.map((items, i) => (
            <div
              key={i}
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-gray-100 dark:bg-zinc-800 justify-between items-center"
            >
              <img
                src={items.url}
                alt={`${items.title} cover`}
                className="h-[20vh] md:h-[10vh] object-cover"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-2xl text-gray-800 dark:text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                  {items.title}
                </h1>
                <p className="text-normal text-gray-600 dark:text-zinc-300 mt-2 hidden lg:block">
                  {items.desc.slice(0, 100)}...
                </p>
                <p className="text-normal text-gray-600 dark:text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {items.desc.slice(0, 65)}...
                </p>
                <p className="text-normal text-gray-600 dark:text-zinc-300 mt-2 block md:hidden">
                  {items.desc.slice(0, 100)}...
                </p>
              </div>
              <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-gray-800 dark:text-zinc-100 text-3xl font-semibold flex">
                  ₹{items.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ml-12 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                  onClick={() => deleteItem(items._id)}
                  aria-label={`Remove ${items.title} from cart`}
                >
                  <AiFillDelete aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {Cart.length > 0 && (
        <div className="mt-4 w-full flex items-center justify-end">
          <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded">
            <h1 className="text-3xl text-gray-800 dark:text-zinc-200 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between text-xl text-gray-800 dark:text-zinc-200">
              <h2>{Cart.length} books</h2>
              <h2>₹{Total}</h2>
            </div>
            <div className="w-[100%] mt-3">
              <Button
                className="bg-gray-800 dark:bg-zinc-100 text-white dark:text-black rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-gray-900 dark:hover:bg-zinc-900"
                onClick={PlaceOrder}
                aria-label="Place your order"
              >
                Place your order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
