import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import BaseURL from "../../assets/baseURL";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BaseURL}api/v1/get-favourite-books`,
          { headers },
        );
        setFavouriteBooks(response.data.data || []);
      } catch (err) {
        console.error("Error fetching favourite books:", err);
        setError("Failed to load favourites. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // Removed dependency on FavouriteBooks to avoid infinite re-renders

  // Function to remove a book from the list after it's removed from favourites
  const handleRemoveBook = (bookId) => {
    setFavouriteBooks(FavouriteBooks.filter((book) => book._id !== bookId));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {loading && (
        <div className="w-full h-48 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-gray-700 dark:text-zinc-200 mb-3">{error}</p>
              <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {!loading && !error && FavouriteBooks && FavouriteBooks.length === 0 && (
        <div className="min-h-[60vh] p-4 flex items-center justify-center">
          <Card className="text-center py-12">
            <div className="text-4xl mb-3">⭐</div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-200">
              No favourites yet
            </h2>
            <p className="text-gray-600 dark:text-zinc-300 mt-2">
              Save books you love to find them quickly.
            </p>
            <div className="mt-4">
              <Link to="/all-books">
                <Button>Browse Books</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && FavouriteBooks && FavouriteBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FavouriteBooks.map((item) => (
            <div key={item._id} className="h-full">
              <BookCard
                data={item}
                favourite={true}
                onRemove={handleRemoveBook} // Pass the onRemove function
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
