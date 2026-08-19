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

  // State quản lý Modal thông tin Nhà tổ chức
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event || null);
        setShowtimes(data.showtimes || []);
        setZones(data.zones || []);
      })
      .catch((err) => console.error("Lỗi lấy thông tin sự kiện:", err))
      .finally(() => setLoading(false));
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Đang tải sự kiện...</p>
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

  // Kiểm tra trạng thái bán vé dựa theo thời gian và suất diễn
  const getShowtimeStatus = (showtime) => {
    // Tìm thời gian sale của các hạng vé thuộc suất diễn hoặc dùng thời gian chung
    const saleStartTimes = zones
      .map((z) => (z.sale_start ? new Date(z.sale_start) : null))
      .filter(Boolean);
    const saleEndTimes = zones
      .map((z) => (z.sale_end ? new Date(z.sale_end) : null))
      .filter(Boolean);

    const earliestStart = saleStartTimes.length
      ? new Date(Math.min(...saleStartTimes))
      : null;
    const latestEnd = saleEndTimes.length
      ? new Date(Math.max(...saleEndTimes))
      : null;

    if (earliestStart && now < earliestStart) {
      return { disabled: true, text: "Chưa mở bán" };
    }

    if (latestEnd && now > latestEnd) {
      return { disabled: true, text: "Không bán vé" };
    }

    return { disabled: false, text: "Mua vé" };
  };

  const handleBooking = (showtimeId) => {
    if (event.seat_mode === "AUTO") {
      navigate(`/event/${event.id}/booking?showtime=${showtimeId}`);
    } else {
      navigate(`/event/${event.id}/seatmap?showtime=${showtimeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={
              event.image_url?.startsWith("http")
                ? event.image_url
                : `${API_BASE_URL}${event.image_url || ""}`
            }
            alt={event.title}
            className="w-full h-[300px] md:h-[550px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Event Info Header */}
        <div className="mt-6 md:mt-8 bg-[#0B1220] border border-white/10 rounded-3xl p-5 md:p-8">
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {event.title}
          </h1>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Địa điểm</p>
              <p className="mt-1 font-medium">{event.location}</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Danh mục</p>
              <p className="mt-1 font-medium">
                {event.category_name || "Sự kiện"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Mô tả & Nhà tổ chức */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mô tả sự kiện */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-black mb-6">Thông tin sự kiện</h2>
              <p className="text-gray-300 whitespace-pre-wrap leading-7 md:leading-8">
                {event.description}
              </p>
            </div>

            {/* Thẻ Nhà tổ chức (Bấm vào để mở Modal) */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-black mb-4">Nhà tổ chức</h2>
              
              <button
                onClick={() => setShowOrganizerModal(true)}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-white/10 transition group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition">
                      {event.organizer_name || "Đơn vị tổ chức"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Nhấn để xem thông tin liên hệ
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-white transition">
                  ➔
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT: Chọn suất diễn & Mua vé */}
          <div>
            <div className="lg:sticky lg:top-28 bg-[#0B1220] border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-6">🎟 Chọn suất diễn</h2>

              <div className="space-y-4">
                {showtimes.map((st) => {
                  const start = new Date(st.start_time);
                  const end = new Date(st.end_time);
                  const isOpen = expandedShowtime === st.id;
                  const btnState = getShowtimeStatus(st);

                  return (
                    <div
                      key={st.id}
                      className={`rounded-2xl overflow-hidden border transition ${
                        isOpen ? "border-sky-400" : "border-white/10"
                      }`}
                    >
                      {/* Tiêu đề suất diễn & Nút Mua vé đặt trực tiếp tại đây */}
                      <div className="p-4 bg-white/5 flex flex-col gap-3">
                        <div
                          onClick={() =>
                            setExpandedShowtime(isOpen ? null : st.id)
                          }
                          className="flex justify-between items-start cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-lg">
                              {start.toLocaleDateString("vi-VN")}
                            </div>
                            <div className="text-gray-400 text-sm mt-1">
                              {start.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {end.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          <span className="text-xs text-sky-400 underline">
                            {isOpen ? "Thu gọn" : "Xem giá vé"}
                          </span>
                        </div>

                        {/* Nút MUA VÉ trực tiếp tại Suất diễn */}
                        <button
                          disabled={btnState.disabled}
                          onClick={() => handleBooking(st.id)}
                          className={`w-full py-3 rounded-xl font-bold transition ${
                            btnState.disabled
                              ? "bg-white/10 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black hover:opacity-90"
                          }`}
                        >
                          {btnState.text}
                        </button>
                      </div>

                      {/* Chi tiết từng Hạng vé khi nhấn xem */}
                      {isOpen && (
                        <div className="border-t border-white/10 p-4 space-y-3 bg-black/20">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                            Danh sách hạng vé:
                          </p>
                          {zones.map((zone) => {
                            const price = Number(zone.price).toLocaleString("vi-VN");
                            const isSoldOut =
                              typeof zone.remaining === "number" && zone.remaining <= 0;

                            return (
                              <div
                                key={zone.id}
                                className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-semibold text-sm">
                                    {zone.name}
                                  </div>
                                  <div className="text-sky-400 text-xs font-bold mt-0.5">
                                    {price} đ
                                  </div>
                                </div>

                                {isSoldOut && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md font-medium border border-red-500/30">
                                    Hết vé
                                  </span>
                                )}
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

      {/* MODAL THÔNG TIN NHÀ TỔ CHỨC */}
      {showOrganizerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            {/* Nút đóng Modal */}
            <button
              onClick={() => setShowOrganizerModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
            >
              ✕
            </button>

            <h3 className="text-2xl font-black mb-2">Thông tin liên hệ</h3>
            <p className="text-gray-400 text-sm mb-6">
              Đơn vị chịu trách nhiệm tổ chức sự kiện này.
            </p>

            <div className="space-y-4">
              {/* Tên nhà tổ chức */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Tên đơn vị</p>
                <p className="font-bold text-lg text-sky-400">
                  {event.organizer_name || "Chưa cập nhật"}
                </p>
              </div>

              {/* Email liên hệ */}
              {event.organizer_email ? (
                <a
                  href={`mailto:${event.organizer_email}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-black transition group"
                >
                  <div>
                    <p className="text-xs opacity-70 mb-0.5">Email liên hệ</p>
                    <p className="font-semibold text-sm">{event.organizer_email}</p>
                  </div>
                  <span className="text-lg">✉️</span>
                </a>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 text-sm">
                  Email: Chưa cập nhật
                </div>
              )}

              {/* Số điện thoại liên hệ */}
              {event.organizer_phone ? (
                <a
                  href={`tel:${event.organizer_phone}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black transition group"
                >
                  <div>
                    <p className="text-xs opacity-70 mb-0.5">Số điện thoại</p>
                    <p className="font-semibold text-sm">{event.organizer_phone}</p>
                  </div>
                  <span className="text-lg">📞</span>
                </a>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 text-sm">
                  Số điện thoại: Chưa cập nhật
                </div>
              )}
            </div>

            <button
              onClick={() => setShowOrganizerModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-white/10 font-bold hover:bg-white/20 transition text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}