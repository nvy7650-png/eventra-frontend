import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Wallet,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  BadgePercent,
} from "lucide-react";


import OrganizerSidebar
  from "../components/OrganizerSidebar";


export default function OrganizerDashboard() {

  const navigate = useNavigate();

  // USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // STATS
  const [stats, setStats] =
    useState({

      totalEvents: 0,
      totalTickets: 0,
      revenue: 0,

    });

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // CHECK LOGIN
  useEffect(() => {

    if (
      !user ||

      user.role !==
      "ORGANIZER"
    ) {

      navigate("/login");

      return;

    }

  }, []);

  // GET STATS
  useEffect(() => {

    // NO USER
    if (!user?.id) {

      setLoading(false);

      return;

    }

    fetch(

      `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}/stats`

    )

      .then((res) => res.json())

      .then((data) => {

        setStats({

          totalEvents:
            data.totalEvents || 0,

          totalTickets:
            data.totalTickets || 0,

          revenue:
            data.revenue || 0,

        });

      })

      .catch((err) => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };

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

     <OrganizerSidebar/>
     
      {/* MAIN */}
      <main  className="ml-80">

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
              Organizer Dashboard
            </h1>

            <p className="text-gray-400 mt-1">
              Quản lý sự kiện và bán vé
            </p>

          </div>

          {/* HOME */}
          <button
            type="button"
            onClick={() => {

              navigate("/");

            }}
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
          <div className="grid lg:grid-cols-3 gap-6">

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
                  text-sky-400
                "
              >

                {stats.totalEvents}

              </h2>

            </div>

            {/* TICKETS */}
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
                Vé đã bán
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-green-400
                "
              >

                {stats.totalTickets}

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
                  text-pink-400
                "
              >

                {Number(stats.revenue)
                  .toLocaleString("vi-VN")}đ

              </h2>

            </div>

          </div>

          {/* CREATE EVENT */}
          <div className="mt-8">

            <button
              type="button"
              onClick={() => {

                navigate(
                  "/organizer/create-event"
                );

              }}
              className="
                flex
                items-center
                gap-2
                px-7
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                text-lg
                transition
              "
            >

              <Plus size={22} />

              Tạo sự kiện mới

            </button>

          </div>

        </div>

      </main>

    </div>

  );

}