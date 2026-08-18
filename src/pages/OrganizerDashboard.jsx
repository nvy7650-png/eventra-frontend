import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  ChevronRight,
  CalendarDays,
  Ticket,
  Wallet,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

import OrganizerSidebar
  from "../components/OrganizerSidebar";


export default function OrganizerDashboard() {

  const navigate = useNavigate();

  // ============================
  // USER
  // ============================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ============================
  // STATE
  // ============================

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ============================
  // CHECK LOGIN
  // ============================

  useEffect(() => {

    if (
      !user ||
      user.role !== "ORGANIZER"
    ) {

      navigate("/login");

    }

  }, []);


  // ============================
  // GET ORGANIZER STATISTICS
  // ============================

  useEffect(() => {

    if (!user?.id) {

      setLoading(false);

      return;

    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}/stats`
    )

      .then((res) => {

        if (!res.ok) {
          throw new Error(
            "Không thể lấy dữ liệu thống kê"
          );
        }

        return res.json();

      })

      .then((data) => {

        setEvents(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch((err) => {

        console.log(err);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  // ============================
  // CALCULATE TOTAL STATISTICS
  // ============================

  const stats = useMemo(() => {

    const totalEvents =
      events.length;

    const totalTickets =
      events.reduce(
        (sum, event) =>
          sum +
          Number(
            event.sold_tickets || 0
          ),
        0
      );

    const revenue =
      events.reduce(
        (sum, event) =>
          sum +
          Number(
            event.revenue || 0
          ),
        0
      );

    const checkedIn =
      events.reduce(
        (sum, event) =>
          sum +
          Number(
            event.checked_in || 0
          ),
        0
      );

    return {

      totalEvents,

      totalTickets,

      revenue,

      checkedIn,

    };

  }, [events]);


  // ============================
  // CHECK-IN RATE
  // ============================

  const checkInRate = useMemo(() => {

    if (
      stats.totalTickets === 0
    ) {

      return 0;

    }

    return Math.round(
      (
        stats.checkedIn /
        stats.totalTickets
      ) * 100
    );

  }, [
    stats.totalTickets,
    stats.checkedIn,
  ]);


  // ============================
  // SORT EVENTS BY REVENUE
  // ============================

  const topRevenueEvents =
    useMemo(() => {

      return [...events]

        .sort(
          (a, b) =>
            Number(b.revenue || 0) -
            Number(a.revenue || 0)
        )

        .slice(0, 5);

    }, [events]);


  // ============================
  // MAX REVENUE
  // ============================

  const maxRevenue = useMemo(() => {

    if (
      topRevenueEvents.length === 0
    ) {

      return 1;

    }

    return Math.max(
      ...topRevenueEvents.map(
        (event) =>
          Number(
            event.revenue || 0
          )
      ),
      1
    );

  }, [topRevenueEvents]);


  // ============================
  // MAX TICKETS
  // ============================

  const maxTickets = useMemo(() => {

    if (
      events.length === 0
    ) {

      return 1;

    }

    return Math.max(
      ...events.map(
        (event) =>
          Number(
            event.sold_tickets || 0
          )
      ),
      1
    );

  }, [events]);


  // ============================
  // FORMAT PRICE
  // ============================

  const formatPrice = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "vi-VN"
    ) + "đ";

  };


  // ============================
  // LOGOUT
  // ============================

  const handleLogout = () => {

    localStorage.removeItem(
      "user"
    );

    navigate("/");

    window.location.reload();

  };


  // ============================
  // LOADING
  // ============================

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

          <p
            className="
              mt-4
              text-gray-400
            "
          >
            Đang tải dashboard...
          </p>

        </div>

      </div>

    );

  }


  // ============================
  // DASHBOARD
  // ============================

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

      <OrganizerSidebar />


      {/* ============================
          MAIN
      ============================ */}

      <main
        className="
          flex-1
          min-h-screen
          min-w-0
          lg:ml-72
        "
      >


        {/* ============================
            TOPBAR
        ============================ */}

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


          {/* HOME */}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              flex
              items-center
              justify-center
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

            <ChevronRight
              size={18}
            />

          </button>

        </div>


        {/* ============================
            CONTENT
        ============================ */}

        <div
          className="
            p-4
            sm:p-6
            lg:p-10
          "
        >


          {/* ============================
              STAT CARDS
          ============================ */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
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
                hover:scale-[1.02]
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p
                  className="
                    text-gray-400
                  "
                >
                  Tổng sự kiện
                </p>

                <CalendarDays
                  size={24}
                  className="
                    text-sky-400
                  "
                />

              </div>

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                  text-sky-400
                  mt-4
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
                hover:scale-[1.02]
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p
                  className="
                    text-gray-400
                  "
                >
                  Vé đã bán
                </p>

                <Ticket
                  size={24}
                  className="
                    text-green-400
                  "
                />

              </div>

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                  text-green-400
                  mt-4
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
                hover:scale-[1.02]
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p
                  className="
                    text-gray-400
                  "
                >
                  Doanh thu
                </p>

                <Wallet
                  size={24}
                  className="
                    text-pink-400
                  "
                />

              </div>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  xl:text-4xl
                  font-black
                  text-pink-400
                  mt-4
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
                hover:scale-[1.02]
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <p
                  className="
                    text-gray-400
                  "
                >
                  Đã check-in
                </p>

                <CheckCircle
                  size={24}
                  className="
                    text-orange-400
                  "
                />

              </div>

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                  text-orange-400
                  mt-4
                "
              >
                {stats.checkedIn}
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                "
              >
                {checkInRate}% tổng vé
              </p>

            </div>

          </div>


          {/* ============================
              CHARTS
          ============================ */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
              mt-8
            "
          >


            {/* REVENUE CHART */}

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
                  mb-6
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
                    Top 5 sự kiện có
                    doanh thu cao nhất
                  </p>

                </div>

                <TrendingUp
                  size={26}
                  className="
                    text-pink-400
                  "
                />

              </div>


              {topRevenueEvents.length === 0 ? (

                <div
                  className="
                    h-64
                    flex
                    items-center
                    justify-center
                    text-gray-500
                  "
                >
                  Chưa có dữ liệu
                </div>

              ) : (

                <div
                  className="
                    space-y-6
                  "
                >

                  {topRevenueEvents.map(
                    (event) => {

                      const value =
                        Number(
                          event.revenue || 0
                        );

                      const percent =
                        (
                          value /
                          maxRevenue
                        ) * 100;

                      return (

                        <div
                          key={event.id}
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
                                text-gray-300
                                truncate
                              "
                              title={
                                event.title
                              }
                            >
                              {event.title}
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
                                value
                              )}
                            </span>

                          </div>

                          <div
                            className="
                              h-3
                              bg-white/5
                              rounded-full
                              overflow-hidden
                            "
                          >

                            <div
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-pink-500
                                to-purple-400
                                transition-all
                                duration-700
                              "
                              style={{
                                width:
                                  `${percent}%`,
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


            {/* TICKET CHART */}

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
                  mb-6
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
                    So sánh số lượng vé
                    đã bán
                  </p>

                </div>

                <Ticket
                  size={26}
                  className="
                    text-green-400
                  "
                />

              </div>


              {events.length === 0 ? (

                <div
                  className="
                    h-64
                    flex
                    items-center
                    justify-center
                    text-gray-500
                  "
                >
                  Chưa có dữ liệu
                </div>

              ) : (

                <div
                  className="
                    space-y-6
                  "
                >

                  {[...events]

                    .sort(
                      (a, b) =>
                        Number(
                          b.sold_tickets || 0
                        ) -
                        Number(
                          a.sold_tickets || 0
                        )
                    )

                    .slice(0, 5)

                    .map((event) => {

                      const value =
                        Number(
                          event.sold_tickets || 0
                        );

                      const percent =
                        (
                          value /
                          maxTickets
                        ) * 100;

                      return (

                        <div
                          key={event.id}
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
                                text-gray-300
                                truncate
                              "
                              title={
                                event.title
                              }
                            >
                              {event.title}
                            </span>

                            <span
                              className="
                                text-sm
                                font-bold
                                text-green-400
                                whitespace-nowrap
                              "
                            >
                              {value} vé
                            </span>

                          </div>

                          <div
                            className="
                              h-3
                              bg-white/5
                              rounded-full
                              overflow-hidden
                            "
                          >

                            <div
                              className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-green-500
                                to-emerald-300
                                transition-all
                                duration-700
                              "
                              style={{
                                width:
                                  `${percent}%`,
                              }}
                            />

                          </div>

                        </div>

                      );

                    })}

                </div>

              )}

            </div>

          </div>


          {/* ============================
              CHECK-IN OVERVIEW
          ============================ */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
              mt-6
            "
          >


            {/* CHECK-IN CARD */}

            <div
              className="
                lg:col-span-1
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
                  gap-3
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-orange-500/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <CheckCircle
                    size={24}
                    className="
                      text-orange-400
                    "
                  />

                </div>

                <div>

                  <h2
                    className="
                      font-bold
                    "
                  >
                    Tỷ lệ check-in
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Tình trạng sử dụng vé
                  </p>

                </div>

              </div>


              <div
                className="
                  mt-8
                  flex
                  items-center
                  justify-center
                "
              >

                <div
                  className="
                    relative
                    w-40
                    h-40
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    background:
                      `conic-gradient(
                        rgb(249 115 22)
                        ${checkInRate}%,
                        rgba(255,255,255,0.06)
                        ${checkInRate}%
                      )`,
                  }}
                >

                  <div
                    className="
                      w-32
                      h-32
                      rounded-full
                      bg-[#0B1120]
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <span
                      className="
                        text-3xl
                        font-black
                        text-orange-400
                      "
                    >
                      {checkInRate}%
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      đã check-in
                    </span>

                  </div>

                </div>

              </div>


              <div
                className="
                  flex
                  justify-between
                  mt-6
                  text-sm
                "
              >

                <span
                  className="
                    text-gray-400
                  "
                >
                  Đã check-in
                </span>

                <span
                  className="
                    font-bold
                    text-orange-400
                  "
                >
                  {stats.checkedIn}
                </span>

              </div>

              <div
                className="
                  flex
                  justify-between
                  mt-2
                  text-sm
                "
              >

                <span
                  className="
                    text-gray-400
                  "
                >
                  Chưa check-in
                </span>

                <span
                  className="
                    font-bold
                    text-gray-300
                  "
                >
                  {Math.max(
                    stats.totalTickets -
                    stats.checkedIn,
                    0
                  )}
                </span>

              </div>

            </div>


            {/* TOP EVENTS */}

            <div
              className="
                lg:col-span-2
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
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    Hiệu quả sự kiện
                  </h2>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >
                    Tổng quan các sự kiện
                    đang quản lý
                  </p>

                </div>

                <Users
                  size={26}
                  className="
                    text-sky-400
                  "
                />

              </div>


              {events.length === 0 ? (

                <div
                  className="
                    py-16
                    text-center
                    text-gray-500
                  "
                >
                  Bạn chưa có sự kiện nào.
                </div>

              ) : (

                <div
                  className="
                    space-y-3
                  "
                >

                  {[...events]

                    .sort(
                      (a, b) =>
                        Number(
                          b.revenue || 0
                        ) -
                        Number(
                          a.revenue || 0
                        )
                    )

                    .slice(0, 5)

                    .map((event, index) => {

                      return (

                        <div
                          key={event.id}
                          className="
                            flex
                            items-center
                            gap-4
                            p-4
                            rounded-2xl
                            bg-white/[0.03]
                            border
                            border-white/5
                            hover:bg-white/[0.06]
                            transition
                          "
                        >

                          <div
                            className="
                              w-9
                              h-9
                              rounded-xl
                              bg-sky-500/10
                              text-sky-400
                              flex
                              items-center
                              justify-center
                              font-black
                            "
                          >
                            {index + 1}
                          </div>


                          <div
                            className="
                              flex-1
                              min-w-0
                            "
                          >

                            <p
                              className="
                                font-semibold
                                truncate
                              "
                              title={
                                event.title
                              }
                            >
                              {event.title}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                              "
                            >
                              {Number(
                                event.sold_tickets || 0
                              )} vé đã bán
                              {" • "}
                              {Number(
                                event.checked_in || 0
                              )} check-in
                            </p>

                          </div>


                          <div
                            className="
                              text-right
                              shrink-0
                            "
                          >

                            <p
                              className="
                                font-bold
                                text-pink-400
                              "
                            >
                              {formatPrice(
                                event.revenue
                              )}
                            </p>

                          </div>

                        </div>

                      );

                    })}

                </div>

              )}

            </div>

          </div>


          {/* ============================
              CREATE EVENT
          ============================ */}

          <div
            className="
              mt-8
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              bg-gradient-to-r
              from-sky-500/10
              to-cyan-500/5
              border
              border-sky-500/20
              rounded-3xl
              p-6
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Tạo sự kiện mới
              </h2>

              <p
                className="
                  text-gray-400
                  text-sm
                  mt-1
                "
              >
                Bắt đầu tạo và quản lý
                sự kiện của bạn.
              </p>

            </div>


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
                justify-center
                gap-2
                px-7
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
                whitespace-nowrap
              "
            >

              <Plus
                size={22}
              />

              Tạo sự kiện mới

            </button>

          </div>


        </div>

      </main>

    </div>

  );

}