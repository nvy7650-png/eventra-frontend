import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {

  const [searchParams] =
    useSearchParams();

  const responseCode =
    searchParams.get(
      "vnp_ResponseCode"
    );

  const orderId =
    searchParams.get(
      "vnp_TxnRef"
    );

  const isSuccess =
    responseCode === "00";

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">

      <div
        className="
          w-full
          max-w-2xl

          bg-white/5
          border
          border-white/10

          rounded-3xl

          p-8
          md:p-12

          text-center
          text-white
        "
      >

        <div className="text-6xl mb-6">

          {isSuccess
            ? "🎉"
            : "❌"}

        </div>

        <h1
          className={`
            text-3xl
            md:text-5xl
            font-black
            mb-6

            ${
              isSuccess
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {isSuccess
            ? "Thanh toán thành công"
            : "Thanh toán thất bại"}
        </h1>

        {isSuccess ? (

          <>
            <p
              className="
                text-lg
                text-gray-300
                mb-3
              "
            >
              Cảm ơn bạn đã đặt vé tại
              HomieTicket.
            </p>

            <p
              className="
                text-gray-400
                mb-8
              "
            >
              Vé điện tử của bạn đã được
              tạo thành công.
            </p>

            <div
              className="
                inline-flex
                px-4
                py-2

                rounded-xl

                bg-green-500/10
                border
                border-green-500/30

                text-green-400
                font-semibold

                mb-8
              "
            >
              Đơn hàng #{orderId}
            </div>

          </>

        ) : (

          <>
            <p
              className="
                text-gray-300
                mb-8
              "
            >
              Thanh toán chưa hoàn tất.
              Bạn có thể thử lại hoặc
              chọn phương thức thanh toán
              khác.
            </p>
          </>

        )}

        <div
          className="
            flex
            flex-col
            sm:flex-row

            gap-4
            justify-center
          "
        >

          <Link
            to="/"
            className="
              px-6
              py-3

              rounded-2xl

              bg-white/10
              border
              border-white/10

              hover:bg-white/20
              transition
            "
          >
            Trang chủ
          </Link>

          {isSuccess ? (

            <Link
              to="/my-tickets"
              className="
                px-6
                py-3

                rounded-2xl

                bg-gradient-to-r
                from-sky-500
                to-cyan-400

                text-black
                font-bold
              "
            >
              Vé của tôi
            </Link>

          ) : (

            <Link
              to={`/payment/${orderId}`}
              className="
                px-6
                py-3

                rounded-2xl

                bg-gradient-to-r
                from-red-500
                to-pink-500

                text-white
                font-bold
              "
            >
              Thử lại
            </Link>

          )}

        </div>

      </div>

    </div>

  );

}