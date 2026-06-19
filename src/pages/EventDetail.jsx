import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [zones, setZones] = useState([]);
  const [expandedShowtime, setExpandedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event || null);
        setShowtimes(data.showtimes || []);
        setZones(data.zones || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div  className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex bg-[#050816] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Không tìm thấy sự kiện</div>
      </div>
    );
  }

  const now = new Date();

  const getZoneButton = (zone) => {

  const saleStart =
    zone.sale_start
      ? new Date(zone.sale_start)
      : null;

  const saleEnd =
    zone.sale_end
      ? new Date(zone.sale_end)
      : null;

  if (
    saleStart &&
    now < saleStart
  ) {

    return {
      disabled: true,
      text: "Chưa mở bán",
      color: "gray",
    };

  }

  if (
    saleEnd &&
    now > saleEnd
  ) {

    return {
      disabled: true,
      text: "Đã kết thúc",
      color: "red",
    };

  }

  if (
    typeof zone.remaining === "number" &&
    zone.remaining <= 0
  ) {

    return {
      disabled: true,
      text: "Hết vé",
      color: "red",
    };

  }

  return {
    disabled: false,
    text: "Mua vé",
    color: "green",
  };

};

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div
  className="
    max-w-6xl
    mx-auto
    px-4
    md:px-6
    py-6
    md:py-10
  "
>
<div
  className="
    relative
    overflow-hidden
    rounded-3xl
  "
>
        <img
          src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
          alt={event.title}
          className="
w-full
h-[220px]
md:h-[420px]
object-cover
rounded-3xl
"
        />

        <div
  className="
    absolute
    inset-0
    bg-gradient-to-t
    from-black/60
    to-transparent
  "
/>
</div>
        <div className="mt-8 max-w-4xl">

    
            <h1
  className="
    text-3xl
    md:text-5xl
    font-black
    leading-tight
  "
>{event.title}</h1>
            <div
  className="
    flex
    flex-wrap
    gap-3
    mt-5
  "
>

  <span
    className="
      px-4
      py-2
      rounded-full
      bg-sky-500/10
      text-sky-400
    "
  >
    {event.category_name}
  </span>

  <span
    className="
      px-4
      py-2
      rounded-full
      bg-white/5
      text-gray-300
    "
  >
    {event.location}
  </span>

</div>
            
          </div>

        </div>

        <div className="mt-12 mb-6">
  <h2
  className="
    text-2xl
    md:text-4xl
    font-black
  "
>
  Mua vé
</h2>

  <p className="text-gray-400 mt-2">
    Chọn thời gian diễn để xem các hạng vé
  </p>
</div>

      <div className="space-y-4 mt-10">
              {showtimes.map((st) => {

              const start = new Date(st.start_time);
              const end = new Date(st.end_time);

              const isOpen =
               expandedShowtime === st.id;

              return (
               <div
  key={st.id}
  className={`
    rounded-3xl
    overflow-hidden
    border
    transition-all
    duration-300
    hover:scale-[1.01]
    hover:border-sky-400/50
    ${
      isOpen
        ? "border-sky-400 bg-gradient-to-r from-[#0B1120] to-[#13203A]"
        : "border-white/10 bg-[#0B1120]"
    }
  `}
>

              <button
                onClick={() =>
                  setExpandedShowtime(
                    isOpen ? null : st.id
                  )
                }
                className="
w-full
p-4
md:p-6
flex
justify-between
items-center
"
              >
                <div>
                  <div className="font-bold text-lg">
  {start.toLocaleDateString("vi-VN")}
</div>

                  <div className="text-gray-400 mt-1">
  {start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}
  {" - "}
  {end.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}
</div>
                </div>

          <div
  className={`
    text-xl
    transition-transform
    duration-300
    ${isOpen ? "rotate-180" : ""}
  `}
>
  ▼
</div>
        </button>

        {isOpen && (
          <div className="border-t border-white/10">

            {zones.map((zone) => {

              const btn =
                getZoneButton(zone);

              const price =
                new Intl.NumberFormat(
                  "vi-VN",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                ).format(
                  Number(zone.price)
                );

              return (
                <div
  className="
    mx-4
    my-4
    p-6
    rounded-2xl
    bg-white/5
    border
    border-white/10
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-4
  "
>

                  <div>
                    <div className="font-bold">
                      {zone.name}
                    </div>

                    <div className="text-sky-400 mt-1">
                      {price}
                    </div>
                  </div>

                  <button
                    disabled={btn.disabled}
                    onClick={() =>
                      navigate(
                        `/event/${event.id}/seatmap?zone=${zone.id}&showtime=${st.id}`
                      )
                    }
                    className={`
px-6
py-3
rounded-2xl
font-semibold
transition

${
  btn.disabled

    ? "bg-white/10 text-gray-400"

    : `
      bg-gradient-to-r
      from-sky-500
      to-cyan-400
      text-black
      hover:opacity-90
    `
}
`}
                  >
                    {btn.text}
                  </button>

                </div>
              );

            })}

          </div>
        )}

      </div>
    );

  })}

        </div>
<div className="mt-6 bg-white/5
backdrop-blur-sm
 border border-white/10 rounded-3xl p-6">
              <h2
  className="
    text-lg
    font-semibold
    text-gray-300
    mb-3
  "
>
  Thông tin sự kiện
</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>

      <Footer />
    </div>
  );
}
