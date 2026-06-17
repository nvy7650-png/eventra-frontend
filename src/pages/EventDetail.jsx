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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div  className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex bg-[#050816] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Không tìm thấy sự kiện</div>
      </div>
    );
  }

  const now = new Date();

  const getZoneButton = (zone) => {
    const saleStart = zone.sale_start ? new Date(zone.sale_start) : null;
    const saleEnd = zone.sale_end ? new Date(zone.sale_end) : null;

    // Priority order:
    // 1) Not started
    if (saleStart && now < saleStart) {
      return { disabled: true, text: "Chưa mở bán", color: "gray" };
    }

    // 2) Sale finished
    if (saleEnd && now > saleEnd) {
      return { disabled: true, text: "Đã kết thúc", color: "red" };
    }

    // 3) Sold out (only when sale window is active)
    const inSaleWindow = (!saleStart || now >= saleStart) && (!saleEnd || now <= saleEnd);
    if (inSaleWindow && typeof zone.remaining === "number" && zone.remaining <= 0) {
      return { disabled: true, text: "Hết vé", color: "red" };
    }

    // 4) Available
    return { disabled: false, text: "Mua vé", color: "green" };
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-10">

        <img
          src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
          alt={event.title}
          className="w-full h-[400px] object-cover rounded-3xl"
        />

        <div className="mt-8 flex items-start justify-between gap-6">

          <div className="flex-1">
            <h1 className="text-4xl font-black">{event.title}</h1>
            <p className="text-gray-400 mt-3">{event.category_name}</p>
            <p className="text-gray-400 mt-2">{event.location}</p>
            <div className="mt-6 bg-[#0B1120] border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-3">Mô tả</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

        </div>

        <div className="mt-12 mb-6">
  <h2 className="text-3xl font-black">
    Chọn suất diễn
  </h2>

  <p className="text-gray-400 mt-2">
    Chọn thời gian diễn để xem các hạng vé
  </p>
</div>

      <div className="space-y-4 mt-10">
              {showtimes.map((st) => {

              const start = new Date(st.start_time);
              const end = new Date(st.end_time);

              const isOpen =
               expandedShowtime === st.id;

              return (
               <div
  key={st.id}
  className={`
    rounded-3xl
    overflow-hidden
    border
    transition-all
    duration-300
    hover:scale-[1.01]
    hover:border-sky-400/50
    ${
      isOpen
        ? "border-sky-400 bg-gradient-to-r from-[#0B1120] to-[#13203A]"
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
                  p-6
                  flex
                  justify-between
                  items-center
                "
              >
                <div>
                  <div className="font-bold text-lg">
                    📅 {start.toLocaleDateString("vi-VN")}
                  </div>

                  <div className="text-gray-400 mt-1">
                    🕒
                    {" "}
                    {start.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {end.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

          <div
  className={`
    text-xl
    transition-transform
    duration-300
    ${isOpen ? "rotate-180" : ""}
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
                new Intl.NumberFormat(
                  "vi-VN",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                ).format(
                  Number(zone.price)
                );

              return (
                <div
                    key={zone.id}
                    className="
                      mx-4
                      my-4
                      p-5
                      rounded-2xl
                      bg-[#081018]
                      border
                      border-white/5
                      hover:border-sky-400/30
                      transition
                      flex
                      justify-between
                      items-center
                    "
                  >

                  <div>
                    <div className="font-bold">
                      {zone.name}
                    </div>

                    <div className="text-sky-400 mt-1">
                      {price}
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
                      px-5
                      py-2
                      rounded-xl
                      font-semibold
                      ${
                        btn.disabled
                          ? "bg-gray-700 text-gray-400"
                          : "bg-green-500 text-black"
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


      <Footer />
    </div>
  );
}
