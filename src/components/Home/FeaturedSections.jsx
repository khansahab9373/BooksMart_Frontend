import { Link } from "react-router-dom";
import useRandomBooks from "../../hooks/useRandomBooks";

const FeaturedSections = () => {
  const { books, loading, error } = useRandomBooks(4); // 4 sections

  if (loading) {
    return (
      <div className="mt-24 text-center text-gray-500">
        Loading featured books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-24 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="mt-24 space-y-24">
      {books.map((book, index) => (
        <div
          key={book._id}
          className={`
            max-w-7xl mx-auto
            rounded-3xl
            px-8 py-12 md:px-14
            flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }
            items-center gap-12
            bg-gray-100 dark:bg-gray-800
            shadow-lg
          `}
        >
          {/* IMAGE (url) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={book.url}
              alt={book.title}
              className="
                w-64 md:w-72
                rounded-xl
                shadow-xl
                hover:scale-105
                transition-transform duration-300
              "
            />
          </div>

          {/* CONTENT */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <span className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Featured Book · {book.language}
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              {book.title}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              by <span className="font-medium">{book.author}</span>
            </p>

            <p className="text-gray-700 dark:text-gray-300 max-w-xl">
              {book.desc.slice(0, 160)}...
            </p>

            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{book.price}
            </div>

            <div className="flex gap-4 justify-center md:justify-start pt-2">
              <Link
                to={`/view-book-details/${book._id}`}
                className="
                  px-6 py-3 rounded-xl
                  bg-gray-900 text-white
                  dark:bg-white dark:text-black
                  font-semibold
                  hover:opacity-90 transition
                "
              >
                View Book
              </Link>

              <Link
                to="/cart"
                className="
                  px-6 py-3 rounded-xl
                  border border-gray-400 dark:border-gray-600
                  hover:bg-gray-200 dark:hover:bg-white/10
                  transition
                "
              >
                Add to Cart
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedSections;
