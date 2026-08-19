import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, XCircle } from "lucide-react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerEvents() {
  const navigate = useNavigate();

  // Tối ưu parse user để tránh crash trang nếu localStorage rỗng
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy danh sách sự kiện");
        return res.json();
      })
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Lỗi fetch events:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Chờ duyệt";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleCancel = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn hủy sự kiện này?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/cancel`,
        { method: "PUT" }
      );

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
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white font-medium">
        Đang tải dữ liệu...
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
                <h1 className="text-4xl font-black tracking-tight">
                  Sự kiện của tôi
                </h1>
                <p className="text-gray-400 mt-2">
                  Quản lý và theo dõi trạng thái các sự kiện đã tạo
                </p>
              </div>

              <button
                onClick={() => navigate("/organizer/create-event")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold transition shadow-lg shadow-sky-500/20"
              >
                <Plus size={20} />
                Tạo sự kiện
              </button>
            </div>

            {/* EMPTY STATE */}
            {events.length === 0 && (
              <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-16 text-center">
                <h2 className="text-2xl font-bold mb-2">Chưa có sự kiện nào</h2>
                <p className="text-gray-400 text-sm">
                  Hãy bắt đầu tạo sự kiện đầu tiên của bạn ngay hôm nay.
                </p>
              </div>
            )}

            {/* EVENT LIST */}
            <div className="grid lg:grid-cols-2 gap-6">
              {events.map((event) => {
                const imageUrl = event.image_url?.startsWith("http")
                  ? event.image_url
                  : event.image_url
                  ? `${import.meta.env.VITE_API_URL}${event.image_url}`
                  : "https://via.placeholder.com/600x400?text=No+Image";

                return (
                  <div
                    key={event.id}
                    className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition"
                  >
                    <div>
                      <div className="relative h-56 w-full">
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {getStatusText(event.status)}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h2 className="text-xl font-bold line-clamp-1">
                          {event.title}
                        </h2>
                        <p className="text-sky-400 text-sm mt-1 font-medium">
                          {event.category_name || "Chưa phân loại"}
                        </p>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-1">
                          📍 {event.location || "Chưa cập nhật địa điểm"}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="p-6 pt-0 flex items-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/organizer/event/${event.id}`)
                        }
                        className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm transition text-center"
                      >
                        Xem chi tiết
                      </button>

                      {/* Bổ sung nút Hủy sự kiện nếu sự kiện chưa bị hủy */}
                      {event.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(event.id)}
                          className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold text-sm transition flex items-center gap-1.5"
                          title="Hủy sự kiện"
                        >
                          <XCircle size={18} />
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}