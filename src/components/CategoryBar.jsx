import {
  useEffect,
  useState,
} from "react";

export default function CategoryBar() {

  const [categories,
    setCategories] =
    useState([]);

  // GET CATEGORIES
  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/categories`
    )

      .then((res) => res.json())

      .then((data) => {

        setCategories(data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // ICONS
  const getCategoryIcon = (name) => {

    const lower =
      name.toLowerCase();

    if (
      lower.includes("âm nhạc")
    ) return "🎤";

    if (
      lower.includes("công nghệ")
    ) return "💻";

    if (
      lower.includes("workshop")
    ) return "🎓";

    if (
      lower.includes("thể thao")
    ) return "⚽";

    if (
      lower.includes("festival")
    ) return "🎉";

    return "🔥";

  };

  return (

    <div
      className="
        border-t
        border-white/10
        bg-[#081120]
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
          px-6
          py-4
          flex
          gap-4
          overflow-x-auto
          scrollbar-hide
        "
      >

        {/* HOT */}
        <button
          className="
            px-5
            py-2
            rounded-2xl
            bg-sky-500
            text-black
            font-semibold
            whitespace-nowrap
            hover:bg-sky-400
            transition
          "
        >
          🔥 Nổi bật
        </button>

        {/* CATEGORIES */}
        {categories.map((category) => (

          <button
            key={category.id}
            className="
              px-5
              py-2
              rounded-2xl
              bg-white/5
              border
              border-white/10
              hover:bg-white/10
              text-gray-300
              whitespace-nowrap
              transition
            "
          >

            {getCategoryIcon(
              category.name
            )}{" "}

            {category.name}

          </button>

        ))}

      </div>

    </div>

  );

}