import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerTicketDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/event/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data || []);
      })
      .catch((err) => {
        console.log(err);
        setTickets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "VALID":
        return "bg-green-500/20 text-green-400";
      case "USED":
        return "bg-yellow-500/20 text-yellow-400";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#050816] text-white">
        <OrganizerSidebar />

        <div   className="
    ml-80
    flex-1
    min-h-screen
   px-6 py-10">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            Đang tải danh sách vé...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050816] text-white">
      <OrganizerSidebar />

      <div className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black">Danh sách vé</h1>
              <p className="text-gray-400 mt-2">Xem chi tiết các vé theo sự kiện</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/organizer/tickets")}
                className="px-5 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-semibold"
              >
                Quay lại
              </button>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-16 text-center">
              <h2 className="text-3xl font-black mb-3">Chưa có vé</h2>
              <p className="text-gray-400">Không có vé nào cho sự kiện này.</p>
            </div>
          ) : (
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm">
                      <th className="py-3 px-4">Mã vé</th>
                      <th className="py-3 px-4">Zone</th>
                      <th className="py-3 px-4">Ghế</th>
                      <th className="py-3 px-4">Khách hàng</th>
                      <th className="py-3 px-4">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id} className="border-t border-white/5">
                        <td className="py-4 px-4 font-medium">{t.ticket_code ?? t.code ?? t.id}</td>
                        <td className="py-4 px-4 text-gray-300">{t.zone_name ?? t.zone ?? "-"}</td>
                        <td className="py-4 px-4 text-gray-300">{t.seat_code ?? t.seat ?? "-"}</td>
                        <td className="py-4 px-4 text-gray-300">{t.user_name ?? "-"}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                              t.status
                            )}`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
