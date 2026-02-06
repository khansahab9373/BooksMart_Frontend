import { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../assets/baseURL";

// Fisher–Yates shuffle (better than sort)
const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const useRandomBooks = (count = 3) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${BaseURL}api/v1/get-all-books`);
        const allBooks = res.data?.data || [];

        const shuffled = shuffleArray(allBooks);
        setBooks(shuffled.slice(0, count));
      } catch (err) {
        console.error(err);
        setError("Failed to load featured books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [count]);

  return { books, loading, error };
};

export default useRandomBooks;
