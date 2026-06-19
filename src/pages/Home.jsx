import {
useEffect,
useState,
} from "react";

import {
useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import HeroSection from "../components/HeroSection";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

export default function Home() {

const navigate = useNavigate();

const [events, setEvents] = useState([]);
const [latestEvents, setLatestEvents] = useState([]);
const [upcomingEvents, setUpcomingEvents] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

fetch(
  `${import.meta.env.VITE_API_URL}/api/events`
)
  .then((res) => res.json())

  .then((data) => {

    const approvedEvents =
      data.filter(
        (event) =>
          event.status === "APPROVED"
      );

      const heroEvents =
  [...approvedEvents]

    .sort(
      (a, b) =>
        (b.sold_count || 0) -
        (a.sold_count || 0)
    )

    .slice(0, 8);

    setEvents(approvedEvents);

    const newest = [...approvedEvents]

      .sort(
  (a, b) =>
    new Date(b.approved_at || b.created_at) -
    new Date(a.approved_at || a.created_at)
)

      .slice(0, 8);

    setLatestEvents(newest);

    const upcoming = [...approvedEvents]

      .filter(
        (event) =>
          event.first_showtime &&
          new Date(
            event.first_showtime
          ) >= new Date()
      )

      .sort(
        (a, b) =>
          new Date(a.first_showtime) -
          new Date(b.first_showtime)
      )

    .slice(0, 8);

    setUpcomingEvents(upcoming);

  })

  .catch(console.log)

  .finally(() => {

    setLoading(false);

  });

}, []);

if (loading) {

return (

  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#050816]
      text-white
    "
  >

    <div className="text-center">

      <div
        className="
          w-12
          h-12
          border-4
          border-sky-400
          border-t-transparent
          rounded-full
          animate-spin
          mx-auto
        "
      />

      <p className="mt-4 text-gray-400">
        Đang tải sự kiện...
      </p>

    </div>

  </div>

);

}

return (

<div className="min-h-screen bg-[#050816] text-white">

  <Navbar />

  <CategoryBar />

  {(upcomingEvents.length > 0 ||
    latestEvents.length > 0) && (

   <HeroSection
  event={heroEvents[0]}
/>

  )}

  {/* NEWEST EVENTS */}
  <section className="max-w-7xl mx-auto px-6 pb-12">

    <h2 className="text-2xl md:text-3xl font-black mb-6">
      Sự kiện mới nhất
    </h2>

    {latestEvents.length > 0 ? (

      <div
        className="
          grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-6
        "
      >

        {latestEvents.map((event) => (

          <EventCard
            key={event.id}
            event={event}
          />

        ))}

      </div>

    ) : (

      <div
        className="
          bg-[#0B1220]
          border
          border-white/10
          rounded-3xl
          p-12
          text-center
        "
      >

        Chưa có sự kiện mới

      </div>

    )}

  </section>

  {/* UPCOMING EVENTS */}
  <section className="max-w-7xl mx-auto px-6 pb-12">

    <h2 className="text-2xl md:text-3xl font-black mb-6">
      Sự kiện sắp diễn ra
    </h2>

    {upcomingEvents.length > 0 ? (

      <div
        className="
          grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-6
        "
      >

        {upcomingEvents.map((event) => (

          <EventCard
            key={event.id}
            event={event}
          />

        ))}

      </div>

    ) : (

      <div
        className="
          bg-[#0B1220]
          border
          border-white/10
          rounded-3xl
          p-12
          text-center
        "
      >

        Chưa có sự kiện sắp diễn ra

      </div>

    )}

  </section>

  {/* ALL EVENTS */}
  <section className="max-w-7xl mx-auto px-6 pb-20">

    <div
      className="
        flex
        items-center
        justify-between
        mb-6
      "
    >

      <h2 className="text-2xl md:text-3xl font-black">
        Khám phá sự kiện
      </h2>

      <button
        onClick={() =>
          navigate("/events")
        }
        className="
          px-5
          py-3
          rounded-2xl
          bg-[#0B1220]
          border
          border-white/10
          hover:bg-white/10
          transition
        "
      >
       Xem tất cả →
      </button>

    </div>

    {events.length > 0 ? (

      <div
        className="
          grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-6
        "
      >

        {events
  .slice(0, 9)
  .map((event) => (

    <EventCard
      key={event.id}
      event={event}
    />

))}

      </div>

    ) : (

      <div
        className="
          bg-[#0B1220]
          border
          border-white/10
          rounded-3xl
          p-16
          text-center
        "
      >

        <h3 className="text-2xl font-bold mb-3">
          Chưa có sự kiện nào
        </h3>

        <p className="text-gray-400">
          Chưa có sự kiện được duyệt
        </p>

      </div>

    )}

  </section>

  <Footer />

</div>

);

}
