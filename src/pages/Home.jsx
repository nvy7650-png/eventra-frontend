import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import HeroSection from "../components/HeroSection";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

export default function Home() {

  const [events, setEvents] = useState([]);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(
      "https://homieticket-backend.onrender.com/api/events"
    )
      .then((res) => res.json())
      .then((data) => {

        setEvents(data);

        // FEATURED
        setFeaturedEvents(data.slice(0, 3));

        // NEWEST
        const newest = [...data].sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );

        setLatestEvents(newest.slice(0, 4));

        // UPCOMING
        const upcoming = [...data].sort(
          (a, b) =>
            new Date(a.event_date) -
            new Date(b.event_date)
        );

        setUpcomingEvents(upcoming.slice(0, 4));

      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-950
          text-white
        "
      >
        Loading...
      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <CategoryBar />

      <HeroSection />

      {/* FEATURED */}
<section className="max-w-7xl mx-auto px-6 py-10">

  <h2
    className="
      text-3xl
      font-bold
      text-white
      mb-6
    "
  >
    Sự kiện nổi bật
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    {featuredEvents.map((event) => (

      <EventCard
        key={event.id}
        event={event}
      />

    ))}

  </div>

</section>


{/* NEWEST */}
<section className="max-w-7xl mx-auto px-6 pb-10">

  <h2
    className="
      text-3xl
      font-bold
      text-white
      mb-6
    "
  >
    Sự kiện mới nhất
  </h2>

  <div className="grid md:grid-cols-4 gap-5">

    {latestEvents.map((event) => (

      <EventCard
        key={event.id}
        event={event}
        small
      />

    ))}

  </div>

</section>


{/* UPCOMING */}
<section className="max-w-7xl mx-auto px-6 pb-10">

  <h2
    className="
      text-3xl
      font-bold
      text-white
      mb-6
    "
  >
    Sự kiện sắp diễn ra
  </h2>

  <div className="grid md:grid-cols-4 gap-5">

    {upcomingEvents.map((event) => (

      <EventCard
        key={event.id}
        event={event}
        small
      />

    ))}

  </div>

</section>


{/* ALL EVENTS */}
<section className="max-w-7xl mx-auto px-6 pb-20">

  <h2
    className="
      text-3xl
      font-bold
      text-white
      mb-6
    "
  >
    Tất cả sự kiện
  </h2>

  <div className="grid md:grid-cols-4 gap-5">

    {events.map((event) => (

      <EventCard
        key={event.id}
        event={event}
        small
      />

    ))}

  </div>

</section>

      <Footer />

    </div>

  );

}