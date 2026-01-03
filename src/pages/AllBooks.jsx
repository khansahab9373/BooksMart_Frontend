import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import BaseULR from "../assets/baseURL";

const AllBooks = () => {
  const [Data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${BaseULR}api/v1/get-all-books`);
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center justify-center">
      <div className="bg-gray-100 dark:bg-zinc-800 h-auto px-12 py-8 rounded-lg shadow-lg">
        <h4 className="text-3xl text-gray-800 dark:text-yellow-100 font-semibold">
          All Books
        </h4>
        {!Data && (
          <div className="w-full h-screen flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div className="my-8 grid grid-cols-1 sd:grid-cols-3 md:grid-cols-4 gap-8">
          {Data &&
            Data.map((items, i) => (
              <div key={i}>
                <BookCard data={items} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
