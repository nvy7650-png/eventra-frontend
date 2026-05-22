import { useNavigate } from "react-router-dom";

export default function HeroSection({ event }) {

  const navigate = useNavigate();

  // NO EVENT
  if (!event) return null;

  return (

    <section className="max-w-6xl mx-auto px-6 py-8">

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          h-[420px]
          bg-black
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
            via-black/60
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
            px-10
          "
        >

          {/* LABEL */}
          <p className="text-sky-400 font-semibold mb-3">
            SỰ KIỆN NỔI BẬT
          </p>

          {/* TITLE */}
          <h1
            className="
              text-5xl
              font-black
              max-w-2xl
              leading-tight
            "
          >
            {event.title}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-4
              text-gray-300
              max-w-xl
              text-lg
              line-clamp-3
            "
          >
            {event.description}
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-4 mt-8">

            {/* DETAIL */}
            <button
              onClick={() =>
                navigate(`/events/${event.id}`)
              }
              className="
                px-7
                py-3
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
              "
            >
              Xem chi tiết
            </button>

            {/* BOOK */}
            <button
              onClick={() =>
                navigate(`/events/${event.id}/seats`)
              }
              className="
                px-7
                py-3
                rounded-2xl
                border
                border-white/20
                bg-white/10
                hover:bg-white/20
                font-semibold
                transition
              "
            >
              Đặt vé ngay
            </button>

          </div>

        </div>

      </div>

    </section>

  );

}