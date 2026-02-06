import React from "react";
import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";

import WhyBooksMart from "../components/WhyBooksMart";
import AuthorSpotlight from "../components/AuthorSpotlight";
import FeaturedSections from "../components/Home/FeaturedSections";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-10 py-8">
      <Hero />
      <RecentlyAdded />
      <FeaturedSections />
      <AuthorSpotlight /> {/* human touch */}
      <WhyBooksMart /> {/* trust & brand */}
    </div>
  );
}

export default Home;
