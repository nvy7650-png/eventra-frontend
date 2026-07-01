import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AutoBooking() {

    const { id } = useParams();

    const navigate =
  useNavigate();

const [event, setEvent] =
  useState(null);

const [showtimes, setShowtimes] =
  useState([]);

const [zones, setZones] =
  useState([]);

const [selectedShowtime,
  setSelectedShowtime] =
  useState(null);

  useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/api/events/${id}`
  )
    .then((res) => res.json())
    .then((data) => {
        console.log(data);

      setEvent(
        data.event
      );

      setShowtimes(
        data.showtimes || []
      );

      setZones(
        data.zones || []
      );

      if (
        data.showtimes?.length
      ) {
        setSelectedShowtime(
          data.showtimes[0].id
        );
      }

    })
    .catch(console.log);

}, [id]);

  const [quantities, setQuantities] =
    useState({});

  const updateQty = (
    zoneId,
    value
  ) => {

    setQuantities((prev) => ({

      ...prev,

      [zoneId]:
        Math.max(
          0,
          (prev[zoneId] || 0) + value
        ),

    }));

  };
  console.log(
  "SHOWTIME:",
  selectedShowtime
);

console.log(
  "ZONES:",
  zones
);

const currentZones =
  zones;

  const totalQuantity =
    Object.values(
      quantities
    ).reduce(
      (a, b) => a + b,
      0
    );

  const totalPrice =
  currentZones.reduce(
      (sum, zone) => {

        return (
          sum +
          (quantities[
            zone.id
          ] || 0) *
            zone.price
        );

      },
      0
    );

    async function handleCheckout() {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const items = [];

    currentZones.forEach((zone) => {

      const qty =
        quantities[
          zone.id
        ] || 0;

      items.push({

  zone_id: zone.id,

  showtime_id:
    selectedShowtime,

  quantity: qty,

  price: zone.price,

});

    });

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          user_id:
            user.id,

          event_id:
            Number(id),

          items,

        }),

      }
    );

    const data =
      await res.json();

    navigate(
  `/checkout/${data.order_id}`
);

  } catch (err) {

    console.log(err);

    alert(
      "Không thể tạo đơn hàng"
    );

  }

}

 if (!event) {

  return (
    <div className="
      min-h-screen
      bg-[#050816]
      flex
      items-center
      justify-center
      text-white
    ">
      Đang tải...
    </div>
  );

}

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl md:text-5xl font-black">
{event.title}
          </h1>

          <p className="text-gray-400 mt-3">
            
            {showtimes.length > 0 && (
  <>
    {new Date(
      showtimes[0].start_time
    ).toLocaleDateString("vi-VN")}

    {" • "}

    {new Date(
      showtimes[0].start_time
    ).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}

    {" - "}

    {new Date(
      showtimes[0].end_time
    ).toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}
  </>
)}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

  {showtimes.map((st) => (

    <button
      key={st.id}
      onClick={() =>
        setSelectedShowtime(st.id)
      }
      className={`
        px-4
        py-3
        rounded-2xl
        border
        transition

        ${
          selectedShowtime === st.id
            ? "bg-sky-500 border-sky-500 text-black"
            : "bg-white/5 border-white/10"
        }
      `}
    >

      {new Date(
        st.start_time
      ).toLocaleDateString(
        "vi-VN"
      )}

      <br />

      <span className="text-sm">
        {new Date(
          st.start_time
        ).toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      </span>

    </button>

  ))}

</div>

        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT */}

          <div className="space-y-5">

           {currentZones.map((zone) => (

              <div
                key={zone.id}
                className="
                  bg-[#0B1220]
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-2xl font-bold">
                      {zone.name}
                    </h3>

                    <p className="text-sky-400 text-xl font-bold mt-2">
                      {zone.price.toLocaleString(
                        "vi-VN"
                      )}đ
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <button
                      onClick={() =>
                        updateQty(
                          zone.id,
                          -1
                        )
                      }
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-white/10
                        text-xl
                      "
                    >
                      -
                    </button>

                    <div className="w-10 text-center text-xl font-bold">
                      {quantities[
                        zone.id
                      ] || 0}
                    </div>

                    <button
                      onClick={() =>
                        updateQty(
                          zone.id,
                          1
                        )
                      }
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-sky-500
                        text-black
                        text-xl
                        font-bold
                      "
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT */}

          <div>

            <div
              className="
                sticky
                top-24

                bg-[#0B1220]
                border
                border-white/10

                rounded-3xl

                p-6
              "
            >

              <h2 className="text-2xl font-black mb-6">
                Đơn hàng
              </h2>

              <div className="space-y-4">

              {currentZones.map((zone) => {

                  const qty =
                    quantities[
                      zone.id
                    ] || 0;

                  if (!qty)
                    return null;

                 

                  return (

                    <div
                      key={zone.id}
                      className="flex justify-between text-gray-300"
                    >
                      <span>
                        {zone.name}
                        {" x "}
                        {qty}
                      </span>

                      <span>
                        {(
                          qty *
                          zone.price
                        ).toLocaleString(
                          "vi-VN"
                        )}đ
                      </span>
                    </div>

                  );

                })}

              </div>

              <div className="border-t border-white/10 my-6" />

              <div className="flex justify-between text-gray-400">

                <span>
                  Số lượng vé
                </span>

                <span>
                  {totalQuantity}
                </span>

              </div>

              <div className="flex justify-between mt-4 text-2xl font-black text-sky-400">

                <span>
                  Tổng tiền
                </span>

                <span>
                  {totalPrice.toLocaleString(
                    "vi-VN"
                  )}đ
                </span>

              </div>

              <button
  onClick={
    handleCheckout
  }
  disabled={
    totalQuantity === 0
  }
                className={`
                  mt-8
                  w-full
                  py-4
                  rounded-2xl
                  font-bold
                  transition

                  ${
                    totalQuantity === 0
                      ? "bg-white/10 text-gray-500"
                      : "bg-gradient-to-r from-sky-500 to-cyan-400 text-black"
                  }
                `}
              >
                Tiếp tục
              </button>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}