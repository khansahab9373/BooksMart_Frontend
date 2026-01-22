import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../components/Loader/Loader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseULR from "../assets/baseURL";
import { useDispatch, useSelector } from "react-redux";
import { setCart, removeFromCart } from "../store/cart";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // ✅ Fetch cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseULR}api/v1/get-user-cart`, {
        headers,
      });

      const data = res.data.data || [];

      dispatch(setCart(data));

      // 🔥 IMPORTANT: data mil gaya → error clear
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate total
  useEffect(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += item.price;
    });
    setTotal(sum);
  }, [cartItems]);

  // ✅ Delete item
  const deleteItem = async (bookid) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this book from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `${BaseULR}api/v1/remove-from-cart/${bookid}`,
        {},
        { headers },
      );

      dispatch(removeFromCart(bookid));

      Swal.fire("Removed", "Book removed from cart.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to remove book.", "error");
    }
  };

  const placeOrder = async () => {
    const result = await Swal.fire({
      title: "Place order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(
        `${BaseULR}api/v1/place-order`,
        { order: cartItems },
        { headers },
      );

      Swal.fire("Success", "Order placed successfully", "success");
      navigate("/profile/orderHistory");
    } catch (err) {
      Swal.fire("Error", "Failed to place order", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-12 py-8">
      {/* Loader */}
      {loading && (
        <div className="w-full h-64 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Error ONLY if cart empty */}
      {!loading && error && cartItems.length === 0 && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="text-center p-6">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-lg mb-4">{error}</p>
              <Button onClick={fetchCart}>Retry</Button>
            </Card>
          </div>
        </div>
      )}

      {/* Empty Cart */}
      {!loading && !error && cartItems.length === 0 && (
        <div className="h-screen flex items-center justify-center">
          <Card className="p-12 text-center">
            <div className="text-5xl mb-3">🛒</div>
            <h1 className="text-3xl font-semibold mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-4">
              Add books to your cart to get started.
            </p>
            <Button onClick={() => navigate("/all-books")}>Browse Books</Button>
          </Card>
        </div>
      )}

      {/* Cart Items */}
      {!loading && cartItems.length > 0 && (
        <>
          <h1 className="text-5xl font-semibold text-gray-800 dark:text-zinc-400 mb-10">
            Your Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT: Cart List */}
            <div className="w-full lg:w-3/4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="w-full mb-6 rounded-lg flex flex-col md:flex-row p-6
                bg-gray-100 dark:bg-zinc-800 justify-between items-center"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-[18vh] md:h-[12vh] object-cover rounded"
                  />

                  <div className="flex-1 md:px-6 mt-4 md:mt-0">
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <p className="text-gray-600 dark:text-zinc-300 mt-2 hidden md:block">
                      {item.desc.slice(0, 100)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <h2 className="text-3xl font-semibold">₹{item.price}</h2>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="bg-red-100 text-red-700 border border-red-600
                    rounded p-2 hover:bg-red-200 transition"
                    >
                      <AiFillDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Total Box */}
            <div className="w-full lg:w-1/4 h-fit">
              <Card className="p-6 bg-gray-100 dark:bg-zinc-800">
                <h2 className="text-3xl font-semibold mb-4">Total Amount</h2>

                <div className="flex justify-between text-xl mb-4">
                  <span>{cartItems.length} books</span>
                  <span>₹{total}</span>
                </div>

                <Button
                  className="w-full bg-gray-800 dark:bg-white
                text-white dark:text-black font-semibold"
                  onClick={placeOrder}
                >
                  Place your order
                </Button>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
