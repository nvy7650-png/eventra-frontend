import { useNavigate } from "react-router-dom";

export default function HeroSection({
event,
}) {

const navigate = useNavigate();

if (!event) return null;

// IMAGE
const imageUrl =
event.image_url
? `${import.meta.env.VITE_API_URL}${event.image_url}`
: "/no-image.png";

// DATE
const formattedDate =
event.first_showtime
? new Date(
event.first_showtime
).toLocaleString(
"vi-VN",
{
dateStyle: "full",
timeStyle: "short",
}
)
: "Sắp cập nhật";

// STATUS
const getStatus = () => {

switch (event.status) {

  case "APPROVED":
    return {
      text: "Đang mở bán",
      color:
        "bg-green-500/20 text-green-400 border-green-500/20",
    };

  case "PENDING":
    return {
      text: "Chờ duyệt",
      color:
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    };

  case "CANCELLED":
    return {
      text: "Đã hủy",
      color:
        "bg-red-500/20 text-red-400 border-red-500/20",
    };

  default:
    return {
      text: event.status,
      color:
        "bg-gray-500/20 text-gray-400 border-gray-500/20",
    };

}

};

const status = getStatus();

return (

<section className="max-w-7xl mx-auto px-6 py-8">

  <div
    className="
      relative
      overflow-hidden
      rounded-3xl
md:rounded-[36px]
      h-[500px]
md:h-[560px]
lg:h-[650px]
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
        opacity-60
      "
    />

    {/* OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-gradient-to-r
from-black
via-black/90
to-black/40

md:bg-gradient-to-r
md:from-black
md:via-black/75
md:to-transparent
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
        px-6
md:px-12
      "
    >

      {/* BADGES */}
      <div className="flex flex-wrap gap-3 mb-6">


        {event.category_name && (

          <div
            className="
             px-3
py-1.5
text-xs
md:text-sm
              rounded-full
              bg-purple-500/20
              border
              border-purple-500/20
              text-purple-300
              text-sm
              font-semibold
            "
          >
            {event.category_name}
          </div>

        )}


      </div>

      {/* TITLE */}
      <h1
        className="
          text-3xl
sm:text-4xl
lg:text-6xl
          font-black
          leading-tight
          max-w-5xl
        "
      >
        {event.title}
      </h1>

      {/* DESCRIPTION */}
      <p
        className="
          mt-6
          text-gray-300
          text-sm
md:text-lg
          max-w-3xl
          leading-relaxed
          line-clamp-3
        "
      >
        {event.description ||
          "Sự kiện đang cập nhật mô tả"}
      </p>

      {/* INFO */}
      <div
  className="
    mt-6
    md:mt-8
    space-y-1
    md:space-y-2
  "
>

        <p
  className="
    text-sm
    md:text-base
    text-gray-200
  "
>
          {formattedDate}
        </p>

        <p
  className="
    text-sm
    md:text-base
    text-gray-400
  "
>
          {event.location}
        </p>

        {event.min_price && (

          <p
            className="
              text-green-400
              font-bold
              text-lg
md:text-2xl
            "
          >
            Từ{" "}
            {Number(
              event.min_price
            ).toLocaleString("vi-VN")}đ
          </p>

        )}

      </div>

      {/* BUTTON */}
      <div className="mt-10">

        <button
          onClick={() =>
            navigate(
              `/event/${event.id}`
            )
          }
          className="
            px-6
md:px-8

py-3
md:py-4

text-base
md:text-lg

rounded-xl
md:rounded-2xl
            rounded-2xl
            bg-sky-500
            hover:bg-sky-400
            text-black
            font-bold
            line-clamp-2
md:line-clamp-3
            transition
            shadow-lg
            shadow-sky-500/20
          "
        >
          Xem chi tiết →
        </button>

      </div>

    </div>

  </div>

</section>

);

}
