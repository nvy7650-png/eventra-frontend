import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ChevronRight,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] =
    useState({

      totalUsers: 0,
      totalEvents: 0,
      totalOrders: 0,
      revenue: 0,

    });

  const [events, setEvents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // GET ADMIN STATS
  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/stats`
    )

      .then((res) => res.json())

      .then((data) => {

        setStats(data);

      })

      .catch((err) => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  // GET ALL EVENTS FOR ADMIN
  useEffect(() => {

    fetch(`${import.meta.env.VITE_API_URL}/api/events/admin/all`)
      .then((res) => res.json())
      .then((data) => {

        setEvents(data || []);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);


  // LOADING
  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          flex
          items-center
          justify-center
          text-white
        "
      >

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-sky-400
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-400">
            Đang tải dashboard...
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#050816] text-white flex">

      <AdminSidebar />

      {/* MAIN */}
      <main className="flex-1">

        {/* TOPBAR */}
        <div
          className="
            flex
            items-center
            justify-between
            px-10
            py-6
            border-b
            border-white/10
            bg-[#081120]
          "
        >

          <div>

            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-1">
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/")
            }
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white/5
              hover:bg-white/10
              border
              border-white/10
              transition
            "
          >

            Trang chủ

            <ChevronRight size={18} />

          </button>

        </div>

        {/* CONTENT */}
        <div className="p-10">

          {/* STATS */}
          <div className="grid lg:grid-cols-4 gap-6">

            {/* USERS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng Users
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-sky-400
                "
              >
                {stats.totalUsers}
              </h2>

            </div>

            {/* EVENTS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng sự kiện
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-pink-400
                "
              >
                {stats.totalEvents}
              </h2>

            </div>

            {/* ORDERS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng đơn hàng
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-green-400
                "
              >
                {stats.totalOrders}
              </h2>

            </div>

            {/* REVENUE */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Doanh thu
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-orange-400
                "
              >
               {Number(stats.revenue || 0)
  .toLocaleString("vi-VN")}đ
              </h2>

            </div>

          </div>

          {/* EVENT MANAGEMENT */}
         <div className="grid lg:grid-cols-3 gap-6 mt-8">

  <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">

    <p className="text-gray-400 text-sm">
      Chờ duyệt
    </p>

    <h2 className="text-4xl font-black text-yellow-400 mt-2">
      {
        events.filter(
          e => e.status === "PENDING"
        ).length
      }
    </h2>

  </div>

  <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">

    <p className="text-gray-400 text-sm">
      Đã duyệt
    </p>

    <h2 className="text-4xl font-black text-green-400 mt-2">
      {
        events.filter(
          e => e.status === "APPROVED"
        ).length
      }
    </h2>

  </div>

  <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-6">

    <p className="text-gray-400 text-sm">
      Đã hủy
    </p>

    <h2 className="text-4xl font-black text-red-400 mt-2">
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
            px-3 py-1 rounded-full text-xs font-bold
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
    px-4 py-2
    rounded-2xl
    bg-sky-500
    text-black
    font-semibold
  "
>
  Chi tiết
</button>

      </div>

    </div>

  ))}

</div>

          {/* EMPTY STATE */}
          <div
            className="
              mt-10
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-16
              text-center
            "
          >

            <h2
              className="
                text-4xl
                font-black
                mb-4
              "
            >
              HOMIETICKET ADMIN
            </h2>

            <p className="text-gray-400 text-lg">
              Quản lý toàn bộ hệ thống sự kiện,
              organizer, user và doanh thu.
            </p>

          </div>

        </div>

      </main>

    </div>

  );

}