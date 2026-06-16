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

    // Rule 1: sold out
    if (typeof zone.remaining === "number" && zone.remaining <= 0) {
      return { disabled: true, text: "Hết vé" };
    }

    // Rule 2: not started
    if (saleStart && now < saleStart) {
      return { disabled: true, text: "Chưa mở bán" };
    }

    // Rule 3: sale finished
    if (saleEnd && now > saleEnd) {
      return { disabled: true, text: "Đã kết thúc" };
    }

    // Otherwise available
    return { disabled: false, text: "Mua vé" };
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
                showtimes.map((st) => (
                  <div key={st.id || st.start_time}>
                    <p className="text-gray-400">Bắt đầu</p>
                    <p>{st.start_time}</p>
                    <p className="text-gray-400 mt-2">Kết thúc</p>
                    <p>{st.end_time}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Khu vực</h2>
            <div className="space-y-4">
              {zones.length === 0 ? (
                <p className="text-gray-400">Không có khu vực</p>
              ) : (
                zones.map((zone) => {
                  const btn = getZoneButton(zone);
                  const price = Number(zone.price || 0);
                  const formattedPrice = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

                  return (
                    <div key={zone.id || zone.name} className="flex items-center justify-between py-3 border-b border-white/5">
                      <div className="flex-1">
                        <div className="font-semibold">{zone.name}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-gray-300">{formattedPrice}</div>
                        <button
                          onClick={() => {
                            if (!btn.disabled) navigate(`/event/${event.id}/seatmap?zone=${zone.id}`);
                          }}
                          disabled={btn.disabled}
                          className={`px-4 py-2 rounded-2xl font-semibold ${btn.disabled ? 'bg-gray-700 text-gray-400' : 'bg-sky-500 text-black'}`}
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
