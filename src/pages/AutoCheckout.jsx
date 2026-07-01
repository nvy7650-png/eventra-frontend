import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AutoCheckout() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const {
    event,
    showtime,
    items,
    quantity,
    totalPrice,
  } =
    location.state || {};

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!event) {

    return (
      <div className="
        min-h-screen
        bg-[#050816]
        text-white
        flex
        items-center
        justify-center
      ">
        Không có dữ liệu đặt vé
      </div>
    );

  }

  const handleCheckout =
    async () => {

      if (!user) {

        alert(
          "Vui lòng đăng nhập"
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                user_id:
                  user.id,
                event_id:
                  event.id,
                showtime_id:
                  showtime.id,
                items,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Tạo đơn thất bại"
          );

          return;

        }

        navigate(
          `/payment/${data.order_id}`,
          {
            state: {
              orderId:
                data.order_id,
              event,
              showtime,
              quantity,
              items,
              totalPrice,
            },
          }
        );

      } catch (err) {

        console.log(err);

        alert(
          "Lỗi server"
        );

      } finally {

        setLoading(false);

      }

    };

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        <h1 className="
          text-3xl
          md:text-5xl
          font-black
        ">
          Xác nhận đơn hàng
        </h1>

        <div className="
          grid
          lg:grid-cols-[1fr_360px]
          gap-8
          mt-8
        ">

          {/* LEFT */}

          <div className="
            bg-[#0B1220]
            border
            border-white/10
            rounded-3xl
            overflow-hidden
          ">

            <img
              src={event.image_url}
              alt={event.title}
              className="
                w-full
                h-[280px]
                object-cover
              "
            />

            <div className="p-8">

              <h2 className="
                text-3xl
                font-black
              ">
                {event.title}
              </h2>

              <p className="
                text-gray-400
                mt-3
              ">
                {new Date(
                  showtime.start_time
                ).toLocaleString(
                  "vi-VN"
                )}
              </p>

              <div className="
                mt-8
                space-y-4
              ">

                {items.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="
                        flex
                        justify-between
                        items-center

                        p-4

                        rounded-2xl

                        bg-white/5
                        border
                        border-white/10
                      "
                    >

                      <div>

                        <div className="
                          font-bold
                        ">
                          {item.zone_name}
                        </div>

                        <div className="
                          text-gray-400
                          text-sm
                        ">
                          {item.quantity} vé
                        </div>

                      </div>

                      <div className="
                        text-sky-400
                        font-bold
                      ">
                        {(
                          item.quantity *
                          item.price
                        ).toLocaleString(
                          "vi-VN"
                        )}đ
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="
            bg-[#0B1220]
            border
            border-white/10
            rounded-3xl
            p-6

            h-fit
            sticky
            top-24
          ">

            <h2 className="
              text-2xl
              font-black
              mb-6
            ">
              Đơn hàng
            </h2>

            <div className="
              space-y-4
            ">

              <div className="
                flex
                justify-between
              ">
                <span className="text-gray-400">
                  Tổng số vé
                </span>

                <span>
                  {quantity}
                </span>
              </div>

              <div className="
                border-t
                border-white/10
                pt-4

                flex
                justify-between
                items-center
              ">

                <span className="
                  text-xl
                  font-bold
                ">
                  Tổng tiền
                </span>

                <span className="
                  text-3xl
                  font-black
                  text-sky-400
                ">
                  {Number(
                    totalPrice
                  ).toLocaleString(
                    "vi-VN"
                  )}đ
                </span>

              </div>

            </div>

            <button
              onClick={
                handleCheckout
              }
              disabled={
                loading
              }
              className="
                mt-8
                w-full
                py-4

                rounded-2xl

                bg-sky-500

                text-black
                font-bold

                disabled:opacity-50
              "
            >
              {
                loading
                  ? "Đang tạo đơn..."
                  : "Tiếp tục thanh toán"
              }
            </button>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}