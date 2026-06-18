import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanTicket() {

  const qrRef = useRef(null);

  const [result, setResult] =
    useState(null);

  useEffect(() => {

    const qr =
      new Html5Qrcode("reader");

    qrRef.current = qr;

    qr.start(
  {
    facingMode: "environment",
  },
          {
            fps: 10,
            qrbox: 250,
          },

          async (decodedText) => {

            try {

              const res =
                await fetch(
                  `${import.meta.env.VITE_API_URL}/api/tickets/checkin`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },
                    body: JSON.stringify({
                      ticket_code:
                        decodedText,
                    }),
                  }
                );

              const data =
                await res.json();

              setResult(data);

              await qr.stop();

            } catch (err) {

              console.log(err);

            }

          }
        );

      });

    return () => {

      if (qrRef.current) {

        qrRef.current
          .stop()
          .catch(() => {});

      }

    };


  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-md mx-auto px-4 py-8">

        <h1
          className="
            text-4xl
            font-black
            text-sky-400
            text-center
            mb-6
          "
        >
          Check-in Vé
        </h1>

        {!result && (

          <div
            className="
              bg-gray-900
              rounded-3xl
              p-4
              border
              border-gray-800
            "
          >

            <div
              id="reader"
              className="
                overflow-hidden
                rounded-2xl
              "
            />

            <p
              className="
                text-center
                text-gray-400
                mt-4
              "
            >
              Đưa QR vào khung để check-in
            </p>

          </div>

        )}

        {result && (

          <div
            className={`
              rounded-3xl
              p-6
              text-center

              ${
                result.success
                  ? "bg-green-500/10 border border-green-500"
                  : "bg-red-500/10 border border-red-500"
              }
            `}
          >

            <div className="text-7xl mb-4">

              {result.success
                ? "✅"
                : "❌"}

            </div>

            <div
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              {result.message}
            </div>

            {result.ticket && (

              <>

                <div className="mb-2">
                  {result.ticket.event_title}
                </div>

                <div className="mb-5">
                  Ghế:
                  {" "}
                  {result.ticket.seat_code}
                </div>

              </>

            )}

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                w-full
                py-4
                rounded-2xl
                bg-sky-500
                text-black
                font-bold
              "
            >
              Quét vé tiếp theo
            </button>

          </div>

        )}

      </div>

    </div>

  );

}