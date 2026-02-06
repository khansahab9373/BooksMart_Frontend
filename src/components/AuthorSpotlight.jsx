import { Link } from "react-router-dom";
import useRandomBooks from "../hooks/useRandomBooks";

const AuthorSpotlight = () => {
  const { books, loading, error } = useRandomBooks(1);

  if (loading) return null;
  if (error) return null;

  const book = books[0];

  return (
    <section className="mt-24">
      <div
        className="
          max-w-6xl mx-auto
          rounded-3xl
          p-10 md:p-14
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border border-gray-200 dark:border-gray-700
          shadow-lg
          flex flex-col md:flex-row
          items-center gap-12
        "
      >
        {/* AUTHOR IMAGE (book image as avatar) */}
        <div className="flex-shrink-0">
          <img
            src={book.url}
            alt={book.author}
            className="
              w-44 h-44
              rounded-full
              object-cover
              shadow-xl
            "
          />
        </div>

        {/* AUTHOR INFO */}
        <div className="text-center md:text-left space-y-4">
          <span className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Author Spotlight
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {book.author}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
            {book.desc.slice(0, 160)}...
          </p>

          <Link
            to={`/all-books?author=${encodeURIComponent(book.author)}`}
            className="
              inline-block mt-3
              px-6 py-3 rounded-xl
              bg-gray-900 text-white
              dark:bg-white dark:text-black
              font-semibold
              hover:opacity-90 transition
            "
          >
            Explore Author’s Books
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthorSpotlight;
