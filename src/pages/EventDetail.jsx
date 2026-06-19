import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [zones, setZones] = useState([]);
  const [expandedShowtime, setExpandedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event || null);
        setShowtimes(data.showtimes || []);
        setZones(data.zones || []);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">
            Đang tải sự kiện...
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          Không tìm thấy sự kiện
        </div>
      </div>
    );
  }

  const now = new Date();

  const getZoneButton = (zone) => {
    const saleStart = zone.sale_start
      ? new Date(zone.sale_start)
      : null;

    const saleEnd = zone.sale_end
      ? new Date(zone.sale_end)
      : null;

    if (saleStart && now < saleStart) {
      return {
        disabled: true,
        text: "Chưa mở bán",
      };
    }

    if (saleEnd && now > saleEnd) {
      return {
        disabled: true,
        text: "Đã kết thúc",
      };
    }

    if (
      typeof zone.remaining === "number" &&
      zone.remaining <= 0
    ) {
      return {
        disabled: true,
        text: "Hết vé",
      };
    }

    return {
      disabled: false,
      text: "Mua vé",
    };
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Banner */}

        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
            alt={event.title}
            className="
              w-full
              h-[220px]
              md:h-[500px]
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/80
              via-black/20
              to-transparent
            "
          />
        </div>

        {/* Main */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
          "
        >

          {/* LEFT */}

          <div
            className="
              lg:col-span-1
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              h-fit
            "
          >

            <h1
              className="
                text-3xl
                md:text-4xl
                font-black
                leading-tight
              "
            >
              {event.title}
            </h1>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-gray-500 text-sm">
                  Địa điểm
                </p>

                <p className="text-white mt-1">
                  {event.location}
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="lg:col-span-2">

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                mb-6
              "
            >
              Mua vé
            </h2>

            <div className="space-y-4">

              {showtimes.map((st) => {

                const start = new Date(
                  st.start_time
                );

                const end = new Date(
                  st.end_time
                );

                const isOpen =
                  expandedShowtime === st.id;

                return (
                  <div
                    key={st.id}
                    className={`
                      rounded-3xl
                      overflow-hidden
                      border
                      transition
                      ${
                        isOpen
                          ? "border-sky-400 bg-[#0B1120]"
                          : "border-white/10 bg-[#0B1120]"
                      }
                    `}
                  >

                    <button
                      onClick={() =>
                        setExpandedShowtime(
                          isOpen ? null : st.id
                        )
                      }
                      className="
                        w-full
                        p-5
                        flex
                        justify-between
                        items-center
                      "
                    >

                      <div>

                        <div className="font-bold text-lg">
                          {start.toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>

                        <div className="text-gray-400 mt-1">

                          {start.toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

                          {" - "}

                          {end.toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

                        </div>

                      </div>

                      <div
                        className={`
                          text-xl
                          transition
                          ${
                            isOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      >
                        ▼
                      </div>

                    </button>

                    {isOpen && (

                      <div className="border-t border-white/10">

                        {zones.map((zone) => {

                          const btn =
                            getZoneButton(zone);

                          const price =
                            Number(
                              zone.price
                            ).toLocaleString(
                              "vi-VN"
                            );

                          return (

                            <div
                              key={zone.id}
                              className="
                                m-4
                                p-5
                                rounded-2xl
                                bg-white/5
                                border
                                border-white/10
                                flex
                                flex-col
                                md:flex-row
                                md:items-center
                                md:justify-between
                                gap-4
                              "
                            >

                              <div>

                                <div className="font-bold text-lg">
                                  {zone.name}
                                </div>

                                <div className="text-sky-400 mt-1 font-semibold">
                                  {price} đ
                                </div>

                              </div>

                              <button
                                disabled={btn.disabled}
                                onClick={() =>
                                  navigate(
                                    `/event/${event.id}/seatmap?zone=${zone.id}&showtime=${st.id}`
                                  )
                                }
                                className={`
                                  px-6
                                  py-3
                                  rounded-2xl
                                  font-bold
                                  transition

                                  ${
                                    btn.disabled
                                      ? "bg-white/10 text-gray-400"
                                      : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black hover:opacity-90"
                                  }
                                `}
                              >
                                {btn.text}
                              </button>

                            </div>

                          );

                        })}

                      </div>

                    )}

                  </div>
                );

              })}

            </div>

          </div>

        </div>

        {/* Description */}

        <div
          className="
            mt-8
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-4
            "
          >
            Thông tin sự kiện
          </h2>

          <p className="text-gray-300 whitespace-pre-wrap leading-8">
            {event.description}
          </p>

        </div>

      </div>

      <Footer />
    </div>
  );
}