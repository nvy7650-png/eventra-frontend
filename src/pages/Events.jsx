import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

export default function Events() {

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

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        px-6
        py-10
      "
    >

      <h1
        className="
          text-4xl
          font-black
          mb-8
        "
      >
        Tất cả sự kiện
      </h1>

      <div
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {events.map(
          (event) => (

            <div
              key={event.id}
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                overflow-hidden
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

                <h2
                  className="
                    text-xl
                    font-bold
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

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}
