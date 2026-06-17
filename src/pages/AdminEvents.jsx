const [events, setEvents] = useState([]);

const navigate = useNavigate();

useEffect(() => {
  fetch(
    `${import.meta.env.VITE_API_URL}/api/events/admin/all`
  )
    .then((res) => res.json())
    .then((data) => {
      setEvents(data || []);
    })
    .catch(console.log);
}, []);

<div className="p-10">

  <h1 className="text-4xl font-black">
    Quản lý sự kiện
  </h1>

  <p className="text-gray-400 mt-2">
    Duyệt và quản lý các sự kiện trên hệ thống
  </p>

  <div className="grid md:grid-cols-3 gap-4 mt-8">

  <div className="bg-[#0B1120] rounded-3xl p-6">
    <p className="text-gray-400">
      Chờ duyệt
    </p>

    <h2 className="text-4xl font-black text-yellow-400">
      {
        events.filter(
          e => e.status === "PENDING"
        ).length
      }
    </h2>
  </div>

  <div className="bg-[#0B1120] rounded-3xl p-6">
    <p className="text-gray-400">
      Đã duyệt
    </p>

    <h2 className="text-4xl font-black text-green-400">
      {
        events.filter(
          e => e.status === "APPROVED"
        ).length
      }
    </h2>
  </div>

  <div className="bg-[#0B1120] rounded-3xl p-6">
    <p className="text-gray-400">
      Đã hủy
    </p>

    <h2 className="text-4xl font-black text-red-400">
      {
        events.filter(
          e => e.status === "CANCELLED"
        ).length
      }
    </h2>
  </div>

</div>
<div className="grid lg:grid-cols-2 gap-6 mt-8">

  {events.map((event) => (

    <div
      key={event.id}
      className="
        bg-[#0B1120]
        border border-white/10
        rounded-3xl
        p-6
      "
    >

     <div className="flex justify-between items-start">

  <div>

    <h2 className="text-xl font-bold">
      {event.title}
    </h2>

    <p className="text-gray-400 mt-1">
      {event.category_name}
    </p>

  </div>

  <span
    className={`
      px-3
      py-1
      rounded-full
      text-xs
      font-bold
      ${
        event.status === "APPROVED"
          ? "bg-green-500/20 text-green-400"
          : event.status === "PENDING"
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-red-500/20 text-red-400"
      }
    `}
  >
    {event.status}
  </span>

</div>

<div className="flex gap-3 mt-6">

  <button
  onClick={() =>
    navigate(`/admin/events/${event.id}`)
  }
  className="
    px-4
    py-2
    rounded-2xl
    bg-sky-500
    text-black
    font-semibold
  "
>
  Chi tiết
</button>

  {event.status === "PENDING" && (

    <button
      className="
        px-4
        py-2
        rounded-2xl
        bg-green-500
        text-black
        font-semibold
      "
    >
      Duyệt
    </button>

  )}

  {event.status !== "CANCELLED" && (

    <button
      className="
        px-4
        py-2
        rounded-2xl
        bg-red-500
        font-semibold
      "
    >
      Hủy
    </button>

  )}

</div>

    </div>

  ))}

</div>

</div>

