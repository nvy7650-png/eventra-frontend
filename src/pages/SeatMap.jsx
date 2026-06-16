import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function SeatMap() {

  const { eventId } =
    useParams();

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
    fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/seats`)
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
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !showtimeId) {
      setShowtime(null);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
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

  const visibleSeats = seats.filter((seat) => {
    if (seat.hold_status !== "ACTIVE") return true;
    return isSeatHeldByCurrentUser(seat);
  });

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


  const handleSelectSeat = async (seat) => {
    // Use DB primary key `seat.id` for selection state (selectedSeats stores DB ids)
    if (!seat) return;

    // Backend statuses are uppercase: AVAILABLE, SOLD, RESERVED
    if (seat.status === "SOLD") return;

    const id = seat.id;
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== id));
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/holds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          event_id: eventId,
          showtime_id: showtimeId,
          zone_id: seat.zone_id,
          seat_id: seat.id,
        }),
      });

      if (res.status === 409) {
        alert("Ghế này đang được người khác giữ");
        return;
      }

      if (!res.ok) return;

      setSelectedSeats((prev) => [...prev, id]);
    } catch (err) {
      console.log(err);
    }
  };

  const totalPrice =
  selectedSeats.length *
  Number(selectedZone?.price || 0);

  const formatShowtime = () => {
    if (!showtime) {
      const showtimeDate = showtime?.start_time
        ? new Date(showtime.start_time)
        .toLocaleDateString("vi-VN")
        : "";
      const showtimeTime = showtime?.start_time
        ? new Date(showtime.start_time)
        .toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        : "";
      return showtimeId ? `#${showtimeId}` : "";
    }

    const start = showtime.start_time ? new Date(showtime.start_time) : null;
    const end = showtime.end_time ? new Date(showtime.end_time) : null;
    const dateText = start ? start.toLocaleDateString("vi-VN") : "";
    const startTime = start
      ? start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : "";
    const endTime = end
      ? end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : "";

    if (dateText && startTime && endTime) {
      return `${dateText} · ${startTime} - ${endTime}`;
    }

    return `#${showtimeId}`;
  };

  const getSeatColor = (seat) => {
    // Selected by current user -> black
    if (selectedSeats.includes(seat.id)) {
      return "bg-black text-white";
    }

    // Sold -> gray
    if (seat.status === "SOLD") {
      return "bg-gray-500 cursor-not-allowed text-white";
    }

    // Available -> green
    return "bg-green-500 text-white hover:bg-green-400";
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
      <div className="border-b border-gray-800 bg-gray-900">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <h1 className="text-4xl font-bold text-sky-400 mb-3">
            {event?.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">

            <span>
              {event?.location}
            </span>

            <span>
              {showtimeDate}
            </span>

            <span>
              {showtimeTime}
            </span>

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 px-6 py-10">

        {/* LEFT */}
        <div className="lg:col-span-3">

          {/* STAGE */}
          <div className="flex justify-center mb-20">

            <div className="
              w-[600px]
              h-[140px]
              bg-gradient-to-b
              from-gray-600
              to-gray-800
              rounded-b-[300px]
              flex
              items-center
              justify-center
              text-3xl
              font-bold
              shadow-2xl
            ">
              STAGE
            </div>

          </div>

          {/* ZONE */}
          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold">
              {selectedZone?.name}
            </h2>

            <p className="text-gray-400 mt-2">
              Chọn ghế bạn muốn đặt
            </p>

          </div>

          {showtimeId && (
            <div className="text-center mb-12">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                Suất diễn đã chọn
              </p>
              <p className="text-lg font-semibold text-sky-400">
                {formatShowtime()}
              </p>
            </div>
          )}

          {/* CURVED SEATMAP */}
          <div className="space-y-10">

            {Object.entries(groupedSeats).map(([row, seats], rowIndex) => (

              <div
                key={row}
                className="flex justify-center gap-4"
                style={{
                  transform: `scale(${1 - rowIndex * 0.04})`,
                }}
              >

                {seats.map((seat, seatIndex) => {

                  const middle = (seats.length - 1) / 2;

                  const curveOffset =
                    Math.pow(seatIndex - middle, 2) * 6;

                  return (

                    <button
                      key={seat.seat_code}
                      onClick={() => handleSelectSeat(seat)}
                      disabled={seat.status === 'SOLD'}
                      className={`
                        w-14
                        h-14
                        rounded-full
                        font-semibold
                        transition
                        duration-200
                        shadow-xl
                        border-2
                        border-gray-900
                        ${getSeatColor(seat)}
                      `}
                      style={{
                        transform: `translateY(${curveOffset}px)`,
                      }}
                    >
                      {seat.seat_code}
                    </button>

                  );
                })}

              </div>

            ))}

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

              <div className="w-5 h-5 rounded bg-red-500"></div>

              <span className="text-sm text-gray-300">
                Sold
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 h-fit sticky top-6">

          <h2 className="text-2xl font-bold text-sky-400 mb-6">
            Thông tin đặt vé
          </h2>

          {/* (removed hold timer UI) */}

          {/* SELECTED SEATS */}
          <div className="mb-6">

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
                      bg-sky-400
                      text-black
                      font-semibold
                    "
                  >
                    {seat}
                  </div>

                ))}

              </div>

            )}

          </div>

          {/* PRICE */}
          <div className="border-t border-gray-800 pt-6">

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

              <span className="text-2xl font-bold text-sky-400">
                {totalPrice.toLocaleString("vi-VN")}đ
              </span>

            </div>

            {/* BUTTON */}
            <button
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
