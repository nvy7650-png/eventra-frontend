import {
  useEffect,
  useState,
} from "react";



import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {


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

    <div
  className="
    min-h-screen
    bg-[#050816]
    text-white
    flex
    overflow-x-hidden
  "
>

      <AdminSidebar />

      {/* MAIN */}
      <main
  className="
    flex-1
    min-w-0

    lg:ml-72
  "
>

        {/* TOPBAR */}
       <div
  className="
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between

    gap-4

    px-4
    md:px-10

    py-3

    border-b
    border-white/10

    bg-[#081120]
  "
>

          <div>

           <h1
  className="
  text-xl
  md:text-3xl
  font-bold
"
>
              Admin Dashboard
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>



        </div>

       {/* CONTENT */}
<div
  className="
    p-4
    md:p-10
  "
>

          {/* STATS */}
          <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    xl:grid-cols-4
    gap-6
  "
>

            {/* USERS */}
            <div
              className="
  bg-gradient-to-br
  from-sky-500/10
  to-sky-900/20

  border
  border-sky-500/20

  rounded-3xl
  p-7

  hover:scale-[1.02]
  transition
"
            >

              <p className="text-gray-400 mb-3">
                Tổng Users
              </p>

              <h2
                className="
                 text-3xl md:text-5xl
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
  bg-gradient-to-br
  from-pink-500/10
  to-pink-900/20

  border
  border-pink-500/20

  rounded-3xl
  p-7

  hover:scale-[1.02]
  transition
"
            >

              <p className="text-gray-400 mb-3">
                Tổng sự kiện
              </p>

              <h2
                className="
                 text-3xl md:text-5xl
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
  bg-gradient-to-br
  from-green-500/10
  to-green-900/20

  border
  border-green-500/20

  rounded-3xl
  p-7

  hover:scale-[1.02]
  transition
"
            >

              <p className="text-gray-400 mb-3">
                Tổng đơn hàng
              </p>

              <h2
                className="
                  text-3xl md:text-5xl
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
  bg-gradient-to-br
  from-orange-500/10
  to-orange-900/20

  border
  border-orange-500/20

  rounded-3xl
  p-7

  hover:scale-[1.02]
  transition
"
            >

              <p className="text-gray-400 mb-3">
                Doanh thu
              </p>

              <h2
 className="
  text-2xl
  md:text-4xl
  font-black
  text-orange-400
  break-all
"
>
               {Number(stats.revenue || 0)
  .toLocaleString("vi-VN")}đ
              </h2>

            </div>

          </div>

          {/* EVENT MANAGEMENT */}
         <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-3
    gap-6
    mt-8
  "
>

  <div className="
  bg-yellow-500/5
border-yellow-500/20
 border border-white/10 
 rounded-3xl p-6">

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

  <div className="bg-green-500/5
border-green-500/20
 border 
 border-white/10 \\
 rounded-3xl p-6">

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

  <div className="bg-red-500/5
border-red-500/20
 border border-white/10 
 rounded-3xl p-6">

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


</div>
      </main>

    </div>

  );

}