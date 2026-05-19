export default function EventCard({ event, small }) {

  const formattedDate = event.start_date
    ? new Date(event.start_date).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Chưa có ngày";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-sky-300 hover:shadow-lg transition cursor-pointer">

      {/* IMAGE */}
      <img
        src={
          event.image_url ||
          "https://placehold.co/600x400?text=EVENTRA"
        }
        alt={event.title}
        className={`w-full object-cover ${
          small ? "h-40" : "h-52"
        }`}
      />

      <div className="p-4">

        <h4 className="font-semibold text-white line-clamp-2">
          {event.title}
        </h4>

        <p className="text-gray-400 text-sm mt-1">
          {formattedDate}
        </p>

        <p className="text-gray-500 text-sm mt-1">
          {event.location}
        </p>

        <div className="mt-3 text-sky-300 font-semibold">
          Xem chi tiết
        </div>

      </div>
    </div>
  );
}