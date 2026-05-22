import { useNavigate } from "react-router-dom";

export default function HeroSection({ event }) {

  const navigate = useNavigate();

  // NO EVENT
  if (!event) return null;

  return (

    <section className="max-w-7xl mx-auto px-6 py-8">

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          h-[460px]
          bg-black
          border border-gray-800
        "
      >

        {/* IMAGE */}
        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
          }
          alt={event.title}
          className="
            w-full
            h-full
            object-cover
          "
        />

        {/* DARK OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black
            via-black/70
            to-black/20
          "
        />

        {/* CONTENT */}
        <div
          className="
            absolute
            inset-0
            flex
            items-end
          "
        >

          <div className="p-10 max-w-3xl">

            {/* LABEL */}
            <p
              className="
                inline-block
                px-4
                py-1
                rounded-full
                bg-sky-500/20
                text-sky-300
                text-sm
                font-semibold
                tracking-wide
                mb-5
              "
            >
              SỰ KIỆN NỔI BẬT
            </p>

            {/* TITLE */}
            <h1
              className="
                text-5xl
                font-black
                leading-tight
                text-white
              "
            >
              {event.title}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-5
                text-gray-300
                text-lg
                leading-relaxed
                line-clamp-3
              "
            >
              {event.description}
            </p>

            {/* INFO */}
            <div className="flex items-center gap-6 mt-6 text-sm text-gray-300">

              <span>
                📍 {event.location}
              </span>

              <span>
                📅{" "}
                {new Date(event.start_date).toLocaleDateString("vi-VN")}
              </span>

            </div>

            {/* BUTTON */}
            <button
              onClick={() =>
                navigate(`/events/${event.id}`)
              }
              className="
                mt-8
                px-8
                py-3
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
                shadow-lg
              "
            >
              Xem chi tiết
            </button>

          </div>

        </div>

      </div>

    </section>

  );

}