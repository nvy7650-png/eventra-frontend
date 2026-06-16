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
  const [selectedShowtime, setSelectedShowtime] = useState(null);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
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

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Suất diễn</h2>
            <div className="space-y-4">
              {showtimes.length === 0 ? (
                <p className="text-gray-400">Không có suất diễn</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {showtimes.map((st) => {
                    const start = st.start_time ? new Date(st.start_time) : null;
                    const end = st.end_time ? new Date(st.end_time) : null;
                    const dateText = start ? start.toLocaleDateString("vi-VN") : "";
                    const startTime = start ? start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";
                    const endTime = end ? end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";
                    const isSelected = selectedShowtime?.id === st.id;

                    return (
                      <button
                        key={st.id || st.start_time}
                        type="button"
                        onClick={() => setSelectedShowtime(st)}
                        className={`p-3 rounded-lg w-44 text-left transition border ${
                          isSelected
                            ? "bg-sky-500/10 border-sky-400"
                            : "bg-[#081018] border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="text-sm">📅 {dateText}</div>
                        <div className="text-sm mt-1">🕒 {startTime} - {endTime}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Khu vực</h2>
            <div className="grid gap-4">
              {zones.length === 0 ? (
                <p className="text-gray-400">Không có khu vực</p>
              ) : (
                zones.map((zone) => {
                  const btn = getZoneButton(zone);
                  const isDisabled = btn.disabled || !selectedShowtime;
                  const price = Number(zone.price || 0);
                  const formattedPrice = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

                  // button color classes
                  const btnClass = isDisabled
                    ? (btn.color === "red" ? "bg-red-500 text-black" : "bg-gray-700 text-gray-400")
                    : "bg-green-500 text-black";

                  return (
                    <div key={zone.id || zone.name} className="bg-[#081018] border border-white/5 rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{zone.name}</div>
                        <div className="text-gray-300 mt-1">{formattedPrice}</div>
                      </div>

                      <div className="mt-3 lg:mt-0 lg:ml-4">
                        <button
                          onClick={() => {
                            if (!isDisabled && selectedShowtime) {
                              navigate(
                                `/event/${event.id}/seatmap?zone=${zone.id}&showtime=${selectedShowtime.id}`
                              );
                            }
                          }}
                          disabled={isDisabled}
                          className={`px-4 py-2 rounded-2xl font-semibold ${btnClass}`}
                        >
                          {btn.text}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
