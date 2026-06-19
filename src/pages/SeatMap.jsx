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

const { eventId } = useParams();

const navigate = useNavigate();

const [searchParams] = useSearchParams();

const zoneId =
searchParams.get("zone");

const [event, setEvent] =
useState(null);

const [zones, setZones] =
useState([]);

const selectedZone =
zones.find(
(z) =>
String(z.id) ===
String(zoneId)
) || null;

const [seats, setSeats] =
useState([]);

const [showtimeId,
setShowtimeId] =
useState(null);

const [showtime,
setShowtime] =
useState(null);

const [loading,
setLoading] =
useState(true);

const [selectedSeats,
setSelectedSeats] =
useState([]);

useEffect(() => {

setShowtimeId(
  searchParams.get(
    "showtime"
  )
);


}, [searchParams]);

useEffect(() => {

if (!showtimeId) return;

fetch(
  `${import.meta.env.VITE_API_URL}/api/events/showtimes/${showtimeId}/seats`
)
  .then((res) => res.json())

  .then((data) => {

    const normalized =
      (Array.isArray(data)
        ? data
        : []
      ).map((seat) => ({
        ...seat,
        id:
          seat.seat_id ??
          seat.id,
      }));

    setSeats(
      normalized
    );

  })

  .catch(console.log)

  .finally(() => {

    setLoading(false);

  });


}, [showtimeId]);

useEffect(() => {


if (
  !eventId ||
  !showtimeId
) {

  setShowtime(null);

  return;

}

fetch(
  `${import.meta.env.VITE_API_URL}/api/events/${eventId}`
)

  .then((res) =>
    res.json()
  )

  .then((data) => {

    setEvent(
      data.event || null
    );

    setZones(
      data.zones || []
    );

    const match =
      (
        data.showtimes || []
      ).find(
        (st) =>
          String(st.id) ===
          String(showtimeId)
      );

    setShowtime(
      match || null
    );

  })

  .catch((err) => {

    console.log(err);

    setShowtime(null);

  });

}, [
eventId,
showtimeId,
]);

