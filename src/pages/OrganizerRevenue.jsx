import { useEffect, useState } from "react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerRevenue() {
  // Lấy userId trực tiếp để không bị re-render vô tận
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.id;

  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Modal xem chi tiết đơn hàng
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/revenue/organizer/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRevenues(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setRevenues([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  // Hàm gọi API lấy chi tiết các đơn hàng khi click vào sự kiện
  const handleOpenEventOrders = (eventItem) => {
    setSelectedEvent(eventItem);
    setLoadingOrders(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/revenue/event/${eventItem.id}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setOrders([]);
      })
      .finally(() => {
        setLoadingOrders(false);
      });
  };

  const totalRevenue = revenues.reduce(
    (sum, item) => sum + Number(item.revenue || 0),
    0
  );

  const totalSold = revenues.reduce(
    (sum, item) => sum + Number(item.sold_tickets || 0),
    0
  );

  const totalCheckin = revenues.reduce(
    (sum, item) => sum + Number(item.checked_in || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <OrganizerSidebar />
        <div className="ml-80 min-h-screen flex items-center justify-center">
          Đang tải doanh thu...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <OrganizerSidebar />

      <div className="ml-80 p-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-black">Doanh thu</h1>
          <p className="text-gray-400 mt-2">
            Thống kê doanh thu thực tế (nhấp vào sự kiện để xem các đơn hàng đã bán)
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">Tổng doanh thu thực nhận</p>
            <h2 className="text-4xl font-black text-green-400 mt-3">
              {Number(totalRevenue).toLocaleString("vi-VN")} đ
            </h2>
          </div>

          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">Vé đã bán</p>
            <h2 className="text-4xl font-black text-sky-400 mt-3">
              {totalSold}
            </h2>
          </div>

          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400">Đã check-in</p>
            <h2 className="text-4xl font-black text-yellow-400 mt-3">
              {totalCheckin}
            </h2>
          </div>
        </div>

        {/* EVENT LIST */}
        <div className="space-y-6">
          {revenues.map((item) => {
            const percent =
              item.sold_tickets && item.total_tickets
                ? Math.round((item.sold_tickets / item.total_tickets) * 100)
                : 0;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenEventOrders(item)}
                className="bg-[#0B1120] border border-white/10 hover:border-sky-500/50 transition-all cursor-pointer rounded-3xl p-7 group"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold group-hover:text-sky-400 transition-colors flex items-center gap-2">
                    {item.title}
                  </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm">Vé bán</p>
                    <p className="text-3xl font-bold text-sky-400">
                      {item.sold_tickets}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Check-in</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {item.checked_in}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Doanh thu thực tế</p>
                    <p className="text-3xl font-bold text-green-400">
                      {Number(item.revenue || 0).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-sky-500 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {revenues.length === 0 && (
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-16 text-center">
              <h2 className="text-3xl font-black mb-3">Chưa có doanh thu</h2>
              <p className="text-gray-400">
                Các sự kiện có thanh toán thành công sẽ xuất hiện tại đây.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG THÀNH CÔNG */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Đơn hàng đã mua - {selectedEvent.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Tổng đơn: {orders.length} đơn thành công
                </p>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loadingOrders ? (
                <div className="text-center py-12 text-gray-400">
                  Đang tải đơn hàng...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  Chưa có đơn hàng nào thanh toán thành công.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                        <th className="py-3 px-4">Mã đơn</th>
                        <th className="py-3 px-4">Khách hàng</th>
                        <th className="py-3 px-4">Số lượng</th>
                        <th className="py-3 px-4">Thực thu (Sau giảm giá)</th>
                        <th className="py-3 px-4">Phương thức</th>
                        <th className="py-3 px-4">Ngày mua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {orders.map((ord) => (
                        <tr key={ord.order_id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-mono text-sky-400 font-semibold">
                            #{ord.order_id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold">{ord.user_name}</div>
                            <div className="text-xs text-gray-400">{ord.user_email}</div>
                          </td>
                          <td className="py-4 px-4 font-bold">
                            {/* Ép kiểu Number để chắc chắn không bị ẩn số */}
                            {Number(ord.ticket_quantity || 0)} vé
                          </td>
                          <td className="py-4 px-4 font-bold text-green-400">
                            {Number(ord.final_amount).toLocaleString("vi-VN")} đ
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/10">
                              {ord.payment_method || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-400 text-xs">
                            {new Date(ord.created_at).toLocaleString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}