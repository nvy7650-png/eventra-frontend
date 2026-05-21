import { useState } from "react";

const seatsData = [
  // ROW A
  { id: "A1", row: "A", status: "available" },
  { id: "A2", row: "A", status: "sold" },
  { id: "A3", row: "A", status: "available" },
  { id: "A4", row: "A", status: "available" },
  { id: "A5", row: "A", status: "sold" },

  // ROW B
  { id: "B1", row: "B", status: "available" },
  { id: "B2", row: "B", status: "available" },
  { id: "B3", row: "B", status: "sold" },
  { id: "B4", row: "B", status: "available" },
  { id: "B5", row: "B", status: "available" },
  { id: "B6", row: "B", status: "available" },

  // ROW C
  { id: "C1", row: "C", status: "available" },
  { id: "C2", row: "C", status: "available" },
  { id: "C3", row: "C", status: "available" },
  { id: "C4", row: "C", status: "sold" },
  { id: "C5", row: "C", status: "available" },
  { id: "C6", row: "C", status: "available" },
  { id: "C7", row: "C", status: "available" },

  // ROW D
  { id: "D1", row: "D", status: "available" },
  { id: "D2", row: "D", status: "available" },
  { id: "D3", row: "D", status: "available" },
  { id: "D4", row: "D", status: "available" },
  { id: "D5", row: "D", status: "sold" },
  { id: "D6", row: "D", status: "available" },
  { id: "D7", row: "D", status: "available" },
  { id: "D8", row: "D", status: "available" },
];

export default function SeatMap() {

  const [selectedSeats, setSelectedSeats] = useState([]);

  const groupedSeats = seatsData.reduce((acc, seat) => {

    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }

    acc[seat.row].push(seat);

    return acc;

  }, {});

  const handleSelectSeat = (seat) => {

    if (seat.status === "sold") return;

    if (selectedSeats.includes(seat.id)) {

      setSelectedSeats(
        selectedSeats.filter((s) => s !== seat.id)
      );

    } else {

      setSelectedSeats([...selectedSeats, seat.id]);

    }
  };

  const getSeatColor = (seat) => {

    if (seat.status === "sold") {
      return "bg-red-500 cursor-not-allowed";
    }

    if (selectedSeats.includes(seat.id)) {
      return "bg-sky-400 text-black scale-110";
    }

    return "bg-green-500 hover:bg-green-400";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="border-b border-gray-800 bg-gray-900">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <h1 className="text-4xl font-bold text-sky-400 mb-3">
            SKYWAVE SUMMER MUSIC FESTIVAL 2026
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-400 text-sm">

            <span>
              📍 Công viên bờ sông Sài Gòn
            </span>

            <span>
              📅 20/07/2026
            </span>

            <span>
              🕒 18:00
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
              VIP SEATING ZONE
            </h2>

            <p className="text-gray-400 mt-2">
              Chọn ghế bạn muốn đặt
            </p>

          </div>

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
                      key={seat.id}
                      onClick={() => handleSelectSeat(seat)}
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
                      {seat.id}
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

              <div className="w-5 h-5 rounded bg-sky-400"></div>

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

          {/* TIMER */}
          <div className="
            bg-yellow-500/10
            border
            border-yellow-500
            text-yellow-400
            rounded-xl
            px-4
            py-3
            mb-6
            text-sm
          ">

            ⏳ Giữ ghế trong: 09:32

          </div>

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
                {(selectedSeats.length * 300000).toLocaleString()}đ
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