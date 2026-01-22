import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import BaseULR from "../assets/baseURL";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const AllBooks = () => {
  const [originalData, setOriginalData] = useState([]);
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("search") || "").trim();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BaseULR}api/v1/get-all-books`);
        const all = response.data.data || [];
        setOriginalData(all);
        setData(all);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Filter client-side when `search` param changes or when data is loaded
  useEffect(() => {
    const q = (searchParams.get("search") || "").trim().toLowerCase();
    if (!q) {
      setData(originalData);
      return;
    }
    const filtered = originalData.filter((b) =>
      (b.title || "").toLowerCase().includes(q),
    );
    setData(filtered);
  }, [searchParams, originalData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center justify-center">
      {/* <div className="bg-gray-100 dark:bg-zinc-800 h-auto px-4 sm:px-8 py-8 rounded-lg shadow-lg overflow-hidden w-full max-w-7xl"> */}
<div className="bg-gray-100 dark:bg-zinc-800 h-auto px-4 sm:px-8 py-8 rounded-lg shadow-lg overflow-hidden w-full">

        <h4 className="text-3xl text-gray-800 dark:text-yellow-100 font-semibold">
          All Books
        </h4>
        {loading && (
          <div className="w-full h-64 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {error && (
          <div className="my-6">
            <Card className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-lg text-gray-700 dark:text-zinc-200 mb-3">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mx-auto"
              >
                Retry
              </Button>
            </Card>
          </div>
        )}
        {!loading && !error && (
          <>
            {Data && Data.length === 0 ? (
              <div className="my-8">
                <Card className="text-center py-12">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-lg text-gray-700 dark:text-zinc-200 mb-4">
                    No books available yet.
                  </p>
                  <Link to="/">
                    <Button className="mx-auto">Browse Home</Button>
                  </Link>
                </Card>
              </div>
            ) : (
              <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Data &&
                  Data.map((items, i) => (
                    <div key={i} className="h-full">
                      <BookCard data={items} highlightQuery={q} />
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
