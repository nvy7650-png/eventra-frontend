import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Events() {
    const navigate = useNavigate();

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchParams] =
    useSearchParams();

  const categoryId =
    searchParams.get(
      "category"
    );
    const keyword =
  searchParams.get(
    "keyword"
  );

    const [categories, setCategories] =
  useState([]);

  const [selectedCategory,
  setSelectedCategory] =
  useState(categoryId || "");

  const [priceFilter,
  setPriceFilter] =
  useState("");

  useEffect(() => {

  setSelectedCategory(
    categoryId || ""
  );

}, [selectedCategory]);

    useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/api/categories`
  )
    .then((res) =>
      res.json()
    )
    .then(setCategories);

}, []);
  useEffect(() => {

    let url =
      `${import.meta.env.VITE_API_URL}/api/events`;

    if (selectedCategory) {

  url +=
    `?category=${selectedCategory}`;

}

    fetch(url)
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setEvents(
          data || []
        );

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, [categoryId]);

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          text-white
          flex
          items-center
          justify-center
        "
      >
        Đang tải...
      </div>

    );

  }

  return (

  <div className="min-h-screen bg-[#050816] text-white">

    <Navbar />

    <div
      className="
        max-w-7xl
        mx-auto
        px-6
        py-10
      "
    >

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-8
        "
      >

        <h1
          className="
            text-4xl
            font-black
          "
        >
          Tất cả sự kiện
        </h1>

        <div
  className="
    flex
    flex-wrap
    gap-3
  "
>


  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(
        e.target.value
      )
    }
    className="
      px-5
      py-3
      rounded-2xl
      bg-[#111827]
      border
      border-white/10
    "
  >

    <option value="">
      Tất cả danh mục
    </option>

    {categories.map((c) => (

      <option
        key={c.id}
        value={c.id}
      >
        {c.name}
      </option>

    ))}

  </select>

  <select
    value={priceFilter}
    onChange={(e) =>
      setPriceFilter(
        e.target.value
      )
    }
    className="
      px-5
      py-3
      rounded-2xl
      bg-[#111827]
      border
      border-white/10
    "
  >

    <option value="">
      Tất cả giá vé
    </option>

    <option value="under100">
      Dưới 100.000đ
    </option>

    <option value="100-500">
      100.000đ - 500.000đ
    </option>

    <option value="over500">
      Trên 500.000đ
    </option>

  </select>

</div>

      </div>

      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {events

.filter((event) => {

const matchKeyword =

  !keyword ||

  event.title
    ?.toLowerCase()
    .includes(
      keyword.toLowerCase()
    );

  const matchCategory =

    !selectedCategory ||

    String(
      event.category_id
    ) ===
    String(
      selectedCategory
    );

  let matchPrice = true;

  if (
    priceFilter ===
    "under100"
  ) {

    matchPrice =
      event.min_price <
      100000;

  }

  if (
    priceFilter ===
    "100-500"
  ) {

    matchPrice =
      event.min_price >=
        100000 &&
      event.min_price <=
        500000;

  }

  if (
    priceFilter ===
    "over500"
  ) {

    matchPrice =
      event.min_price >
      500000;

  }

  return (
  matchKeyword &&
  matchCategory &&
  matchPrice
);

})

.map((event) => (

            <div
              key={event.id}
              onClick={() =>
                navigate(
                  `/event/${event.id}`
                )
              }
              className="
                cursor-pointer
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                overflow-hidden
                hover:border-sky-500
                transition
              "
            >

              <img
  src={event.image_url}
  alt={event.title}
  className="
    w-full
    h-56
    object-cover
  "
/>

              <div className="p-5">

                <p className="text-sky-400 text-sm">

                  {
                    event.category_name
                  }

                </p>

                <h2
                  className="
                    text-xl
                    font-bold
                    mt-2
                  "
                >
                  {event.title}
                </h2>

                <p
                  className="
                    text-gray-400
                    mt-2
                  "
                >
                  {event.location}
                </p>

                <p
                  className="
                    text-green-400
                    font-bold
                    mt-4
                  "
                >
                  Từ{" "}
                  {Number(
                    event.min_price || 0
                  ).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </p>

              </div>

            </div>

          ))}

      </div>

    </div>

  </div>

);

}
