import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate
} from "react-router-dom";

export default function CategoryBar() {

  const navigate = useNavigate();

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
  onClick={() =>
    navigate(
      `/events?category=${category.id}`
    )
  }
  className="
    px-5
    py-2
    rounded-2xl
    bg-white/5
    border
    border-white/10
    hover:bg-sky-500
    hover:text-black
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