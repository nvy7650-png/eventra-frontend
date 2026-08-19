import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AutoBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setEvent(data.event);
        setShowtimes(data.showtimes || []);
        setZones(data.zones || []);

        if (data.showtimes?.length) {
          setSelectedShowtime(data.showtimes[0].id);
        }
      })
      .catch(console.log);
  }, [id]);

  const updateQty = (zoneId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [zoneId]: Math.max(0, (prev[zoneId] || 0) + value),
    }));
  };

  const currentZones = zones;

  const totalQuantity = Object.values(quantities).reduce(
    (a, b) => a + b,
    0
  );

  const totalPrice = currentZones.reduce((sum, zone) => {
    return sum + (quantities[zone.id] || 0) * zone.price;
  }, 0);

  async function handleCheckout() {
    try {
      const items = [];
      currentZones.forEach((zone) => {
        const qty = quantities[zone.id] || 0;
        if (qty <= 0) return;
        items.push({
          zone_id: zone.id,
          zone_name: zone.name,
          showtime_id: selectedShowtime,
          quantity: qty,
          price: zone.price,
        });
      });

      navigate("/checkout-auto", {
        state: {
          event,
          showtime: showtimes.find((s) => s.id === selectedShowtime),
          items,
          quantity: totalQuantity,
          totalPrice,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Không thể tạo đơn hàng");
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm tracking-wider uppercase font-medium">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-100 flex flex-col selection:bg-sky-500 selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* HEADER SECTION */}
        <header className="mb-8 md:mb-10 border-b border-white/10 pb-8">
          <span className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Bước 1/3 Đặt vé
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          {/* SHOWTIME SELECTOR */}
          <div className="mt-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Chọn xuất chiếu
            </h2>
            <div className="flex flex-wrap gap-3">
              {showtimes.map((st) => {
                const isSelected = selectedShowtime === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedShowtime(st.id)}
                    className={`px-4 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-sky-500 border-sky-400 text-gray-950 font-bold shadow-lg shadow-sky-500/20 scale-[1.02]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs opacity-80">
                      {new Date(st.start_time).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-sm font-semibold mt-0.5">
                      {new Date(st.start_time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* MAIN GRID CONTENT */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* LEFT: ZONES LIST */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">
              Danh sách Hạng vé
            </h2>
            {currentZones.map((zone) => {
              const qty = quantities[zone.id] || 0;
              return (
                <div
                  key={zone.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                    qty > 0
                      ? "bg-[#0f172a] border-sky-500/50 shadow-md shadow-sky-500/5"
                      : "bg-[#0d1322] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {zone.name}
                      </h3>
                      <p className="text-sky-400 text-lg sm:text-xl font-extrabold mt-1">
                        {zone.price.toLocaleString("vi-VN")}
                        <span className="text-xs ml-1 uppercase">đ</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-white/5">
                      <button
                        type="button"
                        onClick={() => updateQty(zone.id, -1)}
                        disabled={qty === 0}
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg font-bold transition-all ${
                          qty > 0
                            ? "bg-white/10 border-white/20 text-white hover:bg-white/20 active:scale-95"
                            : "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        -
                      </button>

                      <span className="w-8 text-center text-lg font-extrabold text-white">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQty(zone.id, 1)}
                        className="w-9 h-9 rounded-lg bg-sky-500 text-gray-950 font-bold text-lg flex items-center justify-center hover:bg-sky-400 active:scale-95 transition-all shadow-md shadow-sky-500/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-4">
                Tóm tắt đơn hàng
              </h2>

              {/* LIST ITEMS */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {currentZones.map((zone) => {
                  const qty = quantities[zone.id] || 0;
                  if (!qty) return null;

                  return (
                    <div
                      key={zone.id}
                      className="flex justify-between items-center text-sm text-gray-300"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium text-white">{zone.name}</span>
                        <span className="text-sky-400 font-semibold ml-2">
                          x{qty}
                        </span>
                      </div>
                      <span className="font-semibold whitespace-nowrap text-gray-200">
                        {(qty * zone.price).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  );
                })}

                {totalQuantity === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4 italic">
                    Chưa có hạng vé nào được chọn
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* STATS */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tổng số lượng vé</span>
                  <span className="font-semibold text-white">{totalQuantity}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-base font-bold text-gray-200">
                    Tổng tiền
                  </span>
                  <span className="text-2xl font-black text-sky-400">
                    {totalPrice.toLocaleString("vi-VN")}
                    <span className="text-xs font-normal ml-0.5">đ</span>
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={totalQuantity === 0}
                className={`mt-6 w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                  totalQuantity === 0
                    ? "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-400 text-gray-950 shadow-lg shadow-sky-500/25 active:scale-[0.98] cursor-pointer"
                }`}
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}