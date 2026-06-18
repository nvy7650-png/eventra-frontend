import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanTicket() {

  const scannerRef = useRef(null);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {

    if (scannerRef.current) return;

    scannerRef.current =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

    scannerRef.current.render(

      async (decodedText) => {

        try {

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

          setMessage(
            data.message
          );

          setSuccess(
            data.success
          );

          setTimeout(() => {

            setMessage("");

          }, 3000);

        } catch (err) {

          console.log(err);

          setSuccess(false);

          setMessage(
            "Lỗi kết nối server"
          );

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

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-4xl mx-auto py-12 px-6">

        <h1 className="text-4xl font-bold text-sky-400 mb-8">
          Check-in Vé
        </h1>

        <div
          className="
            bg-gray-900
            border
            border-gray-800
            rounded-3xl
            p-6
          "
        >

          <div
            id="reader"
          />

          {message && (

            <div
              className={`
                mt-6
                p-4
                rounded-xl
                font-bold

                ${
                  success
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-white"
                }
              `}
            >
              {message}
            </div>

          )}

        </div>

      </div>

    </div>

  );

}
