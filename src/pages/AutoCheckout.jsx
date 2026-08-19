import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AutoCheckout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [applying, setApplying] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const { event, showtime, items, quantity, totalPrice } =
    location.state || {};

  useEffect(() => {
    setFinalPrice(totalPrice || 0);
  }, [totalPrice]);

  useEffect(() => {
    if (!event?.id) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/promotions/event/${event.id}`)
      .then((res) => res.json())
      .then((data) => setPromotions(data || []))
      .catch(console.log);
  }, [event]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">
            🎟️
          </div>
          <p className="text-gray-400 font-medium">
            Không tìm thấy thông tin đơn hàng
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-sky-500 text-black font-bold text-sm hover:bg-sky-400 transition"
          >
            Quay lại trang chủ
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleApplyPromotion = async () => {
    if (!promoCode) return;

    try {
      setApplying(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/promotions/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: promoCode,
            total_price: totalPrice,
            event_id: event.id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setDiscount(data.discount);
      setFinalPrice(data.final_price);
      setSelectedPromotion(data.promotion);
    } catch (err) {
      console.log(err);
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để hoàn tất thanh toán");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event.id,
          showtime_id: showtime.id,
          items,
          promotion_id: selectedPromotion?.id || null,
          discount,
          total_price: finalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Tạo đơn thất bại");
        return;
      }

      navigate(`/payment/${data.order_id}`, {
        state: {
          orderId: data.order_id,
          event,
          showtime,
          quantity,
          items,
          totalPrice: data.total_price,
          discount: data.discount,
          promotion: promoCode,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 w-full flex-grow">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            Bước 2 / 3 - Thanh toán
          </span>
          <h1 className="text-3xl md:text-4xl font-black mt-3">
            Xác nhận đơn hàng
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* LEFT: Thông tin sự kiện & Danh sách vé */}
          <div className="space-y-6">
            {/* Thẻ sự kiện */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="relative h-[220px] md:h-[300px]">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
              </div>

              <div className="p-6 md:p-8 -mt-12 relative z-10">
                <h2 className="text-2xl md:text-3xl font-black leading-tight">
                  {event.title}
                </h2>

                <div className="mt-4 flex items-center gap-3 text-gray-300 text-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                    📅
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Thời gian biểu diễn</p>
                    <p className="font-semibold text-white">
                      {new Date(showtime.start_time).toLocaleString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết vé chọn */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎫</span> Chi tiết hạng vé
              </h3>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                  >
                    <div>
                      <p className="font-bold text-white text-base">
                        {item.zone_name}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Số lượng:{" "}
                        <span className="text-sky-400 font-semibold">
                          {item.quantity} vé
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sky-400 font-bold text-lg">
                        {(item.quantity * item.price).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Khung thanh toán & Mã giảm giá */}
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 lg:sticky lg:top-24 space-y-6 shadow-2xl">
            <h2 className="text-xl font-black pb-4 border-b border-white/10">
              Tóm tắt thanh toán
            </h2>

            {/* Mã giảm giá */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Mã ưu đãi / Voucher
              </label>

              <div className="flex gap-2">
                <select
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none text-sm text-white focus:border-sky-400 transition"
                >
                  <option value="">-- Chọn mã ưu đãi --</option>
                  {promotions.map((promo) => (
                    <option key={promo.id} value={promo.code}>
                      {promo.code} ({promo.discount_percent ? `-${promo.discount_percent}%` : `-${Number(promo.discount_amount).toLocaleString("vi-VN")}đ`})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleApplyPromotion}
                  disabled={!promoCode || applying}
                  className="px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {applying ? "..." : "Áp dụng"}
                </button>
              </div>

              {selectedPromotion && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex justify-between items-center">
                  <span>Mã <b>{selectedPromotion.code}</b> đã áp dụng</span>
                  <span className="font-bold">✓</span>
                </div>
              )}
            </div>

            {/* Bảng tính tiền */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Tạm tính</span>
                <span className="text-white font-medium">
                  {Number(totalPrice).toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Giảm giá</span>
                <span className="text-green-400 font-bold">
                  -{Number(discount).toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400">Tổng thanh toán</p>
                  <p className="text-2xl font-black text-sky-400 mt-0.5">
                    {Number(finalPrice).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-black font-extrabold hover:opacity-90 transition disabled:opacity-50 text-base shadow-lg shadow-sky-500/20"
            >
              {loading ? "Đang khởi tạo..." : "Thanh toán ngay ➔"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}