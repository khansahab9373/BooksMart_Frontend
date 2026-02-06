import { BookOpen, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    title: "Curated Collection",
    desc: "Hand-picked books across genres to ensure quality and relevance.",
    icon: BookOpen,
  },
  {
    title: "Secure Payments",
    desc: "Your transactions are protected with industry-grade security.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    desc: "Get your favorite books delivered quickly at your doorstep.",
    icon: Truck,
  },
];

const WhyBooksMart = () => {
  return (
    <section className="mt-24">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Why Readers Love BooksMart
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Everything you need for a smooth and enjoyable reading experience.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((item, i) => (
          <div
            key={i}
            className="
              rounded-2xl
              p-8
              bg-gray-100 dark:bg-gray-800
              hover:shadow-xl
              transition
            "
          >
            <item.icon
              size={36}
              className="text-indigo-600 dark:text-indigo-400 mb-4"
            />

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyBooksMart;
