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

const [search, setSearch] =
  useState("");

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

  useEffect(() => {

    let url =
      `${import.meta.env.VITE_API_URL}/api/events`;

    if (categoryId) {

      url +=
        `?category=${categoryId}`;

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

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Tìm sự kiện..."
          className="
            px-5
            py-3
            rounded-2xl
            bg-[#111827]
            border
            border-white/10
            outline-none
            w-full
            md:w-80
          "
        />

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

          .filter((event) =>

            event.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

          )

          .map((event) => (

            <div
              key={event.id}
              onClick={() =>
                navigate(
                  `/events/${event.id}`
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
  src={
    `${import.meta.env.VITE_API_URL}${event.image_url}`
  }
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
