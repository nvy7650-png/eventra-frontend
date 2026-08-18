import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CalendarDays,
  Ticket,
  Wallet,
  CheckCircle,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import OrganizerSidebar
  from "../components/OrganizerSidebar";


export default function OrganizerDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState({

    totalEvents: 0,
    totalTickets: 0,
    revenue: 0,
    checkedIn: 0,

    eventRevenue: [],
    eventTickets: [],

  });

  const [loading, setLoading] =
    useState(true);


  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {

    if (
      !user ||
      user.role !== "ORGANIZER"
    ) {

      navigate("/login");

    }

  }, []);


  // =========================
  // GET DASHBOARD DATA
  // =========================

  useEffect(() => {

    if (!user?.id) {

      setLoading(false);

      return;

    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}/stats`
    )

      .then((res) => res.json())

      .then((data) => {

        console.log(
          "ORGANIZER DASHBOARD:",
          data
        );

        setStats({

          totalEvents:
            data.totalEvents || 0,

          totalTickets:
            data.totalTickets || 0,

          revenue:
            data.revenue || 0,

          checkedIn:
            data.checkedIn || 0,

          eventRevenue:
            data.eventRevenue || [],

          eventTickets:
            data.eventTickets || [],

        });

      })

      .catch((err) => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };


  // =========================
  // FORMAT
  // =========================

  const formatPrice = (value) => {

    return Number(value || 0)
      .toLocaleString("vi-VN") + "đ";

  };


  // =========================
  // CHECK-IN %
  // =========================

  const checkInPercent =
    stats.totalTickets > 0
      ? Math.round(
          (
            stats.checkedIn /
            stats.totalTickets
          ) * 100
        )
      : 0;


  // =========================
  // MAX REVENUE
  // =========================

  const maxRevenue =
    Math.max(
      ...stats.eventRevenue.map(
        (item) =>
          Number(item.revenue || 0)
      ),
      1
    );


  // =========================
  // MAX TICKETS
  // =========================

  const maxTickets =
    Math.max(
      ...stats.eventTickets.map(
        (item) =>
          Number(item.tickets || 0)
      ),
      1
    );


  // =========================
  // LOADING
  // =========================

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
      "
    >

      <OrganizerSidebar />


      {/* =========================
          MAIN
      ========================= */}

      <main
        className="
          flex-1
          min-h-screen
          min-w-0
          lg:ml-72
        "
      >


        {/* =========================
            TOPBAR
        ========================= */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            px-4
            sm:px-6
            lg:px-10
            py-5
            lg:py-6
            border-b
            border-white/10
            bg-[#081120]
          "
        >

          <div>

            <h1
              className="
                text-2xl
                lg:text-3xl
                font-black
              "
            >
              Organizer Dashboard
            </h1>

            <p
              className="
                mt-1
                text-sm
                lg:text-base
                text-gray-400
              "
            >
              Tổng quan hoạt động sự kiện
              và doanh thu của bạn
            </p>

          </div>


          <button
            type="button"
            onClick={() => navigate("/")}
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


        {/* =========================
            CONTENT
        ========================= */}

        <div
          className="
            p-4
            sm:p-6
            lg:p-10
          "
        >


          {/* =========================
              STATS CARDS
          ========================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-5
            "
          >


            {/* EVENTS */}

            <div
              className="
                bg-gradient-to-br
                from-sky-500/10
                to-sky-900/20
                border
                border-sky-500/20
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p className="text-gray-400">
                  Tổng sự kiện
                </p>

                <CalendarDays
                  className="text-sky-400"
                  size={24}
                />

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                  text-sky-400
                  mt-5
                "
              >
                {stats.totalEvents}
              </h2>

            </div>


            {/* TICKETS */}

            <div
              className="
                bg-gradient-to-br
                from-green-500/10
                to-green-900/20
                border
                border-green-500/20
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p className="text-gray-400">
                  Vé đã bán
                </p>

                <Ticket
                  className="text-green-400"
                  size={24}
                />

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                  text-green-400
                  mt-5
                "
              >
                {stats.totalTickets}
              </h2>

            </div>


            {/* REVENUE */}

            <div
              className="
                bg-gradient-to-br
                from-pink-500/10
                to-pink-900/20
                border
                border-pink-500/20
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p className="text-gray-400">
                  Doanh thu
                </p>

                <Wallet
                  className="text-pink-400"
                  size={24}
                />

              </div>

              <h2
                className="
                  text-3xl
                  font-black
                  text-pink-400
                  mt-5
                  break-all
                "
              >
                {formatPrice(
                  stats.revenue
                )}
              </h2>

            </div>


            {/* CHECK IN */}

            <div
              className="
                bg-gradient-to-br
                from-orange-500/10
                to-orange-900/20
                border
                border-orange-500/20
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p className="text-gray-400">
                  Đã check-in
                </p>

                <CheckCircle
                  className="text-orange-400"
                  size={24}
                />

              </div>

              <h2
                className="
                  text-4xl
                  font-black
                  text-orange-400
                  mt-5
                "
              >
                {stats.checkedIn}
              </h2>

              <p className="text-gray-500 mt-2">
                {checkInPercent}% tổng vé
              </p>

            </div>

          </div>


          {/* =========================
              CHARTS
          ========================= */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
              mt-8
            "
          >


            {/* =====================
                REVENUE CHART
            ===================== */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-8
                "
              >

                <div>

                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    Doanh thu theo sự kiện
                  </h2>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >
                    Top 5 sự kiện có doanh thu cao nhất
                  </p>

                </div>

                <TrendingUp
                  className="text-pink-400"
                  size={25}
                />

              </div>


              {stats.eventRevenue.length === 0 ? (

                <div
                  className="
                    h-72
                    flex
                    items-center
                    justify-center
                    text-gray-500
                  "
                >
                  Chưa có dữ liệu
                </div>

              ) : (

                <div className="space-y-6">

                  {stats.eventRevenue.map(
                    (item) => {

                      const width =
                        Math.max(
                          (
                            Number(
                              item.revenue
                            ) /
                            maxRevenue
                          ) * 100,
                          3
                        );

                      return (

                        <div
                          key={item.id}
                        >

                          <div
                            className="
                              flex
                              justify-between
                              gap-4
                              mb-2
                            "
                          >

                            <span
                              className="
                                text-sm
                                font-medium
                                truncate
                              "
                            >
                              {item.title}
                            </span>

                            <span
                              className="
                                text-sm
                                font-bold
                                text-pink-400
                                whitespace-nowrap
                              "
                            >
                              {formatPrice(
                                item.revenue
                              )}
                            </span>

                          </div>

                          <div
                            className="
                              w-full
                              h-3
                              bg-white/5
                              rounded-full
                              overflow-hidden
                            "
                          >

                            <div
                              className="
                                h-full
                                bg-gradient-to-r
                                from-pink-500
                                to-fuchsia-400
                                rounded-full
                                transition-all
                              "
                              style={{
                                width:
                                  `${width}%`,
                              }}
                            />

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </div>


            {/* =====================
                TICKETS CHART
            ===================== */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-8
                "
              >

                <div>

                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    Vé bán theo sự kiện
                  </h2>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >
                    So sánh số lượng vé đã bán
                  </p>

                </div>

                <Ticket
                  className="text-green-400"
                  size={25}
                />

              </div>


              {stats.eventTickets.length === 0 ? (

                <div
                  className="
                    h-72
                    flex
                    items-center
                    justify-center
                    text-gray-500
                  "
                >
                  Chưa có dữ liệu
                </div>

              ) : (

                <div className="space-y-6">

                  {stats.eventTickets.map(
                    (item) => {

                      const width =
                        Math.max(
                          (
                            Number(
                              item.tickets
                            ) /
                            maxTickets
                          ) * 100,
                          3
                        );

                      return (

                        <div
                          key={item.id}
                        >

                          <div
                            className="
                              flex
                              justify-between
                              gap-4
                              mb-2
                            "
                          >

                            <span
                              className="
                                text-sm
                                font-medium
                                truncate
                              "
                            >
                              {item.title}
                            </span>

                            <span
                              className="
                                text-sm
                                font-bold
                                text-green-400
                              "
                            >
                              {item.tickets} vé
                            </span>

                          </div>

                          <div
                            className="
                              w-full
                              h-3
                              bg-white/5
                              rounded-full
                              overflow-hidden
                            "
                          >

                            <div
                              className="
                                h-full
                                bg-gradient-to-r
                                from-green-500
                                to-emerald-400
                                rounded-full
                                transition-all
                              "
                              style={{
                                width:
                                  `${width}%`,
                              }}
                            />

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </div>

          </div>


          {/* =========================
              CHECK-IN OVERVIEW
          ========================= */}

          <div
            className="
              mt-6
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-5
              "
            >

              <div>

                <h2 className="text-xl font-bold">
                  Tình trạng check-in
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tỷ lệ khách đã sử dụng vé
                </p>

              </div>

              <div
                className="
                  text-3xl
                  font-black
                  text-orange-400
                "
              >
                {checkInPercent}%
              </div>

            </div>


            <div
              className="
                w-full
                h-5
                bg-white/5
                rounded-full
                overflow-hidden
              "
            >

              <div
                className="
                  h-full
                  bg-gradient-to-r
                  from-orange-500
                  to-yellow-400
                  rounded-full
                  transition-all
                "
                style={{
                  width:
                    `${checkInPercent}%`,
                }}
              />

            </div>


            <div
              className="
                flex
                justify-between
                mt-3
                text-sm
                text-gray-500
              "
            >

              <span>
                {stats.checkedIn} đã check-in
              </span>

              <span>
                {Math.max(
                  stats.totalTickets -
                  stats.checkedIn,
                  0
                )} chưa check-in
              </span>

            </div>

          </div>


          {/* =========================
              CREATE EVENT
          ========================= */}

          <div className="mt-8">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/organizer/create-event"
                )
              }
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