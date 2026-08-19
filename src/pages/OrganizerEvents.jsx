import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  CalendarDays,
  MapPin,
  Eye,
} from "lucide-react";

import OrganizerSidebar
  from "../components/OrganizerSidebar";


export default function OrganizerEvents() {

  const navigate = useNavigate();

  // ============================
  // USER
  // ============================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ============================
  // STATE
  // ============================

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================
  // CHECK LOGIN + GET EVENTS
  // ============================

  useEffect(() => {

    if (
      !user ||
      user.role !== "ORGANIZER"
    ) {

      navigate("/login");

      return;

    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`
    )

      .then(async (res) => {

        if (!res.ok) {

          throw new Error(
            `HTTP ${res.status}`
          );

        }

        return res.json();

      })

      .then((data) => {

        setEvents(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((err) => {

        console.log(
          "❌ Lỗi lấy danh sách sự kiện:",
          err
        );

        setError(
          "Không thể tải danh sách sự kiện."
        );

      })

      .finally(() => {

        setLoading(false);

      });

  }, [navigate]);


  // ============================
  // STATUS COLOR
  // ============================

  const getStatusColor =
    (status) => {

      switch (status) {

        case "APPROVED":

          return `
            bg-green-500/20
            text-green-400
            border
            border-green-500/20
          `;

        case "PENDING":

          return `
            bg-yellow-500/20
            text-yellow-400
            border
            border-yellow-500/20
          `;

        case "CANCELLED":

          return `
            bg-red-500/20
            text-red-400
            border
            border-red-500/20
          `;

        default:

          return `
            bg-gray-500/20
            text-gray-300
            border
            border-gray-500/20
          `;

      }

    };


  // ============================
  // STATUS TEXT
  // ============================

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

          return status || "Không xác định";

      }

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

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-sky-400
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-400">
            Đang tải danh sách sự kiện...
          </p>

        </div>

      </div>

    );

  }


  // ============================
  // MAIN
  // ============================

  return (

    <div
      className="
        min-h-screen
        flex
        bg-[#050816]
        text-white
      "
    >

      <OrganizerSidebar />


      {/* MAIN */}

      <main
        className="
          flex-1
          min-h-screen
          min-w-0
          lg:ml-72
        "
      >

        {/* ============================
            TOPBAR
        ============================ */}

        <div
          className="
            border-b
            border-white/10
            bg-[#081120]
            px-4
            sm:px-6
            lg:px-10
            py-5
            lg:py-6
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-5
            "
          >

            <div>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                "
              >
                Sự kiện của tôi
              </h1>

              <p
                className="
                  text-gray-400
                  mt-2
                  text-sm
                  sm:text-base
                "
              >
                Quản lý tất cả sự kiện đã tạo
              </p>

            </div>


            {/* CREATE EVENT */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/organizer/create-event"
                )
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                px-5
                sm:px-6
                py-3
                sm:py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
                shadow-lg
                shadow-sky-500/10
              "
            >

              <Plus size={20} />

              Tạo sự kiện

            </button>

          </div>

        </div>


        {/* ============================
            CONTENT
        ============================ */}

        <div
          className="
            p-4
            sm:p-6
            lg:p-10
          "
        >

          <div
            className="
              max-w-7xl
              mx-auto
            "
          >


            {/* ============================
                ERROR
            ============================ */}

            {error && (

              <div
                className="
                  mb-6
                  bg-red-500/10
                  border
                  border-red-500/20
                  rounded-2xl
                  px-5
                  py-4
                  text-red-400
                "
              >

                {error}

              </div>

            )}


            {/* ============================
                EVENT COUNT
            ============================ */}

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
                text-gray-400
              "
            >

              <CalendarDays size={20} />

              <span>
                {events.length} sự kiện
              </span>

            </div>


            {/* ============================
                EMPTY
            ============================ */}

            {events.length === 0 && !error && (

              <div
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-10
                  sm:p-16
                  text-center
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-sky-500/10
                    border
                    border-sky-500/20
                    flex
                    items-center
                    justify-center
                    text-sky-400
                    mb-5
                  "
                >

                  <CalendarDays size={30} />

                </div>


                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-black
                    mb-3
                  "
                >
                  Chưa có sự kiện
                </h2>


                <p
                  className="
                    text-gray-400
                    mb-7
                  "
                >
                  Hãy tạo sự kiện đầu tiên của bạn.
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/organizer/create-event"
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-2xl
                    bg-sky-500
                    hover:bg-sky-400
                    text-black
                    font-bold
                    transition
                  "
                >

                  <Plus size={20} />

                  Tạo sự kiện

                </button>

              </div>

            )}


            {/* ============================
                EVENT LIST
            ============================ */}

            {events.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
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
                        hover:border-sky-500/30
                        transition
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          relative
                          w-full
                          h-52
                          sm:h-60
                          bg-black/20
                        "
                      >

                        <img
                          src={
                            event.image_url?.startsWith(
                              "http"
                            )
                              ? event.image_url
                              : `${import.meta.env.VITE_API_URL}${event.image_url || ""}`
                          }
                          alt={event.title}
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                          onError={(e) => {

                            e.currentTarget.style.display =
                              "none";

                          }}
                        />


                        {/* STATUS */}

                        <div
                          className={`
                            absolute
                            top-4
                            right-4
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                            backdrop-blur-md
                            ${getStatusColor(
                              event.status
                            )}
                          `}
                        >

                          {getStatusText(
                            event.status
                          )}

                        </div>

                      </div>


                      {/* INFO */}

                      <div className="p-5 sm:p-6">

                        <h2
                          className="
                            text-xl
                            sm:text-2xl
                            font-bold
                            line-clamp-2
                          "
                        >
                          {event.title}
                        </h2>


                        {/* CATEGORY */}

                        {event.category_name && (

                          <p
                            className="
                              mt-3
                              text-sky-400
                              text-sm
                              font-medium
                            "
                          >
                            {event.category_name}
                          </p>

                        )}


                        {/* LOCATION */}

                        {event.location && (

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                              mt-3
                              text-gray-400
                              text-sm
                            "
                          >

                            <MapPin
                              size={17}
                              className="
                                mt-0.5
                                shrink-0
                              "
                            />

                            <span>
                              {event.location}
                            </span>

                          </div>

                        )}


                        {/* ACTION */}

                        <div className="mt-6">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/organizer/event/${event.id}`
                              )
                            }
                            className="
                              w-full
                              flex
                              items-center
                              justify-center
                              gap-2
                              px-5
                              py-3
                              rounded-2xl
                              bg-sky-500
                              hover:bg-sky-400
                              text-black
                              font-bold
                              transition
                            "
                          >

                            <Eye size={19} />

                            Xem chi tiết

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </main>

    </div>

  );

}