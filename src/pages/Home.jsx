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

    fetch(`${import.meta.env.VITE_API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {

        setEvents(data);

        // FEATURED
        setFeaturedEvents(data.slice(0, 3));

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
          .sort(
            (a, b) =>
              new Date(a.event_date) -
              new Date(b.event_date)
          )
          .slice(0, 4);

        setUpcomingEvents(upcoming);

      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-900 text-white">

      <Navbar />

      <CategoryBar />

      <HeroSection />

      {/* FEATURED EVENTS */}
      <section className="max-w-6xl mx-auto px-6 pb-10">

        <h3 className="text-xl font-bold text-sky-300 mb-4">
          Sự kiện nổi bật
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}

        </div>

      </section>

      {/* NEWEST EVENTS */}
      <section className="max-w-6xl mx-auto px-6 pb-10">

        <h3 className="text-xl font-bold text-sky-300 mb-4">
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

        <h3 className="text-xl font-bold text-sky-300 mb-4">
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

        <h3 className="text-xl font-bold text-sky-300 mb-4">
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