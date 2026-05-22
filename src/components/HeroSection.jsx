import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ event }) {

  const navigate = useNavigate();

  const [currentImage, setCurrentImage] =
    useState(0);

  // NO EVENT
  if (!event) return null;

  // SLIDES
  const images = [
    event.image_url,

    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",

    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",

    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  ];

  // AUTO SLIDE
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentImage((prev) =>
        prev === images.length - 1
          ? 0
          : prev + 1
      );

    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (

    <section className="max-w-7xl mx-auto px-6 py-8">

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          h-[460px]
          bg-black
          border
          border-gray-800
        "
      >

        {/* IMAGE */}
        <img
          src={images[currentImage]}
          alt={event.title}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            transition-all
            duration-700
            opacity-70
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black
            via-black/70
            to-transparent
          "
        />

        {/* CONTENT */}
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            justify-center
            px-12
            z-10
          "
        >

          {/* LABEL */}
          <div
            className="
              w-fit
              px-4
              py-2
              rounded-full
              bg-sky-500/20
              border
              border-sky-400/30
              text-sky-300
              text-sm
              font-semibold
              backdrop-blur-sm
              mb-5
            "
          >
            ✨ SỰ KIỆN NỔI BẬT
          </div>

          {/* TITLE */}
          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
              max-w-3xl
              leading-tight
            "
          >
            {event.title}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-5
              text-gray-300
              max-w-2xl
              text-lg
              leading-relaxed
              line-clamp-3
            "
          >
            {event.description}
          </p>

          {/* BUTTON */}
          <div className="mt-8">

            <button
              onClick={() =>
                navigate(`/events/${event.id}`)
              }
              className="
                px-8
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                text-lg
                transition
                shadow-lg
                shadow-sky-500/20
              "
            >
              Xem chi tiết
            </button>

          </div>

        </div>

        {/* DOTS */}
        <div
          className="
            absolute
            bottom-6
            left-1/2
            -translate-x-1/2
            flex
            gap-3
            z-20
          "
        >

          {images.map((_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentImage(index)
              }
              className={`
                w-3
                h-3
                rounded-full
                transition-all
                ${
                  currentImage === index
                    ? "bg-white scale-125"
                    : "bg-white/40"
                }
              `}
            />

          ))}

        </div>

      </div>

    </section>

  );

}