const handleSelectSeat =
(seat) => {


  if (!seat) return;

  if (
    seat.status ===
    "SOLD"
  ) {
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

const filteredSeats =
seats.filter(
(seat) =>
String(
seat.zone_id
) ===
String(zoneId)
);

const groupedSeats =
filteredSeats.reduce(
(acc, seat) => {


    const zone =
      seat.zone_id ??
      "default";

    if (!acc[zone]) {
      acc[zone] = {};
    }

    const rowLabel =
      seat.row_label;

    if (
      !acc[zone][rowLabel]
    ) {

      acc[zone][rowLabel] =
        [];

    }

    acc[zone][rowLabel].push(
      seat
    );

    return acc;

  },
  {}
);


const formatShowtime =
() => {

  if (!showtime) {

    return showtimeId
      ? `#${showtimeId}`
      : "";

  }

  const start =
    showtime.start_time
      ? new Date(
          showtime.start_time
        )
      : null;

  const end =
    showtime.end_time
      ? new Date(
          showtime.end_time
        )
      : null;

  if (!start) {
    return "";
  }

  return `${start.toLocaleDateString(
    "vi-VN"
  )} • ${start.toLocaleTimeString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}${
    end
      ? ` - ${end.toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`
      : ""
  }`;

};


const handleContinue =
async () => {


  if (
    selectedSeats.length === 0
  ) {

    alert(
      "Vui lòng chọn ghế"
    );

    return;

  }

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      ) || "null"
    );

  try {

    const holdRes =
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/holds/bulk`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
{
  user_id:
    user.id,

  event_id:
    eventId,

  showtime_id:
    showtimeId,

  zone_id:
    zoneId,

  seat_ids:
    selectedSeats,
}
),
        }
      );

    const holdData =
      await holdRes.json();

    if (
      !holdRes.ok
    ) {

      alert(
        holdData.message ||
          "Một hoặc nhiều ghế đang được thanh toán"
      );

      return;

    }

    navigate(
      "/checkout",
      {
        state: {
          event,
          showtime,
          zone:
            selectedZone,

          seats:
            seats.filter(
              (
                seat
              ) =>
                selectedSeats.includes(
                  seat.id
                )
            ),

          totalPrice,

          expiresAt:
            holdData.expiresAt,
        },
      }
    );

  } catch (err) {

    console.log(
      err
    );

    alert(
      "Không thể giữ ghế"
    );

  }

};


const getSeatClass =
(seat) => {

  if (
    seat.status ===
    "SOLD"
  ) {

    return `
      bg-gray-700
      text-gray-400
      cursor-not-allowed
    `;

  }

  if (
    selectedSeats.includes(
      seat.id
    )
  ) {

    return `
      bg-sky-500
      text-white
      border-sky-400
    `;

  }

  return `
    bg-[#111827]
    border-white/10
    text-white

    hover:border-sky-400
    hover:bg-sky-500/20
  `;

};


if (loading) {


return (
  <div
    className="
      min-h-screen
      bg-[#050816]

      flex
      items-center
      justify-center

      text-white
    "
  >
    Đang tải...
  </div>
);


}

return (


<div className="min-h-screen bg-[#050816] text-white">

  <div
    className="
      max-w-7xl
      mx-auto

      px-4
      md:px-6

      py-6
      md:py-10

      pb-32
      lg:pb-10
    "
  >

    {/* HEADER */}

    <div className="mb-8">

      <h1
        className="
          text-2xl
          md:text-4xl

          font-black
        "
      >
        {event?.title}
      </h1>

      <p
        className="
          text-gray-400
          mt-2
        "
      >
        {formatShowtime()}
      </p>

    </div>

    <div
      className="
        lg:grid
        lg:grid-cols-[1fr_320px]
        gap-8
      "
    >

      {/* LEFT */}
      <div>

        <div
          className="
            bg-[#0B1220]

            border
            border-white/10

            rounded-3xl

            p-6
            md:p-8
          "
        >

          <div
            className="
              text-center

              text-gray-400

              font-semibold

              mb-8
            "
          >
            STAGE
          </div>

          <div className="space-y-8">

            {Object.entries(
              groupedSeats
            ).map(
              ([zoneId, rows]) => (

                <div key={zoneId}>

                  {Object.entries(
                    rows
                  ).map(
                    ([rowLabel, rowSeats]) => (

                      <div
                        key={rowLabel}
                        className="
                          flex
                          items-center

                          gap-3

                          mb-3

                          overflow-x-auto
                        "
                      >

                        <div
                          className="
                            w-8

                            text-gray-500
                            font-semibold
                          "
                        >
                          {rowLabel}
                        </div>

                        <div className="flex gap-2">

                          {rowSeats.map(
                            (seat) => (

                              <button
                                key={seat.id}

                                disabled={
                                  seat.status ===
                                  "SOLD"
                                }

                                onClick={() =>
                                  handleSelectSeat(
                                    seat
                                  )
                                }

                                className={`
                                  w-10
                                  h-10

                                  rounded-xl

                                  border

                                  text-xs
                                  font-semibold

                                  transition-all

                                  ${getSeatClass(
                                    seat
                                  )}
                                `}
                              >
                                {
                                  seat.seat_number
                                }
                              </button>

                            )
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )
            )}

          </div>

          {/* LEGEND */}

          <div
            className="
              flex
              flex-wrap

              gap-6

              mt-10
              pt-6

              border-t
              border-white/10
            "
          >

            <div className="flex items-center gap-2">

              <div
                className="
                  w-5
                  h-5

                  rounded

                  bg-[#111827]
                  border
                  border-white/10
                "
              />

              <span className="text-sm">
                Còn trống
              </span>

            </div>

            <div className="flex items-center gap-2">

              <div
                className="
                  w-5
                  h-5

                  rounded

                  bg-sky-500
                "
              />

              <span className="text-sm">
                Đang chọn
              </span>

            </div>

            <div className="flex items-center gap-2">

              <div
                className="
                  w-5
                  h-5

                  rounded

                  bg-gray-700
                "
              />

              <span className="text-sm">
                Đã bán
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* DESKTOP SIDEBAR */}

      <div
        className="
          hidden
          lg:block

          sticky
          top-24

          h-fit
        "
      >

        <div
          className="
            bg-[#0B1220]

            border
            border-white/10

            rounded-3xl

            p-6
          "
        >

          <p
            className="
              text-lg
              font-bold
            "
          >
            {selectedZone?.name}
          </p>

          <p
            className="
              text-gray-400
              text-sm

              mt-2
            "
          >
            {formatShowtime()}
          </p>

          <div
            className="
              mt-6
              pt-6

              border-t
              border-white/10
            "
          >

            <p
              className="
                text-gray-400
                text-sm
              "
            >
              Ghế đã chọn
            </p>

            <div
              className="
                flex
                flex-wrap

                gap-2

                mt-3
              "
            >

              {selectedSeats.map(
                (seatId) => {

                  const seat =
                    seats.find(
                      (s) =>
                        s.id ===
                        seatId
                    );

                  return (
                    <div
                      key={seatId}
                      className="
                        px-3
                        py-2

                        rounded-xl

                        bg-sky-500/20
                        text-sky-400

                        text-sm
                        font-semibold
                      "
                    >
                      {
                        seat?.seat_code
                      }
                    </div>
                  );

                }
              )}

            </div>

          </div>

          <div
            className="
              mt-6
              pt-6

              border-t
              border-white/10
            "
          >

            <div
              className="
                flex
                justify-between

                mb-3
              "
            >
              <span className="text-gray-400">
                Số lượng vé
              </span>

              <span>
                {selectedSeats.length}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <span className="text-gray-400">
                Tổng tiền
              </span>

              <span
                className="
                  text-2xl
                  font-black
                  text-sky-400
                "
              >
                {totalPrice.toLocaleString(
                  "vi-VN"
                )}đ
              </span>
            </div>

          </div>

          <button
            onClick={
              handleContinue
            }
            disabled={
              selectedSeats.length === 0
            }
            className="
              mt-6

              w-full

              py-4

              rounded-2xl

              font-bold

              bg-gradient-to-r
              from-sky-500
              to-cyan-400

              text-black

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Tiếp tục
          </button>

        </div>

      </div>

    </div>

  </div>

  {/* MOBILE BOTTOM BAR */}

  <div
    className="
      lg:hidden

      fixed
      bottom-0
      left-0
      right-0

      z-50

      bg-[#081120]/95
      backdrop-blur-md

      border-t
      border-white/10

      p-4
    "
  >

    <div
      className="
        flex
        items-center
        justify-between

        gap-4
      "
    >

      <div>

        <p
          className="
            text-sm
            text-gray-400
          "
        >
          {selectedSeats.length} ghế
        </p>

        <p
          className="
            text-xl
            font-black
            text-sky-400
          "
        >
          {totalPrice.toLocaleString(
            "vi-VN"
          )}đ
        </p>

      </div>

      <button
        onClick={
          handleContinue
        }
        disabled={
          selectedSeats.length === 0
        }
        className="
          px-6
          py-3

          rounded-2xl

          font-bold

          bg-gradient-to-r
          from-sky-500
          to-cyan-400

          text-black

          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Tiếp tục
      </button>

    </div>

  </div>

</div>


);

}

