import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { promotion, discount, totalPrice } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`
        );
        const data = await res.json();

        if (!res.ok) {
          return;
        }

        setOrder(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleVNPay = async () => {
    try {
      setPaying(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: order.total_price,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPaying(false);
        return;
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      console.log(err);
      setPaying(false);
    }
  };

  const handleDemoSuccess = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/test/payment-success/${order.id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Demo thất bại");
        return;
      }

      navigate(`/payment-success?orderId=${order.id}`);
    } catch (err) {
      console.log(err);
      alert("Lỗi server");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
          Đang tải đơn hàng...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
        <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-8 text-center max-w-sm w-full">
          <p className="text-xl font-bold text-red-400">Không tìm thấy đơn hàng</p>
          <p className="text-sm text-gray-400 mt-2">Đơn hàng không tồn tại hoặc đã bị hủy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex flex-col justify-between selection:bg-sky-500 selection:text-black">
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <header className="mb-8 border-b border-white/10 pb-6">
          <span className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
            Thanh toán an toàn
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Cổng Thanh Toán
          </h1>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* LEFT: QR CODE SECTION */}
          <div className="bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Quét mã QR
            </h2>

            <div className="bg-white rounded-2xl p-4 max-w-[280px] sm:max-w-xs mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=HOMIETICKET_ORDER_${order.id}`}
                alt="QR Payment"
                className="w-full aspect-square object-contain"
              />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex gap-3 items-start">
              <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Quét mã QR bằng ứng dụng ngân hàng hoặc nhấn nút bên phải để chuyển trực tiếp sang cổng <strong>VNPay</strong>.
              </span>
            </div>
          </div>

          {/* RIGHT: PAYMENT INFO */}
          <div className="bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Thông tin thanh toán
              </h2>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Mã đơn hàng</span>
                  <span className="text-lg font-extrabold text-white">#{order.id}</span>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Số lượng vé</span>
                  <span className="text-lg font-bold text-white">
                    {order.seats && order.seats.length > 0
                      ? `${order.seats.length} vé`
                      : `${order.quantity || 0} vé`}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Nội dung chuyển khoản</span>
                  <span className="text-base font-bold text-sky-400 break-all">
                    HOMIETICKET_{order.id}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4 mt-2">
                  <span className="text-sm text-gray-400">Tổng thanh toán</span>
                  <div className="text-3xl sm:text-4xl font-black text-sky-400 mt-1">
                    {Math.round(
                      Number(totalPrice ?? order.total_price)
                    ).toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs sm:text-sm flex gap-3 items-start">
                  <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Sau khi thanh toán thành công, hệ thống sẽ tự động phát hành vé điện tử cho tài khoản của bạn.
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVNPay}
              disabled={paying}
              className="w-full mt-8 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-gray-950 font-extrabold text-base uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-sky-500/20"
            >
              {paying ? "Đang chuyển tới VNPay..." : "Thanh toán với VNPay"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}