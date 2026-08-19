import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import OrganizerSidebar from "../components/OrganizerSidebar";

// Ảnh mặc định hiển thị khi sự kiện không có ảnh hoặc bị lỗi link
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%231E293B'/><text x='50%' y='50%' fill='%2394A3B8' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20'>Chưa có hình ảnh</text></svg>";

export default function OrganizerEvents() {
  const navigate = useNavigate();

  // Đọc user an toàn từ LocalStorage (tránh lỗi null)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Khai báo API_URL có fallback an toàn, tránh lỗi nối chuỗi 'undefined'
  const API_URL = (import.meta.env.VITE_API_URL || "https://homieticket-backend.onrender.com").replace(/\/$/, "");

  // Hàm xử lý link ảnh chuẩn cho Cloudinary & Server Uploads
  const getImageUrl = (url) => {
    if (!url) return DEFAULT_PLACEHOLDER;

    // Link tuyệt đối (Cloudinary / HTTPS / HTTP / Base64)
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }

    // Trường hợp URL Cloudinary bị thiếu https://
    if (url.includes("cloudinary.com")) {
      return `https://${url.replace(/^\/\//, "")}`;
    }

    // Link tương đối lưu ở backend local
    const formattedPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_URL}${formattedPath}`;
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/events/organizer/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");
        return res.json();
      })
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch events error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id, API_URL]);

  // Styling màu sắc cho Badge Trạng Thái
  const getStatusColor = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  // Chuyển đổi trạng thái sang Tiếng Việt
  const getStatusText = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Chờ duyệt";
      case "CANCELLED":
      case "REJECTED":
        return "Đã hủy";
      default:
        return status || "Chưa xác định";
    }
  };

  const handleCancel = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn hủy sự kiện này?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${id}/cancel`, {
        method: "PUT",
      });

      if (!res.ok) {
        alert("Không thể hủy sự kiện");
        return;
      }

      setEvents(
        events.map((event) =>
          event.id === id ? { ...event, status: "CANCELLED" } : event
        )
      );
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Đang tải danh sách sự kiện...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050816]">
      <OrganizerSidebar />

      <div className="ml-80 flex-1 min-h-screen">
        <div className="text-white px-6 py-10">
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black">Sự kiện của tôi</h1>
                <p className="text-gray-400 mt-2">
                  Quản lý tất cả sự kiện đã tạo
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/organizer/create-event")}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all"
                >
                  <Plus size={20} />
                  Tạo sự kiện
                </button>
              </div>
            </div>

            {/* EMPTY STATE */}
            {events.length === 0 && (
              <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-16 text-center">
                <h2 className="text-3xl font-black mb-3">Chưa có sự kiện</h2>
                <p className="text-gray-400">Hãy tạo sự kiện đầu tiên của bạn</p>
              </div>
            )}

            {/* EVENT LIST */}
            <div className="grid lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-white/20 transition-all"
                >
                  <img
                    src={getImageUrl(event.image_url)}
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_PLACEHOLDER;
                    }}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    <div
                      className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </div>

                    <h2 className="text-2xl font-bold line-clamp-1">
                      {event.title}
                    </h2>

                    <p className="text-gray-400 mt-2 font-medium">
                      {event.category_name || "Chưa phân loại"}
                    </p>

                    <p className="text-gray-500 mt-1 line-clamp-1">
                      📍 {event.location || "Chưa cập nhật địa điểm"}
                    </p>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          navigate(`/organizer/event/${event.id}`)
                        }
                        className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all"
                      >
                        Xem chi tiết
                      </button>

                      {event.status?.toUpperCase() !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(event.id)}
                          className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition-all"
                        >
                          Hủy sự kiện
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}