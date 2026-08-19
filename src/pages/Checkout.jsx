import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promotion, setPromotion] = useState(null);

  const {
    event,
    showtime,
    zone,
    seats = [],
    items = [],
    totalPrice = 0,
    expiresAt,
  } = location.state || {};

  const [finalPrice, setFinalPrice] = useState(totalPrice || 0);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Hàm nhả ghế giữ
  const releaseHold = async () => {
    if (!user || !showtime || !seats?.length) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/holds/release`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          showtime_id: showtime.id,
          seat_ids: seats.map((seat) => seat.id),
        }),
      });
    } catch (err) {
      console.error("Lỗi khi nhả ghế:", err);
    }
  };

  // Timer đếm ngược thời gian giữ ghế
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const expireTime = new Date(expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expireTime - now) / 1000));

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        (async () => {
          await releaseHold();
          alert("Hết thời gian giữ ghế! Vui lòng chọn lại.");
          navigate(-1);
        })();
        return;
      }

      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // Áp dụng khuyến mãi
  const applyPromotion = async () => {
    if (!coupon.trim()) {
      alert("Vui lòng nhập mã khuyến mãi");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/promotions/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: coupon,
            total_price: totalPrice,
            event_id: event.id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Mã không hợp lệ");
        return;
      }

      setDiscount(data.discount);
      setFinalPrice(data.final_price);
      setPromotion(data.promotion);
      alert("Áp dụng mã thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi áp dụng mã");
    }
  };

  // Tạo đơn hàng
  const handleCreateOrder = async () => {
    if (loading) return;

    if (!user) {
      alert("Vui lòng đăng nhập để hoàn tất đặt vé");
      return;
    }

    try {
      setLoading(true);

      let orderItems = [];
      if (seats?.length) {
        orderItems = seats.map((seat) => ({
          showtime_id: showtime.id,
          zone_id: seat.zone_id,
          seat_id: seat.id,
          quantity: 1,
          price: Number(seat.price),
        }));
      } else {
        orderItems = items;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event.id,
          showtime_id: showtime.id,
          promotion_id: promotion?.id || null,
          items: orderItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Tạo đơn hàng thất bại");
        return;
      }

      navigate(`/payment/${data.order_id}`, {
        state: {
          orderId: data.order_id,
          event,
          showtime,
          zone,
          seats,
          totalPrice: data.total_price,
          discount: data.discount,
          promotion,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <p className="text-gray-400 font-medium">Không có dữ liệu đặt vé</p>
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

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full flex-grow">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            Bước 2 / 3 - Giữ ghế & Thanh toán
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-3">
            Xác nhận đơn hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poster & Thông tin sự kiện */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[220px] md:h-[320px]">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
              </div>

              <div className="p-6 md:p-8 -mt-10 relative z-10">
                <h2 className="text-2xl md:text-3xl font-black leading-tight">
                  {event.title}
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                      📅
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Suất diễn
                      </p>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {new Date(showtime.start_time).toLocaleString("vi-VN", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Khu vực chọn
                      </p>
                      <p className="text-sm font-bold text-sky-400 mt-0.5">
                        {zone?.name || "Khu vực tự do"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết ghế ngồi */}
            <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>💺</span> Danh sách ghế chọn ({seats?.length || 0})
                </h3>
              </div>

              {seats?.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      className="px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-sm flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      Ghế {seat.seat_code}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Không có vị trí ghế cố định.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SECTION: Cột thanh toán */}
          <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 lg:sticky lg:top-24 space-y-6 shadow-2xl">
            {/* Đếm ngược giữ ghế */}
            {expiresAt && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-300 font-medium">
                    Thời gian giữ ghế còn lại
                  </p>
                  <p className="text-2xl font-black text-red-400 tracking-wider mt-0.5">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl text-red-400 animate-pulse">
                  ⏳
                </div>
              </div>
            )}

            <h3 className="text-xl font-black pb-4 border-b border-white/10">
              Chi tiết thanh toán
            </h3>

            {/* Mã khuyến mãi */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Mã khuyến mãi
              </label>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Nhập mã ưu đãi"
                  className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none text-sm text-white focus:border-sky-400 transition"
                />
                <button
                  onClick={applyPromotion}
                  className="px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition whitespace-nowrap"
                >
                  Áp dụng
                </button>
              </div>

              {promotion && (
                <p className="text-xs text-emerald-400 font-semibold pt-1">
                  ✓ Đã áp dụng mã: {promotion.code}
                </p>
              )}
            </div>

            {/* Bảng giá */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Số lượng vé</span>
                <span className="text-white font-semibold">
                  {seats.length || 1} vé
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Tạm tính</span>
                <span className="text-white font-semibold">
                  {Number(totalPrice).toLocaleString("vi-VN")}đ
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400 font-semibold">
                  <span>Giảm giá</span>
                  <span>-{Number(discount).toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400">Tổng cộng</p>
                  <p className="text-3xl font-black text-sky-400 mt-0.5">
                    {Number(finalPrice).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Các nút bấm */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-black font-extrabold hover:opacity-90 transition disabled:opacity-50 text-base shadow-lg shadow-sky-500/20"
              >
                {loading ? "Đang tạo đơn..." : "Tiếp tục thanh toán ➔"}
              </button>

              <button
                onClick={async () => {
                  await releaseHold();
                  navigate(-1);
                }}
                className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-sm transition"
              >
                Hủy & Chọn lại ghế
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}