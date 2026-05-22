import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import HeroSection from "../components/HeroSection";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

export default function Home() {

  const [events, setEvents] = useState([]);

  const [latestEvents, setLatestEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {

        setEvents(data);

        // NEWEST EVENTS
        const newest = [...data]
          .sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          )
          .slice(0, 4);

        setLatestEvents(newest);

        // UPCOMING EVENTS
        const upcoming = [...data]
          .filter(
            (event) =>
              new Date(event.start_date) >= new Date()
          )
          .sort(
            (a, b) =>
              new Date(a.start_date) -
              new Date(b.start_date)
          )
          .slice(0, 4);

        setUpcomingEvents(upcoming);

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
          bg-gray-900
          text-white
        "
      >
        Loading...
      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-900 text-white">

      <Navbar />

      <CategoryBar />

      {/* HERO */}
      <HeroSection
        event={upcomingEvents[0]}
      />

      {/* NEWEST EVENTS */}
      <section className="max-w-6xl mx-auto px-6 pb-10">

        <h3
          className="
            text-2xl
            font-bold
            text-white
            mb-5
          "
        >
          Sự kiện mới nhất
        </h3>

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

      {/* UPCOMING EVENTS */}
      <section className="max-w-6xl mx-auto px-6 pb-10">

        <h3
          className="
            text-2xl
            font-bold
            text-white
            mb-5
          "
        >
          Sự kiện sắp diễn ra
        </h3>

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
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h3
          className="
            text-2xl
            font-bold
            text-white
            mb-5
          "
        >
          Tất cả sự kiện
        </h3>

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