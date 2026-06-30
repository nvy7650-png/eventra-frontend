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
        console.log(data.event);
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
              h-[300px]
md:h-[550px]
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

       {/* Event Info */}

<div
  className="
    mt-6
    md:mt-8

    bg-[#0B1220]
    border
    border-white/10

    rounded-3xl

    p-5
    md:p-8
  "
>

  <h1
    className="
      text-3xl
      md:text-5xl

      font-black
      leading-tight
    "
  >
    {event.title}
  </h1>

  <div
    className="
      mt-6

      grid
      grid-cols-1
      md:grid-cols-2

      gap-4
    "
  >

    <div
      className="
        bg-white/5
        rounded-2xl
        p-4
      "
    >
      <p className="text-gray-500 text-sm">
        Địa điểm
      </p>

      <p className="mt-1 font-medium">
        {event.location}
      </p>
    </div>

    <div
      className="
        bg-white/5
        rounded-2xl
        p-4
      "
    >
      <p className="text-gray-500 text-sm">
        Danh mục
      </p>

      <p className="mt-1 font-medium">
        {event.category_name || "Sự kiện"}
      </p>
    </div>

  </div>

</div>

<div
  className="
    mt-10

    grid
    grid-cols-1
    lg:grid-cols-3

    gap-8
  "
>

  {/* LEFT */}

  <div className="lg:col-span-2">

    <div
      className="
        bg-[#0B1220]
        border
        border-white/10

        rounded-3xl

        p-6
        md:p-8
      "
    >

      <h2
        className="
          text-2xl
          font-black
          mb-6
        "
      >
        Thông tin sự kiện
      </h2>

      <p
        className="
          text-gray-300
          whitespace-pre-wrap
          leading-7
          md:leading-8
        "
      >
        {event.description}
      </p>

    </div>

  </div>

  {/* RIGHT */}

  <div>

    <div
      className="
        lg:sticky
        lg:top-28

        bg-[#0B1220]
        border
        border-white/10

        rounded-3xl

        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-black
          mb-6
        "
      >
        🎟 Chọn suất diễn
      </h2>

      <div className="space-y-4">

        {showtimes.map((st) => {

  const start =
    new Date(st.start_time);

  const end =
    new Date(st.end_time);

  const isOpen =
    expandedShowtime === st.id;

  return (

    <div
      key={st.id}
      className={`
        rounded-2xl
        overflow-hidden
        border
        transition

        ${
          isOpen
            ? "border-sky-400"
            : "border-white/10"
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
          p-4
          flex
          justify-between
          items-center
        "
      >

        <div>

          <div className="font-bold">

            {start.toLocaleDateString(
              "vi-VN"
            )}

          </div>

          <div className="text-gray-400 text-sm mt-1">

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
                  mx-4
                  my-4

                  p-4

                  rounded-2xl

                  bg-white/5
                  border
                  border-white/10

                  flex
                  flex-col
                  gap-3
                "
              >

                <div>

                  <div className="font-bold">
                    {zone.name}
                  </div>

                  <div className="text-sky-400 font-bold mt-1">
                    {price} đ
                  </div>

                </div>

                <button
                  disabled={btn.disabled}
                  onClick={() => {

  if (event.seat_mode === "AUTO") {

    navigate(
      `/event/${event.id}/booking?showtime=${st.id}`
    );

  } else {

    navigate(
      `/event/${event.id}/seatmap?showtime=${st.id}`
    );

  }

}}
                  className={`
                    w-full

                    py-3

                    rounded-xl

                    font-bold

                    ${
                      btn.disabled
                        ? "bg-white/10 text-gray-400"
                        : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
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

</div>

      </div>

      <Footer />
    </div>
  );
}