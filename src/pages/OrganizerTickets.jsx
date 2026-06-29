import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerTickets() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/organizer/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("TICKET DATA", data);
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
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

  const getPercent = (sold, total) => {
  if (!total) return 0;

  return Math.round(
    (sold / total) * 100
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050816]">
      <OrganizerSidebar />

      <div className="ml-80">
        <div className="text-white px-6 py-10">
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black">Quản lý vé</h1>
                <p className="text-gray-400 mt-2">Xem thống kê vé cho các sự kiện của bạn</p>
              </div>
            </div>

            {/* EMPTY */}
            {events.length === 0 && (
              <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-16 text-center">
                <h2 className="text-3xl font-black mb-3">Chưa có dữ liệu vé</h2>
                <p className="text-gray-400">Các vé sẽ xuất hiện khi có sự kiện và vé bán.</p>
              </div>
            )}

            {/* LIST */}
            <div className="grid lg:grid-cols-2 gap-6">
              {events.map((event) => {

  const sold =
    Number(event.sold_tickets) || 0;

  const total =
    Number(event.total_tickets) || 0;

  const checked =
    Number(event.checked_in) || 0;

  const remaining =
    total - sold;

  const percent =
    getPercent(
      sold,
      total
    );

  return (
                
                <div
                  key={event.event_id}
                  className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden"
                >
                  <div className="p-6">
                    <div
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </div>

                    <h2 className="text-2xl font-bold">{event.title}</h2>

                    <div className="grid grid-cols-2 gap-5 mt-6">

  <div>
    <p className="text-sm text-gray-400">
      Tổng vé
    </p>

    <p className="text-2xl font-bold">
      {total}
    </p>
  </div>

  <div>
    <p className="text-sm text-gray-400">
      Đã bán
    </p>

    <p className="text-2xl font-bold text-sky-400">
      {sold}
    </p>
  </div>

  <div>
    <p className="text-sm text-gray-400">
      Check-in
    </p>

    <p className="text-2xl font-bold text-green-400">
      {checked}
    </p>
  </div>

  <div>
    <p className="text-sm text-gray-400">
      Còn lại
    </p>

    <p className="text-2xl font-bold text-yellow-400">
      {remaining}
    </p>
  </div>

</div>
<div className="mt-6">

  <div className="flex justify-between mb-2 text-sm">

    <span className="text-gray-400">
      Tỷ lệ bán
    </span>

    <span className="text-sky-400 font-semibold">
      {percent}%
    </span>

  </div>

  <div className="h-2 bg-white/10 rounded-full overflow-hidden">

    <div
      className="h-full bg-sky-500 transition-all"
      style={{
        width: `${percent}%`,
      }}
    />

  </div>

</div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => navigate(`/organizer/tickets/${event.event_id}`)}
                        className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold"
                      >
                        Xem danh sách vé
                      </button>
                    </div>
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
