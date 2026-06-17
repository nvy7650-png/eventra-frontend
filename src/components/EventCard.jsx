import { useNavigate } from "react-router-dom";

export default function EventCard({
  event,
  small = false,
}) {

  const navigate = useNavigate();

  // FORMAT SHOWTIME
  const formattedDate =
    event.first_showtime
      ? new Date(
          event.first_showtime
        ).toLocaleString(
          "vi-VN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          }
        )
      : "Sắp cập nhật";

  // IMAGE URL
  const imageUrl =
    event.image_url
      ? `${import.meta.env.VITE_API_URL}${event.image_url}`
      : "/no-image.png";

  // STATUS
  const getStatus = () => {

    switch (event.status) {

      case "APPROVED":
        return {
          text: "Đang mở bán",
          color:
            "bg-green-500/20 text-green-400 border border-green-500/20",
        };

      case "PENDING":
        return {
          text: "Chờ duyệt",
          color:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
        };

      case "CANCELLED":
        return {
          text: "Đã hủy",
          color:
            "bg-red-500/20 text-red-400 border border-red-500/20",
        };

      default:
        return {
          text: event.status,
          color:
            "bg-gray-500/20 text-gray-400 border border-gray-500/20",
        };

    }

  };

  const status = getStatus();

  return (

    <div
      className="
        bg-[#0B1220]
        border border-white/10
        rounded-3xl
        overflow-hidden
        hover:border-sky-400
        hover:-translate-y-1
        transition-all
        duration-300
        flex
        flex-col
      "
    >

      {/* IMAGE */}
      <div
  className="
    overflow-hidden
    aspect-video
    bg-[#081120]
  "
>

        <img
          src={imageUrl}
          alt={event.title}
          className="
            w-full
            h-full
            object-contain
            hover:scale-105
            transition
            duration-500
          "
        />

      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* STATUS */}
        <div
          className={`
            inline-flex
            items-center
            w-fit
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            mb-3
            ${status.color}
          `}
        >
          {status.text}
        </div>

        {/* TITLE */}
        <h3
          className="
            text-lg
            font-bold
            text-white
            line-clamp-2
            min-h-[56px]
          "
        >
          {event.title}
        </h3>

        {/* DATE */}
        <p
          className="
            text-gray-400
            text-sm
            mt-3
          "
        >
          📅 {formattedDate}
        </p>

        {/* LOCATION */}
        <p
          className="
            text-gray-500
            text-sm
            mt-2
            line-clamp-1
          "
        >
          📍 {event.location}
        </p>

        {/* CATEGORY */}
        {event.category_name && (

          <p
            className="
              text-sky-400
              text-sm
              mt-2
            "
          >
            🎵 {event.category_name}
          </p>

        )}

        {/* PRICE */}
        {event.min_price && (

          <p
            className="
              text-green-400
              font-bold
              mt-4
            "
          >
            Từ{" "}
            {Number(
              event.min_price
            ).toLocaleString(
              "vi-VN"
            )}đ
          </p>

        )}

        {/* BUTTON */}
        <button
          onClick={() =>
            navigate(`/event/${event.id}`)
          }
          className="
            mt-auto
            pt-4
            w-full
            py-3
            rounded-2xl
            bg-sky-500/10
            text-sky-400
            font-semibold
            hover:bg-sky-500
            hover:text-black
            transition
          "
        >
          Xem chi tiết
        </button>

      </div>

    </div>

  );

}