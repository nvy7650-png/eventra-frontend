import {
useEffect,
useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

export default function Payment() {

const { orderId } =
useParams();

const navigate =
  useNavigate();

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

const handleDemoSuccess =
  async () => {

    try {

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/test/payment-success/${order.id}`,
          {
            method: "POST",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Demo thất bại"
        );

        return;

      }

      navigate(
        `/payment-success?orderId=${order.id}`
      );

    } catch (err) {

      console.log(err);

      alert("Lỗi server");

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
      Thanh toán
    </h1>

    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      "
    >

      {/* LEFT */}

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Quét mã QR
        </h2>

        <div
          className="
            bg-white
            rounded-3xl
            p-4
            max-w-sm
            mx-auto
          "
        >

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=HOMIETICKET_ORDER_${order.id}`}
            alt="QR Payment"
            className="
              w-full
            "
          />

        </div>

        <div
          className="
            mt-6
            p-4
            rounded-2xl
            bg-yellow-500/10
            border
            border-yellow-500/30
            text-yellow-300
          "
        >
          Quét mã QR hoặc nhấn nút bên phải để
          chuyển tới cổng thanh toán VNPay.
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
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Thông tin thanh toán
        </h2>

        <div className="space-y-5">

          <div>

            <div className="text-gray-400">
              Mã đơn hàng
            </div>

            <div className="text-xl font-bold">
              #{order.id}
            </div>

          </div>

          <div>

            <div className="text-gray-400">
              Số lượng vé
            </div>

            <div className="text-xl font-bold">
              {order.seats?.length || 0}
            </div>

          </div>

          <div>

            <div className="text-gray-400">
              Nội dung chuyển khoản
            </div>

            <div
              className="
                text-sky-400
                font-bold
                break-all
              "
            >
              HOMIETICKET_{order.id}
            </div>

          </div>

          <div
            className="
              border-t
              border-white/10
              pt-5
            "
          >

            <div className="text-gray-400 mb-2">
              Tổng thanh toán
            </div>

            <div
              className="
                text-4xl
                font-black
                text-sky-400
              "
            >
              {Number(
                order.total_price
              ).toLocaleString(
                "vi-VN"
              )}đ
            </div>

          </div>

          <div
            className="
              p-4
              rounded-2xl
              bg-red-500/10
              border
              border-red-500/30
              text-red-300
              text-sm
            "
          >
            Sau khi thanh toán thành công,
            hệ thống sẽ tự động phát hành vé
            điện tử cho tài khoản của bạn.
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
