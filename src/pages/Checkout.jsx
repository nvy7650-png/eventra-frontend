import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    event,
    showtime,
    zone,
    seats,
    totalPrice,
  } = location.state || {};

  const handleCreateOrder = async () => {

  if (loading) return;

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!user) {
    alert("Vui lòng đăng nhập");
    return;
  }

  try {

    setLoading(true);

    const items = seats.map((seat) => ({
      showtime_id: showtime.id,
      zone_id: zone.id,
      seat_id: seat.id,
      quantity: 1,
      price: Number(zone.price),
    }));

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event.id,
          showtime_id: showtime.id,
          items,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(
        data.message ||
        "Tạo đơn hàng thất bại"
      );

      return;
    }

    navigate(
  `/payment/${data.order_id}`,
  {
    state: {
      orderId: data.order_id,
      event,
      showtime,
      zone,
      seats,
      totalPrice,
    },
  }
);

    console.log(data);

  } catch (err) {

    console.log(err);

    alert("Lỗi kết nối server");

  } finally {

    setLoading(false);

  }

};

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Không có dữ liệu đặt vé
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-4xl mx-auto py-12 px-6">

        <h1 className="text-4xl font-bold text-sky-400 mb-8">
          Xác nhận đặt vé
        </h1>

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

          <div className="mb-6">
            <div className="text-gray-400 mb-2">
              Sự kiện
            </div>

            <div className="text-xl font-bold">
              {event.title}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-400 mb-2">
              Suất diễn
            </div>

            <div>
              {new Date(showtime.start_time).toLocaleString("vi-VN")}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-400 mb-2">
              Khu vực
            </div>

            <div>
              {zone?.name}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-400 mb-2">
              Ghế đã chọn
            </div>

            <div className="flex flex-wrap gap-2">

              {seats?.map((seat) => (

                <span
                  key={seat.id}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-sky-500
                    text-black
                    font-semibold
                  "
                >
                  {seat.seat_code}
                </span>

              ))}

            </div>
          </div>

          <div className="mb-8">
            <div className="text-gray-400 mb-2">
              Tổng tiền
            </div>

            <div className="text-3xl font-bold text-sky-400">
              {Number(totalPrice).toLocaleString("vi-VN")}đ
            </div>
          </div>

          <div className="flex gap-4">

            <button
              onClick={() => navigate(-1)}
              className="
                flex-1
                py-4
                rounded-2xl
                bg-gray-700
                hover:bg-gray-600
              "
            >
              Quay lại
            </button>
<button
  onClick={handleCreateOrder}
  disabled={loading}
  className="
    flex-1
    py-4
    rounded-2xl
    bg-sky-500
    text-black
    font-bold
    hover:bg-sky-400
    disabled:opacity-50
  "
>
  {loading
    ? "Đang tạo đơn..."
    : "Xác nhận đặt vé"}
</button>

          </div>

        </div>

      </div>

    </div>
  );
}