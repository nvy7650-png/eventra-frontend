import { useNavigate } from "react-router-dom";

export default function EventCard({
  event,
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


  return (
    

    <div
    onClick={() =>
    navigate(`/event/${event.id}`)
  }
      className="
      cursor-pointer
        bg-[#0B1220]
        border border-white/10
        rounded-3xl
        overflow-hidden
        hover:border-sky-400
        md:hover:-translate-y-2
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
    object-cover
md:hover:scale-105
    transition
    duration-500
  "
/>

      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-5 flex flex-col flex-1">


        {/* TITLE */}
        <h3
          className="
            text-base
            md:text-lg
            font-bold
            text-white
            line-clamp-2
            h-[52px]
md:h-[56px]
          "
        >
          {event.title}
        </h3>


        {/* DATE */}
        <p
          className="
text-gray-400
text-sm
md:text-[15px]
mt-2
"
        >
          {formattedDate}
        </p>

        {/* LOCATION */}
        <p
          className="
text-gray-500
text-sm
md:text-[15px]
mt-1
line-clamp-2
min-h-[40px]
"
        >
          {event.location}
        </p>

        {/* CATEGORY */}
        {event.category_name && (

          <p
            className="
mt-3
inline-flex
w-fit

px-3
py-1

rounded-full

bg-sky-500/10
text-sky-400

text-xs
font-medium
"
          >
                {event.category_name}
          </p>

        )}

        {/* PRICE */}
        {event.min_price && (

          <p
            className="
              text-green-400
              font-bold
              text-lg
md:text-xl
              mt-3
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
mt-6

w-full

py-3
md:py-3.5

rounded-xl
md:rounded-2xl

bg-sky-500/10
text-sky-400

font-semibold

md:hover:bg-sky-500
md:hover:text-black

transition-all
duration-300
"
        >
          Xem chi tiết
        </button>

      </div>

    </div>

  );

}