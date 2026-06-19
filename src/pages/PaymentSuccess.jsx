import { useSearchParams } from "react-router-dom";

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

  const amount =
    searchParams.get(
      "vnp_Amount"
    );

  const transactionNo =
    searchParams.get(
      "vnp_TransactionNo"
    );

  const isSuccess =
    responseCode === "00";

  return (

    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">

      <div
        className="
          max-w-xl
          w-full

          bg-white/5
          border
          border-white/10

          rounded-3xl
          p-8
        "
      >

        <h1
          className={`
            text-4xl
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

        <div className="space-y-3">

          <div>
            Mã đơn:
            <b>
              {" "}
              #{orderId}
            </b>
          </div>

          <div>
            Mã giao dịch:
            <b>
              {" "}
              {transactionNo}
            </b>
          </div>

          <div>
            Số tiền:
            <b>
              {" "}
              {amount
                ? Number(
                    amount / 100
                  ).toLocaleString(
                    "vi-VN"
                  ) + "đ"
                : ""}
            </b>
          </div>

          <div>
            Response:
            <b>
              {" "}
              {responseCode}
            </b>
          </div>

        </div>

      </div>

    </div>

  );

}