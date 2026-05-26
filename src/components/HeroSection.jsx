import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function HeroSection({
  event,
}) {

  const navigate = useNavigate();

  // NO EVENT
  if (!event) return null;

  // IMAGE
  const imageUrl =
    event.image_url

      ? `${import.meta.env.VITE_API_URL}${event.image_url}`

      : "/no-image.png";

  // FORMAT DATE
  const formattedDate =
    event.start_date

      ? new Date(
          event.start_date
        ).toLocaleString(
          "vi-VN",
          {
            dateStyle: "full",
            timeStyle: "short",
          }
        )

      : "Sắp cập nhật thời gian";

  // STATUS
  const getStatus = () => {

    if (
      event.status ===
      "APPROVED"
    ) {

      return {
        text: "Đang mở bán",
        color:
          "bg-green-500/20 text-green-400 border-green-500/20",
      };

    }

    if (
      event.status ===
      "PENDING"
    ) {

      return {
        text: "Chờ duyệt",
        color:
          "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      };

    }

    return {
      text: "Đã hủy",
      color:
        "bg-red-500/20 text-red-400 border-red-500/20",
    };

  };

  const status =
    getStatus();

  return (

    <section className="max-w-7xl mx-auto px-6 py-8">

      <div
        className="
          relative
          overflow-hidden
          rounded-[36px]
          h-[520px]
          bg-black
          border
          border-white/10
        "
      >

        {/* IMAGE */}
        <img
          src={imageUrl}
          alt={event.title}
          className="
            absolute
            inset-0
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
            via-black/70
            to-black/20
          "
        />

        {/* CONTENT */}
        <div
          className="
            absolute
            inset-0
            z-10
            flex
            flex-col
            justify-center
            px-12
          "
        >

          {/* TOP BADGES */}
          <div className="flex gap-3 mb-5">

            {/* FEATURED */}
            <div
              className="
                px-4
                py-2
                rounded-full
                bg-sky-500/20
                border
                border-sky-500/20
                text-sky-300
                text-sm
                font-semibold
                backdrop-blur-sm
              "
            >
              SỰ KIỆN NỔI BẬT
            </div>

            {/* STATUS */}
            <div
              className={`
                px-4
                py-2
                rounded-full
                border
                text-sm
                font-semibold
                backdrop-blur-sm
                ${status.color}
              `}
            >
              {status.text}
            </div>

          </div>

          {/* TITLE */}
          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
              leading-tight
              max-w-4xl
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
              max-w-2xl
              leading-relaxed
              line-clamp-3
            "
          >
            {event.description ||
              "Sự kiện đang cập nhật mô tả"}
          </p>

          {/* DATE */}
          <div
            className="
              mt-6
              text-gray-300
              text-base
            "
          >
            📅 {formattedDate}
          </div>

          {/* LOCATION */}
          <div
            className="
              mt-2
              text-gray-400
              text-base
            "
          >
            📍 {event.location}
          </div>

          {/* BUTTON */}
          <div className="mt-10">

            <button
              onClick={() =>
                navigate(
                  `/events/${event.id}`
                )
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

      </div>

    </section>

  );

}