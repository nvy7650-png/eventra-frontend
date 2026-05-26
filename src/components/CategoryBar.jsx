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
        "
      >

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

            {category.name}

          </button>

        ))}

      </div>

    </div>

  );

}