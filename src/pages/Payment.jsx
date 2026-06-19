import {
useEffect,
useState,
} from "react";

import {
useParams,
} from "react-router-dom";

export default function Payment() {

const { orderId } =
useParams();

const [loading,
setLoading] =
useState(true);

const [paying,
setPaying] =
useState(false);

const [order,
setOrder] =
useState(null);

useEffect(() => {

const fetchOrder =
  async () => {

    try {

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`
        );

      const data =
        await res.json();

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

const handleVNPay =
async () => {

  try {

    setPaying(true);

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId:
              order.id,
            amount:
              order.total_price,
          }),
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      setPaying(false);

      return;

    }

    window.location.href =
      data.paymentUrl;

  } catch (err) {

    console.log(err);

    setPaying(false);

  }

};


if (loading) {


return (

  <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

    <div className="text-xl font-semibold">
      Đang tải đơn hàng...
    </div>

  </div>

);


}

if (!order) {


return (

  <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

    <div className="text-xl font-semibold">
      Không tìm thấy đơn hàng
    </div>

  </div>

);


}

return (

<div className="min-h-screen bg-[#050816] text-white">

  <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

    <h1
      className="
        text-3xl
        md:text-5xl
        font-black
        mb-8
      "
    >
      Thanh toán đơn hàng
    </h1>

    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      "
    >

      <div
        className="
          lg:col-span-2

          bg-white/5
          border
          border-white/10

          rounded-3xl
          p-6
          md:p-8
        "
      >

        <div className="mb-6">

          <div className="text-gray-400 mb-2">
            Mã đơn hàng
          </div>

          <div className="text-xl font-bold">
            #{order.id}
          </div>

        </div>

        <div className="mb-6">

          <div className="text-gray-400 mb-2">
            Sự kiện
          </div>

          <div className="text-2xl font-black">
            {order.event?.title}
          </div>

        </div>

        <div className="mb-6">

          <div className="text-gray-400 mb-2">
            Khu vực
          </div>

          <div className="font-semibold text-sky-400">
            {order.zone?.name}
          </div>

        </div>

        <div>

          <div className="text-gray-400 mb-3">
            Ghế đã chọn
          </div>

          <div className="flex flex-wrap gap-2">

            {order.seats?.map(
              (seat) => (

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

              )
            )}

          </div>

        </div>

      </div>

      <div
        className="
          bg-white/5
          border
          border-white/10

          rounded-3xl
          p-6

          h-fit
        "
      >

        <h2
          className="
            text-xl
            font-bold
            mb-6
          "
        >
          Chi tiết thanh toán
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span className="text-gray-400">
              Số lượng vé
            </span>

            <span>
              {order.seats?.length || 0}
            </span>

          </div>

          <div className="border-t border-white/10 pt-4">

            <div className="flex justify-between items-center">

              <span className="text-lg font-semibold">
                Tổng thanh toán
              </span>

              <span
                className="
                  text-3xl
                  font-black
                  text-sky-400
                "
              >
                {Number(
                  order.total_price
                ).toLocaleString(
                  "vi-VN"
                )}
                đ
              </span>

            </div>

          </div>

        </div>

        <button
          onClick={
            handleVNPay
          }
          disabled={
            paying
          }
          className="
            w-full
            mt-8

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
          {paying
            ? "Đang chuyển tới VNPay..."
            : "Thanh toán với VNPay"}
        </button>

      </div>

    </div>

  </div>

</div>

);

}
