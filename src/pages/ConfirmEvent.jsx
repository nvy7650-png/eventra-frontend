import { useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  Ticket,
  LayoutGrid,
  MapPin,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ConfirmEvent() {
  const navigate = useNavigate();
  const location = useLocation();

  const { eventData, showtimes, zones } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!eventData || !showtimes) {
    return null;
  }

  // Tính toán số lượng ghế/sức chứa
  const capacityPerShowtime = (zones || []).reduce((sum, zone) => {
    if (zone.zone_type === "STANDING") {
      return sum + Number(zone.capacity || 0);
    }
    return (
      sum + Number(zone.rows || 0) * Number(zone.seatsPerRow || 0)
    );
  }, 0);

  const totalCapacity = capacityPerShowtime * showtimes.length;

  const seatsPerShowtime = (zones || []).reduce(
    (sum, zone) =>
      sum + Number(zone.rows || 0) * Number(zone.seatsPerRow || 0),
    0
  );

  const totalSeats = seatsPerShowtime * showtimes.length;

  const isManual = eventData.seat_mode === "MANUAL";

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("organizer_id", eventData.organizer_id);
      submitData.append("category_id", eventData.category_id);
      submitData.append("title", eventData.title);
      submitData.append("description", eventData.description);
      submitData.append("location", eventData.location);
      submitData.append("seat_mode", eventData.seat_mode);

      console.log(eventData.image);
      submitData.append("image", eventData.image);

      console.log("SHOWTIMES SENT:", showtimes);
      submitData.append("showtimes", JSON.stringify(showtimes));
      submitData.append("zones", JSON.stringify(zones));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/create-full`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Tạo sự kiện thất bại");
        setLoading(false);
        return;
      }

      alert("Gửi duyệt sự kiện thành công 🎉");
      navigate("/organizer/events");
    } catch (err) {
      console.log(err);
      alert("Lỗi server");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-5xl mx-auto bg-[#0B1120] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="px-5 py-6 sm:px-8 sm:py-7 border-b border-white/10 bg-[#081120]">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base font-medium mb-4 sm:mb-6 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại
          </button>

          <p className="text-sky-400 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            BƯỚC 3 / 3
          </p>

          <h1 className="text-2xl sm:text-4xl font-black mt-1 sm:mt-2 text-white">
            Xác nhận tạo sự kiện
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Kiểm tra lại thông tin chi tiết trước khi gửi hệ thống duyệt.
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden mt-5 sm:mt-6">
            <div className="h-full w-full bg-sky-400 rounded-full" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="text-sky-400 shrink-0 mt-1" size={24} />
              <div>
                <h2 className="text-xl sm:text-3xl font-bold text-white leading-snug">
                  {eventData.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-400 text-sm sm:text-base pl-1">
              <MapPin size={18} className="text-sky-400 shrink-0" />
              <span>{eventData.location}</span>
            </div>

          </div>

          {/* Stats Grid - Responsive 1 col (Mobile) -> 3 cols (Tablet & Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                <CalendarDays size={22} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {showtimes.length}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Suất diễn</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Ticket size={22} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isManual ? totalSeats : totalCapacity}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {isManual ? "Tổng số ghế" : "Tổng số vé"}
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <LayoutGrid size={22} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                  {eventData.seat_mode}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Hình thức bán vé
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 sm:py-5 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-sky-600/50 disabled:cursor-not-allowed text-black font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-lg shadow-sky-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </span>
            ) : (
              <>
                <span>Gửi duyệt sự kiện</span>
                <ChevronRight size={22} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}