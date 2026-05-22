import { useNavigate } from "react-router-dom";

export default function HeroSection() {

  const navigate = useNavigate();

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
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
          alt="event"
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

          <p className="text-sky-400 font-semibold mb-3">
            SỰ KIỆN NỔI BẬT
          </p>

          <h1
            className="
              text-5xl
              font-black
              max-w-2xl
              leading-tight
            "
          >
            SKY WAVE MUSIC FESTIVAL 2026
          </h1>

          <p
            className="
              mt-4
              text-gray-300
              max-w-xl
              text-lg
            "
          >
            Đại nhạc hội với những nghệ sĩ hàng đầu,
            trải nghiệm âm nhạc và ánh sáng bùng nổ.
          </p>

          <div className="flex items-center gap-4 mt-8">

            <button
              onClick={() => navigate("/events/1")}
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

            <button
              onClick={() => navigate("/events/1/seats")}
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