import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";


export default function SeatMap() {

  const { eventId } =
    useParams();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const zoneId = searchParams.get("zone");

  const [event, setEvent] =
    useState(null);

  const [zones, setZones] =
    useState([]);
  const selectedZone =
  zones.find(
    (z) =>
      String(z.id) === String(zoneId)
  ) || null;
  const [seats, setSeats] = useState([]);

  const [showtimeId, setShowtimeId] = useState(null);
  const [showtime, setShowtime] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    setShowtimeId(searchParams.get("showtime"));
  }, [searchParams]);

  useEffect(() => {

  if (!showtimeId) return;

  fetch(
    `${import.meta.env.VITE_API_URL}/api/events/showtimes/${showtimeId}/seats`
  )
      .then((res) => res.json())
      .then((data) => {
        const normalized = (Array.isArray(data) ? data : []).map((seat) => ({
          ...seat,
          id: seat.seat_id ?? seat.id,
        }));
        setSeats(normalized);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showtimeId]);

  useEffect(() => {
    if (!eventId || !showtimeId) {
      setShowtime(null);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SEATS:", data);
        setEvent(data.event || null);
        setZones(data.zones || []);
        const match = (data.showtimes || []).find(
          (st) => String(st.id) === String(showtimeId)
        );
        setShowtime(match || null);
      })
      .catch((err) => {
        console.log(err);
        setShowtime(null);
      });
  }, [eventId, showtimeId]);

  const getCurrentUser = () =>
    JSON.parse(localStorage.getItem("user") || "null");

  const isSeatHeldByCurrentUser = (seat) => {
    const user = getCurrentUser();
    if (seat.hold_user_id != null && user?.id != null) {
      return String(seat.hold_user_id) === String(user.id);
    }
    return selectedSeats.includes(seat.id);
  };


  // Build groupedSeats by zone_id -> row_label -> seats (use backend fields directly)
  const filteredSeats =
  seats.filter(
    (seat) =>
      String(seat.zone_id) ===
      String(zoneId)
  );
  const groupedSeats = filteredSeats.reduce((acc, seat) => {
    const zoneId = seat.zone_id ?? "default";
    if (!acc[zoneId]) acc[zoneId] = {};

    // Use backend `row_label` directly (do not set fallbacks)
    const rowLabel = seat.row_label;
    if (!acc[zoneId][rowLabel]) acc[zoneId][rowLabel] = [];

    acc[zoneId][rowLabel].push(seat);

    return acc;
  }, {});


  const handleSelectSeat = (seat) => {

  if (!seat) return;

  if (seat.status === "SOLD") {
    return;
  }

  const id = seat.id;

  if (
    selectedSeats.includes(id)
  ) {

    setSelectedSeats(
      selectedSeats.filter(
        (seatId) =>
          seatId !== id
      )
    );

    return;
  }

  setSelectedSeats(
    (prev) => [
      ...prev,
      id,
    ]
  );

};

const totalPrice =
  selectedSeats.length *
  Number(
    selectedZone?.price || 0
  );


const formatShowtime = () => {

  if (!showtime) {
    return showtimeId
      ? `#${showtimeId}`
      : "";
  }

  const start =
    showtime.start_time
      ? new Date(showtime.start_time)
      : null;

  const end =
    showtime.end_time
      ? new Date(showtime.end_time)
      : null;

  const dateText =
    start
      ? start.toLocaleDateString("vi-VN")
      : "";

  const startTime =
    start
      ? start.toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  const endTime =
    end
      ? end.toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  if (
    dateText &&
    startTime &&
    endTime
  ) {
    return `${dateText} · ${startTime} - ${endTime}`;
  }

  return `#${showtimeId}`;

};

  const getSeatColor = (seat) => {

  if (selectedSeats.includes(seat.id)) {
    return `
      bg-sky-500
      text-black
      border-sky-400
    `;
  }

  if (seat.status === "SOLD") {
    return `
      bg-gray-700
      text-gray-400
      cursor-not-allowed
    `;
  }

  return `
    bg-green-500/20
    text-green-400
    border-green-500/40
    hover:bg-green-500/30
  `;
};

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

        Đang tải sơ đồ ghế...

      </div>

    );

  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div
