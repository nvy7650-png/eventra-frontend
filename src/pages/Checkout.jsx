import { useLocation, useNavigate } from "react-router-dom";
import {
  useState,
  useEffect,
} from "react";

export default function Checkout() {
  const [timeLeft, setTimeLeft] =
  useState(0);

  const minutes =
  Math.floor(timeLeft / 60);

const seconds =
  timeLeft % 60;

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
  event,
  showtime,
  zone,
  seats,
  totalPrice,
  expiresAt,
} = location.state || {};

const user = JSON.parse(
  localStorage.getItem("user") || "null"
);

console.log(
  "EXPIRES FROM STATE:",
  expiresAt
);

console.log(
  "NOW:",
  new Date()
);

  useEffect(() => {

  if (!expiresAt) return;

  const timer =
    setInterval(() => {

      const expireTime =
  new Date(expiresAt).getTime();

const now =
  Date.now();

const diff =
  Math.max(
    0,
    Math.floor(
      (expireTime - now) / 1000
    )
  );

      if (diff <= 0) {

        clearInterval(timer);

        setTimeLeft(0);

        alert(
          "Hết thời gian giữ ghế"
        );

        navigate(-1);

        return;
      }

      setTimeLeft(diff);

    }, 1000);

  return () =>
    clearInterval(timer);

}, [expiresAt]);

 const releaseHold = async () => {

  try {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/holds/release`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          showtime_id: showtime.id,
          seat_ids: seats.map(
            (seat) => seat.id
          ),
        }),
      }
    );

  } catch (err) {

    console.log(
      "Release hold error:",
      err
    );

  }

};

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
  <div className="min-h-screen bg-[#050816] text-white">

    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <h1
        className="
          text-3xl
          md:text-5xl
          font-black
          mb-8
        "
      >
        Xác nhận đơn hàng
      </h1>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* LEFT */}

        <div
          className="
            lg:col-span-2
            bg-white/5
            border
            border-white/10
            rounded-3xl
            overflow-hidden
          "
        >

          <img
            src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
            alt={event.title}
            className="
              w-full
              h-[220px]
              md:h-[320px]
              object-cover
            "
          />

          <div className="p-6 md:p-8">

            <h2
              className="
                text-2xl
                md:text-3xl
                font-black
                mb-6
              "
            >
              {event.title}
            </h2>

            <div className="space-y-6">

              <div>
                <p className="text-gray-500 mb-1">
                  Suất diễn
                </p>

                <p className="font-semibold">
                  {new Date(
                    showtime.start_time
                  ).toLocaleString(
                    "vi-VN",
                    {
                      dateStyle: "full",
                      timeStyle: "short",
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">
                  Khu vực
                </p>

                <p
                  className="
                    text-sky-400
                    font-bold
                  "
                >
                  {zone?.name}
                </p>
              </div>

              <div>

                <p className="text-gray-500 mb-3">
                  Ghế đã chọn
                </p>

                <div className="flex flex-wrap gap-2">

                  {seats?.map((seat) => (

                    <span
                      key={seat.id}
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-sky-500/20
                        border
                        border-sky-500/30
                        text-sky-400
                        font-semibold
                      "
                    >
                      {seat.seat_code}
                    </span>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6

            h-fit
            lg:sticky
            lg:top-6
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Chi tiết thanh toán
          </h3>
          <div
  className="
    mb-6
    p-4
    rounded-2xl
    bg-red-500/10
    border
    border-red-500/30
  "
>

  <div className="text-sm text-gray-400">
    Thời gian giữ ghế
  </div>

  <div
    className="
      text-3xl
      font-black
      text-red-400
    "
  >
    {String(minutes).padStart(2, "0")}
    :
    {String(seconds).padStart(2, "0")}
  </div>

</div>

          <div className="space-y-4">

            <div className="flex justify-between">

              <span className="text-gray-400">
                Số lượng vé
              </span>

              <span>
                {seats.length}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">
                Giá mỗi vé
              </span>

              <span>
                {Number(
                  zone.price
                ).toLocaleString("vi-VN")}đ
              </span>

            </div>

            <div className="border-t border-white/10 pt-4">

              <div className="flex justify-between items-center">

                <span className="text-lg font-semibold">
                  Tổng cộng
                </span>

                <span
                  className="
                    text-3xl
                    font-black
                    text-sky-400
                  "
                >
                  {Number(
                    totalPrice
                  ).toLocaleString("vi-VN")}đ
                </span>

              </div>

            </div>

          </div>

          <div className="mt-8 space-y-3">

            <button
              onClick={async () => {

    await releaseHold();

    navigate(-1);

  }}
              className="
                w-full
                py-4
                rounded-2xl
                bg-white/10
                hover:bg-white/15
                transition
              "
            >
              Quay lại
            </button>

            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="
                w-full
                py-4
                rounded-2xl

                bg-gradient-to-r
                from-sky-500
                to-cyan-400

                text-black
                font-bold

                hover:opacity-90
                transition

                disabled:opacity-50
              "
            >
              {loading
                ? "Đang tạo đơn..."
                : "Tiếp tục thanh toán"}
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>
);

}