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
    if (event.status !== "APPROVED") {
      return { disabled: true, text: "Chưa được mở bán" };
    }

    const saleStart = zone.sale_start ? new Date(zone.sale_start) : null;
    const saleEnd = zone.sale_end ? new Date(zone.sale_end) : null;

    if (saleStart && now < saleStart) {
      return { disabled: true, text: "Chưa mở bán" };
    }

    if (saleEnd && now > saleEnd) {
      return { disabled: true, text: "Ngừng bán" };
    }

    if (typeof zone.remaining === "number" && zone.remaining <= 0) {
      return { disabled: true, text: "Đã bán hết" };
    }

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
                  return (
                    <div key={zone.id || zone.name} className="pb-4 border-b border-white/5">
                      <p className="text-gray-400">Tên</p>
                      <p>{zone.name}</p>
                      <p className="text-gray-400 mt-2">Giá</p>
                      <p>{zone.price}</p>
                      <p className="text-gray-400 mt-2">Loại</p>
                      <p>{zone.zone_type}</p>
                      <p className="text-gray-400 mt-2">Đã bán</p>
                      <p>{zone.sold_count ?? 0}</p>
                      <p className="text-gray-400 mt-2">Còn lại</p>
                      <p>{zone.remaining ?? 0}</p>

                      {zone.zone_type === "STANDING" && (
                        <>
                          <p className="text-gray-400 mt-2">Sức chứa</p>
                          <p>{zone.capacity}</p>
                        </>
                      )}

                      {zone.zone_type === "SEATING" && (
                        <>
                          <p className="text-gray-400 mt-2">Số hàng</p>
                          <p>{zone.total_rows}</p>
                          <p className="text-gray-400 mt-2">Ghế mỗi hàng</p>
                          <p>{zone.seats_per_row}</p>
                        </>
                      )}

                      <div className="mt-4">
                        <button
                          onClick={() => {
                            if (!btn.disabled) navigate(`/events/${event.id}/seatmap`);
                          }}
                          disabled={btn.disabled}
                          className={`w-full py-2 rounded-2xl font-semibold ${btn.disabled ? 'bg-gray-700 text-gray-400' : 'bg-sky-500 text-black'}`}
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
