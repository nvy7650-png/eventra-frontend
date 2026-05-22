import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import HeroSection from "../components/HeroSection";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";

import eventsData from "../mock/events";

export default function Home() {

  const [events, setEvents] = useState([]);

  const [latestEvents, setLatestEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // MOCK API
    const data = eventsData;

    // ALL EVENTS
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

    // FAKE LOADING
    setTimeout(() => {

      setLoading(false);

    }, 600);

  }, []);

  // LOADING
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

      {/* NAVBAR */}
      <Navbar />

      {/* CATEGORY */}
      <CategoryBar />

      {/* HERO SECTION */}
      {upcomingEvents.length > 0 && (

        <HeroSection
          event={upcomingEvents[0]}
        />

      )}

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

        <div className="flex items-center justify-between mb-5">

          <h3
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            Tất cả sự kiện
          </h3>

          <p className="text-sm text-gray-500">
            {events.length} sự kiện
          </p>

        </div>

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

      {/* FOOTER */}
      <Footer />

    </div>

  );

}