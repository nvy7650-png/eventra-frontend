import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ChevronRight,
  Plus,
  LayoutDashboard,
} from "lucide-react";

export default function OrganizerEvents() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [events,
    setEvents] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // ============================
  // GET EVENTS
  // ============================

  useEffect(() => {

    fetch(

      `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`

    )

      .then((res) => res.json())

      .then((data) => {

        setEvents(data);

      })

      .catch((err) => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  // ============================
  // STATUS COLOR
  // ============================

  const getStatusColor = (
    status
  ) => {

    if (
      status ===
      "APPROVED"
    ) {

      return
        "bg-green-500/20 text-green-400";

    }

    if (
      status ===
      "PENDING"
    ) {

      return
        "bg-yellow-500/20 text-yellow-400";

    }

    if (
      status ===
      "CANCELLED"
    ) {

      return
        "bg-red-500/20 text-red-400";

    }

    if (
      status ===
      "DRAFT"
    ) {

      return
        "bg-sky-500/20 text-sky-400";

    }

    return
      "bg-gray-500/20 text-gray-300";

  };

  // ============================
  // LOADING
  // ============================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          flex
          items-center
          justify-center
          text-white
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

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-8
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-black
              "
            >
              Sự kiện của tôi
            </h1>

            <p
              className="
                text-gray-400
                mt-2
              "
            >
              Quản lý tất cả sự kiện
              organizer đã tạo
            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">

            {/* DASHBOARD */}
            <button
              onClick={() =>

                navigate(
                  "/organizer/dashboard"
                )

              }
              className="
                flex
                items-center
                gap-2
                px-6
                py-4
                rounded-2xl
                bg-white/10
                hover:bg-white/20
                border
                border-white/10
                font-semibold
              "
            >

              <LayoutDashboard
                size={20}
              />

              Dashboard

            </button>

            {/* CREATE */}
            <button
              onClick={() =>

                navigate(
                  "/organizer/create-event"
                )

              }
              className="
                flex
                items-center
                gap-2
                px-6
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
              "
            >

              <Plus size={20} />

              Tạo sự kiện

            </button>

          </div>

        </div>

        {/* EMPTY */}
        {events.length === 0 && (

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-16
              text-center
            "
          >

            <h2
              className="
                text-3xl
                font-black
                mb-3
              "
            >
              Chưa có sự kiện
            </h2>

            <p
              className="
                text-gray-400
              "
            >
              Hãy tạo sự kiện đầu tiên
            </p>

          </div>

        )}

        {/* LIST */}
        <div
          className="
            grid
            lg:grid-cols-2
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

                {/* IMAGE */}
                <img
                  src={
                    `${import.meta.env.VITE_API_URL}${event.image_url}`
                  }
                  alt={
                    event.title
                  }
                  className="
                    w-full
                    h-56
                    object-cover
                  "
                />

                {/* CONTENT */}
                <div className="p-6">

                  {/* STATUS */}
                  <div
                    className={`
                      inline-flex
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold
                      mb-4
                      ${getStatusColor(
                        event.status
                      )}
                    `}
                  >

                    {event.status}

                  </div>

                  {/* TITLE */}
                  <h2
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {event.title}
                  </h2>

                  {/* CATEGORY */}
                  <p
                    className="
                      text-gray-400
                      mt-2
                    "
                  >
                    {
                      event.category_name
                    }
                  </p>

                  {/* LOCATION */}
                  <p
                    className="
                      text-gray-500
                      mt-1
                    "
                  >
                    {
                      event.location
                    }
                  </p>

                  {/* ACTION */}
                  <div className="mt-6">

                    <button
                      onClick={() => {

                        // DRAFT
                        if (
                          event.status ===
                          "DRAFT"
                        ) {

                          navigate(

                            `/organizer/event/${event.id}/tickets`

                          );

                          return;

                        }

                        // PENDING / APPROVED
                        navigate(

                          `/organizer/event/${event.id}/payment`

                        );

                      }}
                      className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-2xl
                        bg-sky-500
                        hover:bg-sky-400
                        text-black
                        font-bold
                      "
                    >

                      {event.status ===
                      "DRAFT"

                        ? "Tiếp tục setup"

                        : "Xem chi tiết"}

                      <ChevronRight
                        size={18}
                      />

                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}
