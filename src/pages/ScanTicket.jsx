import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanTicket() {

  const scannerRef = useRef(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (scannerRef.current) return;

    scannerRef.current =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
          rememberLastUsedCamera: true,
        },
        false
      );

    scannerRef.current.render(

      async (decodedText) => {

        if (loading) return;

        try {

          setLoading(true);

          const res = await fetch(
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

          await scannerRef.current.clear();

        } catch (err) {

          console.log(err);

          setResult({
            success: false,
            message:
              "Lỗi kết nối server",
          });

        }

      },

      () => {}
    );

    return () => {

      if (
        scannerRef.current
      ) {

        scannerRef.current
          .clear()
          .catch(() => {});

      }

    };

  }, []);

  const handleScanAgain =
    () => {

      window.location.reload();

    };

  return (

    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">

      <div className="max-w-md mx-auto">

        <h1
          className="
            text-4xl
            font-black
            text-sky-400
            text-center
            mb-8
          "
        >
          Check-in Vé
        </h1>

        {!result && (

          <div
            className="
              bg-gray-900
              border
              border-gray-800
              rounded-3xl
              p-4
            "
          >

            <div id="reader" />

            <div
              className="
                mt-4
                text-center
                text-gray-400
              "
            >
              Đưa mã QR vào khung để check-in
            </div>

          </div>

        )}

        {result && (

          <div
            className={`
              rounded-3xl
              p-6
              border

              ${
                result.success
                  ? "bg-green-500/10 border-green-500"
                  : "bg-red-500/10 border-red-500"
              }
            `}
          >

            <div
              className="
                text-center
                text-6xl
                mb-4
              "
            >
              {result.success ? "✅" : "❌"}
            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-center
                mb-4
              "
            >
              {result.message}
            </h2>

            {result.ticket && (

              <div
                className="
                  bg-black/20
                  rounded-2xl
                  p-4
                  space-y-3
                "
              >

                <div>
                  <span className="text-gray-400">
                    Sự kiện:
                  </span>
                  <br />
                  <span className="font-bold">
                    {result.ticket.event_title}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">
                    Ghế:
                  </span>
                  <br />
                  <span className="font-bold">
                    {result.ticket.seat_code}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">
                    Mã vé:
                  </span>
                  <br />
                  <span className="font-bold">
                    {result.ticket.ticket_code}
                  </span>
                </div>

              </div>

            )}

            <button
              onClick={handleScanAgain}
              className="
                w-full
                mt-6
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