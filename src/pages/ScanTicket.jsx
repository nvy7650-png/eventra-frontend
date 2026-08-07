import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanTicket() {

  const qrRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");

  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);

  // ===============================
  // LẤY DANH SÁCH EVENT
  // ===============================

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events`
    )
      .then((res) => res.json())
      .then((data) => {

        setEvents(data);

      })
      .catch(console.log);

  }, []);

  // ===============================
  // LẤY SHOWTIME THEO EVENT
  // ===============================

  useEffect(() => {

    if (!selectedEvent) {

      setShowtimes([]);

      return;

    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/${selectedEvent}/showtimes`
    )
      .then((res) => res.json())
      .then((data) => {

        setShowtimes(data);

      })
      .catch(console.log);

  }, [selectedEvent]);

  // ===============================
  // BẮT ĐẦU CAMERA
  // ===============================

  useEffect(() => {

    if (!started) return;

    startScanner();

    return () => {

      if (qrRef.current) {

        qrRef.current
          .stop()
          .catch(() => {});

      }

    };

  }, [
    started,
    selectedEvent,
    selectedShowtime,
  ]);

  // ===============================
  // SCANNER
  // ===============================

  const startScanner = async () => {

    if (qrRef.current) {

      try {

        await qrRef.current.stop();

      } catch {}

    }

    const qr = new Html5Qrcode("reader");

    qrRef.current = qr;

    qr.start(

      {
        facingMode: "environment",
      },

      {
        fps: 10,
        qrbox: 260,
      },

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

                event_id:
                  selectedEvent,

                showtime_id:
                  selectedShowtime,

              }),

            }

          );

          const data =
            await res.json();

          setResult(data);

          await qr.stop();

        }

        catch (err) {

          console.log(err);

        }

      }

    );

  };

  // ===============================
  // QUÉT TIẾP
  // ===============================

  const handleRestart = () => {

    setResult(null);

    setStarted(false);

    setTimeout(() => {

      setStarted(true);

    }, 300);

  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">

  <div className="max-w-xl mx-auto px-6 py-10">

    <h1
      className="
        text-4xl
        font-black
        text-center
        text-sky-400
        mb-10
      "
    >
      Check-in Vé
    </h1>

    {/* CHỌN SỰ KIỆN */}

    {!started && (

      <div
        className="
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          p-6
          shadow-xl
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Chọn phiên Check-in
        </h2>

        <div className="mb-5">

          <label className="block mb-2 font-semibold">
            Sự kiện
          </label>

          <select

            value={selectedEvent}

            onChange={(e) => {

              setSelectedEvent(
                e.target.value
              );

              setSelectedShowtime("");

            }}

            className="
              w-full
              bg-[#111827]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
            "

          >

            <option value="">
              -- Chọn sự kiện --
            </option>

            {events.map((event) => (

              <option
                key={event.id}
                value={event.id}
              >
                {event.title}
              </option>

            ))}

          </select>

        </div>

        <div className="mb-8">

          <label className="block mb-2 font-semibold">
            Suất diễn
          </label>

          <select

            value={selectedShowtime}

            onChange={(e)=>

              setSelectedShowtime(
                e.target.value
              )

            }

            disabled={!selectedEvent}

            className="
              w-full
              bg-[#111827]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
            "

          >

            <option value="">
              -- Chọn suất diễn --
            </option>

            {showtimes.map((st)=>(

              <option
                key={st.id}
                value={st.id}
              >

                {new Date(
                  st.start_time
                ).toLocaleString("vi-VN")}

              </option>

            ))}

          </select>

        </div>

        <button

          disabled={
            !selectedEvent ||
            !selectedShowtime
          }

          onClick={()=>

            setStarted(true)

          }

          className="
            w-full
            py-4
            rounded-2xl
            bg-sky-500
            hover:bg-sky-400
            text-black
            font-bold
            transition
            disabled:opacity-50
          "

        >

          Bắt đầu Check-in

        </button>

      </div>

    )}

    {/* CAMERA */}

    {started && !result && (

      <div
        className="
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          p-6
          shadow-xl
        "
      >

        <div className="mb-6">

          <div className="text-gray-400">
            Sự kiện
          </div>

          <div className="font-bold text-lg">

            {
              events.find(
                e=>String(e.id)===String(selectedEvent)
              )?.title
            }

          </div>

        </div>

        <div className="mb-6">

          <div className="text-gray-400">
            Suất diễn
          </div>

          <div className="font-bold">

            {
              showtimes.find(
                s=>String(s.id)===String(selectedShowtime)
              ) &&
              new Date(
                showtimes.find(
                  s=>String(s.id)===String(selectedShowtime)
                ).start_time
              ).toLocaleString("vi-VN")
            }

          </div>

        </div>

        <div

          id="reader"

          className="
            rounded-3xl
            overflow-hidden
          "

        />

        <p
          className="
            text-center
            text-gray-400
            mt-5
          "
        >
          Đưa QR vào khung để check-in
        </p>

      </div>

    )}

    {/* KẾT QUẢ */}

    {result && (

      <div

        className={`
          rounded-3xl
          p-8
          text-center
          shadow-xl

          ${
            result.success

            ? "bg-green-500/10 border border-green-500"

            : "bg-red-500/10 border border-red-500"

          }
        `}

      >

        <div className="text-7xl mb-5">

          {

            result.success

            ? "✅"

            : "❌"

          }

        </div>

        <div
          className="
            text-3xl
            font-black
            mb-4
          "
        >
          {result.message}
        </div>

        {result.ticket && (

          <>

            <div className="text-lg font-semibold">

              {result.ticket.event_title}

            </div>

            <div className="mt-3 text-gray-300">

              Ghế:

              {" "}

              {result.ticket.seat_code ||

                result.ticket.standing_number ||

                "--"}

            </div>

          </>

        )}

        <button

          onClick={handleRestart}

          className="
            w-full
            mt-8
            py-4
            rounded-2xl
            bg-sky-500
            hover:bg-sky-400
            text-black
            font-bold
            transition
          "

        >

          Quét vé tiếp

        </button>

      </div>

    )}

  </div>

</div>

);

}