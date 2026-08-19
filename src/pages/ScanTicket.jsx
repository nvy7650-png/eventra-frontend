import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  QrCode,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Ticket,
  UserCheck,
} from "lucide-react";
import SidebarAdmin from "../components/SidebarAdmin"; // Tích hợp Sidebar Admin

export default function ScanTicket() {
  const qrRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");

  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  // API_URL có fallback an toàn
  const API_URL = (import.meta.env.VITE_API_URL || "https://homieticket-backend.onrender.com").replace(/\/$/, "");

  // ===============================
  // LẤY DANH SÁCH EVENT
  // ===============================
  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách sự kiện:", err))
      .finally(() => setLoadingEvents(false));
  }, [API_URL]);

  // ===============================
  // LẤY SHOWTIME THEO EVENT
  // ===============================
  useEffect(() => {
    if (!selectedEvent) {
      setShowtimes([]);
      return;
    }

    setLoadingShowtimes(true);
    fetch(`${API_URL}/api/events/${selectedEvent}/showtimes`)
      .then((res) => res.json())
      .then((data) => {
        setShowtimes(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Lỗi lấy suất diễn:", err))
      .finally(() => setLoadingShowtimes(false));
  }, [selectedEvent, API_URL]);

  // ===============================
  // BẮT ĐẦU CAMERA SCANNER
  // ===============================
  useEffect(() => {
    let isMounted = true;

    if (!started || !selectedEvent || !selectedShowtime) return;

    const timer = setTimeout(() => {
      const qr = new Html5Qrcode("reader");
      qrRef.current = qr;

      qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const res = await fetch(`${API_URL}/api/tickets/checkin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ticket_code: decodedText,
                event_id: selectedEvent,
                showtime_id: selectedShowtime,
              }),
            });

            const data = await res.json();

            if (isMounted) {
              setResult(data);
              await qr.stop().catch(() => {});
            }
          } catch (err) {
            console.error("Lỗi check-in:", err);
            if (isMounted) {
              setResult({
                success: false,
                message: "Không thể kết nối máy chủ để xác thực vé!",
              });
              await qr.stop().catch(() => {});
            }
          }
        },
        () => {}
      ).catch((err) => {
        console.error("Không thể khởi động Camera:", err);
      });
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {});
      }
    };
  }, [started, selectedEvent, selectedShowtime, API_URL]);

  // Restarts scanner session
  const handleRestart = () => {
    setResult(null);
    setStarted(false);

    setTimeout(() => {
      setStarted(true);
    }, 200);
  };

  // Lấy thông tin Event & Showtime đã chọn để hiển thị
  const currentEvent = events.find((e) => String(e.id) === String(selectedEvent));
  const currentShowtime = showtimes.find((s) => String(s.id) === String(selectedShowtime));

  return (
    <div className="min-h-screen flex bg-[#050816]">
      {/* SIDEBAR ADMIN */}
      <SidebarAdmin />

      {/* CONTENT REGION */}
      <div className="ml-80 flex-1 min-h-screen p-8 text-white">
        <div className="max-w-2xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400">
                  <QrCode size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Soát vé Check-in</h1>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Quét mã QR vé để kiểm tra & xác nhận vào cổng
                  </p>
                </div>
              </div>
            </div>

            {started && (
              <button
                onClick={() => {
                  setStarted(false);
                  setResult(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition-all"
              >
                <ArrowLeft size={16} />
                Đổi phiên
              </button>
            )}
          </div>

          {/* BƯỚC 1: CHỌN PHIÊN CHECK-IN */}
          {!started && (
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-sky-400" size={24} />
                <h2 className="text-xl font-bold">Cấu hình phiên Check-in</h2>
              </div>

              {/* CHỌN SỰ KIỆN */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  1. Chọn sự kiện <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => {
                      setSelectedEvent(e.target.value);
                      setSelectedShowtime("");
                    }}
                    disabled={loadingEvents}
                    className="w-full bg-[#111827] border border-white/15 focus:border-sky-500 rounded-2xl px-4 py-3.5 text-white outline-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    <option value="">
                      {loadingEvents ? "Đang tải sự kiện..." : "-- Chọn sự kiện --"}
                    </option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CHỌN SUẤT DIỄN */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  2. Chọn suất diễn <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedShowtime}
                    onChange={(e) => setSelectedShowtime(e.target.value)}
                    disabled={!selectedEvent || loadingShowtimes}
                    className="w-full bg-[#111827] border border-white/15 focus:border-sky-500 rounded-2xl px-4 py-3.5 text-white outline-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    <option value="">
                      {!selectedEvent
                        ? "-- Vui lòng chọn sự kiện trước --"
                        : loadingShowtimes
                        ? "Đang tải suất diễn..."
                        : "-- Chọn suất diễn --"}
                    </option>
                    {showtimes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {new Date(st.start_time).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BUTTON BẮT ĐẦU */}
              <button
                disabled={!selectedEvent || !selectedShowtime}
                onClick={() => setStarted(true)}
                className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-black text-lg shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck size={22} />
                Bắt đầu Check-in
              </button>
            </div>
          )}

          {/* BƯỚC 2: KHUNG CAMERA QUÉT QR */}
          {started && !result && (
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* THÔNG TIN PHIÊN ĐANG QUÉT */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Calendar className="text-sky-400 shrink-0" size={20} />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Sự kiện</p>
                    <p className="font-bold text-sm truncate">{currentEvent?.title || "--"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-sky-400 shrink-0" size={20} />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Suất diễn</p>
                    <p className="font-bold text-sm truncate">
                      {currentShowtime?.start_time
                        ? new Date(currentShowtime.start_time).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>

              {/* FRAME CAMERA */}
              <div className="relative">
                <div
                  id="reader"
                  className="rounded-2xl overflow-hidden border-2 border-sky-500/30 shadow-inner bg-black"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm text-gray-300 font-medium">
                  Đang bật Camera... Hãy đưa mã QR vào trung tâm khung hình.
                </p>
                <p className="text-xs text-gray-500">
                  Hệ thống sẽ tự động gửi xác nhận ngay khi phát hiện mã hợp lệ.
                </p>
              </div>
            </div>
          )}

          {/* BƯỚC 3: KẾT QUẢ XÁC THỰC CHECK-IN */}
          {result && (
            <div
              className={`rounded-3xl p-8 text-center border shadow-2xl backdrop-blur-xl transition-all ${
                result.success
                  ? "bg-green-950/20 border-green-500/40 shadow-green-500/10"
                  : "bg-red-950/20 border-red-500/40 shadow-red-500/10"
              }`}
            >
              <div className="flex justify-center mb-4">
                {result.success ? (
                  <CheckCircle2 className="text-green-400 animate-bounce" size={72} />
                ) : (
                  <XCircle className="text-red-400 animate-pulse" size={72} />
                )}
              </div>

              <h3
                className={`text-2xl font-black mb-2 ${
                  result.success ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.message}
              </h3>

              {/* THÔNG TIN VÉ NẾU HỢP LỆ */}
              {result.ticket && (
                <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Ticket size={16} /> Tên sự kiện
                    </span>
                    <span className="font-bold text-white text-right">
                      {result.ticket.event_title || currentEvent?.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Vị trí / Ghế:</span>
                    <span className="font-black text-sky-400 text-lg">
                      {result.ticket.seat_code ||
                        result.ticket.standing_number ||
                        "Vé phổ thông (Chưa xếp ghế)"}
                    </span>
                  </div>

                  {result.ticket.customer_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Khách hàng:</span>
                      <span className="font-medium text-gray-200">
                        {result.ticket.customer_name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* BUTTON QUÉT TIẾP */}
              <button
                onClick={handleRestart}
                className="w-full mt-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-lg transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Quét vé tiếp theo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}