className="
sticky
top-0
z-30
backdrop-blur-xl
bg-[#050816]/90
border-b
border-white/10
"
>

        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">

          <h1
className="
text-2xl
md:text-4xl
font-black
text-white
mb-2
line-clamp-2
"
>
            {event?.title}
          </h1>

         <div
className="
flex
flex-col
md:flex-row
gap-2
md:gap-6
text-gray-400
text-sm
"
>

            <span>
              {event?.location}
            </span>

<span>
    {formatShowtime()}
</span>

          </div>

        </div>

      </div>

      {/* MAIN */}
<div
className="
max-w-7xl
mx-auto

xl:grid
xl:grid-cols-[minmax(0,1fr)_380px]

gap-6

px-4
md:px-6
py-6
md:py-10
"
>

        {/* LEFT */}
        <div className="lg:col-span-3">

          {/* STAGE */}
          <div className="flex justify-center mb-20">

            <div className="
w-full
max-w-[750px]
h-[80px]
md:h-[120px]

bg-gradient-to-b
from-sky-400/30
to-sky-600/10

border
border-sky-400/20

rounded-b-[999px]

flex
items-center
justify-center

text-lg
md:text-2xl
font-black
tracking-[0.3em]

shadow-[0_0_50px_rgba(56,189,248,0.15)]
"
>
              STAGE
            </div>

          </div>


          {/* SEAT MAP */}

<div className="space-y-12">

  {Object.entries(groupedSeats).map(
    ([zoneId, rows]) => (

      <div
        key={zoneId}
        className="mb-10"
      >

        <h3 className="text-center text-xl font-bold mb-8 text-sky-400">
          {
            zones.find(
              (z) =>
                String(z.id) ===
                String(zoneId)
            )?.name
          }
        </h3>

        {Object.entries(rows).map(
          ([rowLabel, rowSeats]) => (

            <div
              key={rowLabel}
              className="
                flex
                justify-center
                items-center
                gap-2
                mb-3
              "
            >

              <div
                className="
                  w-10
                  text-center
                  text-sky-400
                  font-bold
                "
              >
                {rowLabel}
              </div>

              {rowSeats
                .sort(
                  (a, b) =>
                    a.seat_number -
                    b.seat_number
                )
                .map((seat) => (

                  <button
                    key={seat.id}
                    onClick={() =>
                      handleSelectSeat(
                        seat
                      )
                    }
                    disabled={
                      seat.status ===
                      "SOLD"
                    }
                    className={`
                      w-9
h-9
md:w-10
md:h-10
                      rounded-xl
                      text-[11px]
                      shadow-md
                      font-semibold
                      transition
                      border
                      border-black/20
                      ${getSeatColor(
                        seat
                      )}
                    `}
                  >
                    {seat.seat_number}
                  </button>

                ))}

            </div>

          )
        )}

      </div>

    )
  )}

</div>

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 rounded bg-green-500"></div>

              <span className="text-sm text-gray-300">
                Available
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 rounded bg-black"></div>

              <span className="text-sm text-gray-300">
                Selected
              </span>

            </div>

            <div className="flex items-center gap-3">

              <div className="w-5 h-5 rounded bg-gray-500"></div>

              <span className="text-sm text-gray-300">
                Sold
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
         <div
    className="
      hidden
      xl:flex

      bg-white/5
      backdrop-blur-xl
      border
      border-white/10

      rounded-3xl
      p-6

      flex-col

      sticky
      top-24

      h-fit
    "
  >

          <h2 className="text-2xl font-bold text-sky-400 mb-6">
            Thông tin đặt vé
          </h2>

          <div className="mb-6">
</div>

          {/* (removed hold timer UI) */}

          {/* SELECTED SEATS */}
          <div className="mb-6">
            <div className="mb-6">

  <p className="font-bold text-sky-400 mt-1">
    {selectedZone?.name}
  </p>

</div>

            <h3 className="font-semibold mb-4">
              Ghế đã chọn
            </h3>

            {selectedSeats.length === 0 ? (

              <p className="text-gray-500 text-sm">
                Chưa chọn ghế nào
              </p>

            ) : (

              <div className="flex flex-wrap gap-3">

                {selectedSeats.map((seat) => (

                  <div
                    key={seat}
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-sky-500/20
border
border-sky-500/40
text-sky-400
                      font-semibold
                    "
                  >
                    {
                      seats.find((s) => s.id === seat)?.seat_code || seat
                    }
                  </div>

                ))}

              </div>

            )}

          </div>

          {/* PRICE */}
          <div className="border-t border-gray-800 pt-6 mt-auto">

            <div className="flex justify-between items-center mb-3">

              <span className="text-gray-400">
                Số lượng vé
              </span>

              <span>
                {selectedSeats.length}
              </span>

            </div>

            <div className="flex justify-between items-center mb-6">

              <span className="text-gray-400">
                Tổng tiền
              </span>

              <span
className="
text-3xl
font-black
text-sky-400
"
> 
                {totalPrice.toLocaleString("vi-VN")}đ
              </span>

            </div>

           <button
  onClick={async () => {

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    try {

      const holdRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/holds/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.id,
            event_id: event.id,
            showtime_id: showtime.id,
            zone_id: selectedZone.id,
            seat_ids: selectedSeats,
          }),
        }
      );

      const data = await holdRes.json();
if (!holdRes.ok) {

  alert(
    "Một hoặc nhiều ghế đang được thanh toán.\nVui lòng chọn ghế khác."
  );

  setSelectedSeats((prev) =>
    prev.filter(
      (id) => !(data.seats || []).includes(id)
    )
  );

  return;
}

      navigate("/checkout", {
        state: {
          event,
          showtime,
          zone: selectedZone,
          seats: seats.filter(
            (seat) =>
              selectedSeats.includes(
                seat.id
              )
          ),
          totalPrice,
        },
      });

    } catch (err) {

      console.log(err);

      alert(
        "Lỗi kết nối server"
      );

    }

  }}
  className="
    w-full
    py-4
    rounded-2xl
    bg-sky-500
    text-black
    font-bold
    text-lg
    hover:bg-sky-400
    transition
  "
>
  Thanh toán
</button>

          </div>

        </div>

      </div>

    </div>
  );
}
