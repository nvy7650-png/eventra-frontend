import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
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
  // PROMOTION
const [promoCode, setPromoCode] =
  useState("");

const [discount, setDiscount] =
  useState(0);

const [finalPrice, setFinalPrice] =
  useState(0);

const [applying, setApplying] =
  useState(false);
const [promotions, setPromotions] =
  useState([]);

  const {
    event,
    showtime,
    items,
    quantity,
    totalPrice,
  } =
    location.state || {};
    useEffect(() => {

  setFinalPrice(totalPrice || 0);

}, [totalPrice]);
useEffect(() => {

  if (!event?.id) return;

  fetch(
    `${import.meta.env.VITE_API_URL}/api/promotions/event/${event.id}`
  )
    .then((res) => res.json())
    .then((data) => {

      setPromotions(data || []);

    })
    .catch(console.log);

}, [event]);
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
  const handleApplyPromotion =
  async () => {

    if (!promoCode) return;

    try {

      setApplying(true);

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/api/promotions/apply`,

          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({

              code: promoCode,

              total_price: totalPrice,

              event_id: event.id,

            }),

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(data.message);

        return;

      }

      setDiscount(
        data.discount
      );

      setFinalPrice(
        data.final_price
      );

      alert(
        "Áp dụng mã thành công!"
      );

    } catch (err) {

      console.log(err);

    } finally {

      setApplying(false);

    }

  };

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

  promotion_code:
    promoCode || null,

  discount,

  total_price:
    finalPrice,

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
      orderId: data.order_id,

      event,
      showtime,
      quantity,
      items,

      totalPrice: data.total_price,
      discount: data.discount,
      promotion: promoCode,

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


  <div className="flex gap-3">

    <select
      value={promoCode}
      onChange={(e) =>
        setPromoCode(e.target.value)
      }
      className="
        flex-1
        px-4
        py-3
        rounded-xl
        bg-black/20
        border
        border-white/10
        outline-none
        text-white
      "
    >

      <option value="">
        Nhập hoặc chọn mã giảm giá
      </option>

      {promotions.map((promo) => (

        <option
          key={promo.id}
          value={promo.code}
        >
          {promo.code}
        </option>

      ))}

    </select>

    <button
      onClick={handleApplyPromotion}
      disabled={!promoCode || applying}
      className="
        px-6
        rounded-xl
        bg-sky-500
        hover:bg-sky-400
        text-black
        font-bold
        disabled:opacity-50
      "
    >

      {applying
        ? "..."
        : "Áp dụng"}

    </button>

  </div>


 
              </div>

              <div
                className="
                  border-t
                  border-white/10
                  pt-4
                  space-y-4
                "
              >

                {/* Tạm tính */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span className="text-gray-400">
                    Tạm tính
                  </span>

                  <span>
                    {Number(totalPrice).toLocaleString("vi-VN")}đ
                  </span>

                </div>

                {/* Giảm giá */}

                <div
                  className="
                    flex
                    justify-between
                  "
                >

                  <span className="text-gray-400">
                    Giảm giá
                  </span>

                  <span className="text-green-400 font-bold">

                    -{Number(discount).toLocaleString("vi-VN")}đ

                  </span>

                </div>

                {/* Thành tiền */}

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    border-t
                    border-white/10
                    pt-4
                  "
                >

                  <span
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    Thành tiền
                  </span>

                  <span
                    className="
                      text-3xl
                      font-black
                      text-sky-400
                    "
                  >

                    {Number(finalPrice).toLocaleString("vi-VN")}đ

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