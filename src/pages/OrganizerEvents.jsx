
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  LayoutDashboard,
} from "lucide-react";

export default function OrganizerEvents() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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

  const getStatusColor =
    (status) => {

      switch (status) {

        case "APPROVED":

          return "bg-green-500/20 text-green-400";

        case "PENDING":

          return "bg-yellow-500/20 text-yellow-400";

        case "CANCELLED":

          return "bg-red-500/20 text-red-400";

        default:

          return "bg-gray-500/20 text-gray-300";

      }

    };

  const getStatusText =
    (status) => {

      switch (status) {

        case "APPROVED":

          return "Đã duyệt";

        case "PENDING":

          return "Chờ duyệt";

        case "CANCELLED":

          return "Đã hủy";

        default:

          return status;

      }

    };

  const handleCancel =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Bạn có chắc muốn hủy sự kiện này?"
        );

      if (!confirmDelete)
        return;

      try {

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events/${id}/cancel`,

            {
              method: "PUT",
            }

          );

        if (!res.ok) {

          alert(
            "Không thể hủy sự kiện"
          );

          return;

        }

        setEvents(

          events.map(
            (event) =>

              event.id === id

                ? {
                    ...event,
                    status:
                      "CANCELLED",
                  }

                : event
          )

        );

      } catch (err) {

        console.log(err);

        alert(
          "Lỗi server"
        );

      }

    };

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
              Quản lý tất cả sự kiện đã tạo
            </p>

          </div>

          <div className="flex gap-4">

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

                <img
                  src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
                  alt={event.title}
                  className="
                    w-full
                    h-56
                    object-cover
                  "
                />

                <div className="p-6">

                  <div
                    className={`
                      inline-flex
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold
                      mb-4
                      ${getStatusColor(event.status)}
                    `}
                  >

                    {getStatusText(
                      event.status
                    )}

                  </div>

                  <h2
                    className="
                      text-2xl
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
                    {event.category_name}
                  </p>

                  <p
                    className="
                      text-gray-500
                      mt-1
                    "
                  >
                    {event.location}
                  </p>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        navigate(
                          `/organizer/event/${event.id}`
                        )
                      }
                      className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-sky-500
                        hover:bg-sky-400
                        text-black
                        font-bold
                      "
                    >

                      Xem chi tiết

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
