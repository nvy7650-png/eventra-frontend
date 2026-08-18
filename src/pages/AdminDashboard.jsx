import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalOrders: 0,
    revenue: 0,
  });

  const [events, setEvents] = useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // GET ADMIN STATS
  // =====================================================

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


  // =====================================================
  // GET ALL EVENTS
  // =====================================================

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/admin/all`
    )
      .then((res) => res.json())
      .then((data) => {

        setEvents(data || []);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);


  // =====================================================
  // EVENT STATUS
  // =====================================================

  const eventStatus = useMemo(() => {

    const pending =
      events.filter(
        (e) => e.status === "PENDING"
      ).length;

    const approved =
      events.filter(
        (e) => e.status === "APPROVED"
      ).length;

    const cancelled =
      events.filter(
        (e) => e.status === "CANCELLED"
      ).length;

    const total =
      pending +
      approved +
      cancelled;

    return {
      pending,
      approved,
      cancelled,
      total,
    };

  }, [events]);


  // =====================================================
  // EVENTS BY MONTH
  // =====================================================

  const monthlyEvents = useMemo(() => {

    const months = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];

    const result =
      months.map((month) => ({
        month,
        value: 0,
      }));


    events.forEach((event) => {

      if (!event.created_at) {
        return;
      }

      const date =
        new Date(event.created_at);

      const month =
        date.getMonth();

      if (
        month >= 0 &&
        month <= 11
      ) {

        result[month].value++;

      }

    });

    return result;

  }, [events]);


  // =====================================================
  // MAX MONTH VALUE
  // =====================================================

  const maxMonthlyEvents =
    Math.max(
      ...monthlyEvents.map(
        (item) => item.value
      ),
      1
    );


  // =====================================================
  // LOADING
  // =====================================================

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


  // =====================================================
  // DONUT CALCULATION
  // =====================================================

  const totalStatus =
    eventStatus.total || 1;

  const pendingPercent =
    (eventStatus.pending /
      totalStatus) *
    100;

  const approvedPercent =
    (eventStatus.approved /
      totalStatus) *
    100;

  const cancelledPercent =
    (eventStatus.cancelled /
      totalStatus) *
    100;


  // =====================================================
  // MAIN
  // =====================================================

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


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main
        className="
          flex-1
          min-w-0
          lg:ml-72
        "
      >


        {/* ================================================= */}
        {/* TOPBAR */}
        {/* ================================================= */}

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
            py-4
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

            <p
              className="
                text-gray-500
                text-sm
                mt-1
              "
            >
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div
          className="
            p-4
            md:p-10
          "
        >


          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

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
                  text-3xl
                  md:text-5xl
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
                  text-3xl
                  md:text-5xl
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
                  text-3xl
                  md:text-5xl
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

                {Number(
                  stats.revenue || 0
                ).toLocaleString("vi-VN")}

                đ

              </h2>

            </div>

          </div>


          {/* ================================================= */}
          {/* EVENT STATUS */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-6
              mt-8
            "
          >


            {/* ================================================= */}
            {/* DONUT CHART */}
            {/* ================================================= */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
                md:p-8
              "
            >

              <div className="mb-6">

                <h2
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                  "
                >
                  Trạng thái sự kiện
                </h2>

                <p
                  className="
                    text-gray-500
                    text-sm
                    mt-1
                  "
                >
                  Tổng quan tình trạng phê duyệt
                </p>

              </div>


              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  items-center
                  justify-center
                  gap-8
                "
              >


                {/* DONUT */}

                <div
                  className="
                    relative
                    w-52
                    h-52
                    flex-shrink-0
                  "
                >

                  <svg
                    viewBox="0 0 100 100"
                    className="
                      w-full
                      h-full
                      -rotate-90
                    "
                  >

                    {/* BACKGROUND */}

                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="12"
                    />


                    {/* APPROVED */}

                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="12"
                      strokeDasharray={`${approvedPercent * 2.387} 238.7`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />


                    {/* PENDING */}

                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="12"
                      strokeDasharray={`${pendingPercent * 2.387} 238.7`}
                      strokeDashoffset={`-${approvedPercent * 2.387}`}
                      strokeLinecap="round"
                    />


                    {/* CANCELLED */}

                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray={`${cancelledPercent * 2.387} 238.7`}
                      strokeDashoffset={`-${(approvedPercent + pendingPercent) * 2.387}`}
                      strokeLinecap="round"
                    />

                  </svg>


                  {/* CENTER */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <span
                      className="
                        text-4xl
                        font-black
                      "
                    >
                      {eventStatus.total}
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Sự kiện
                    </span>

                  </div>

                </div>


                {/* LEGEND */}

                <div
                  className="
                    w-full
                    max-w-xs
                    space-y-5
                  "
                >

                  {/* APPROVED */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
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
                          w-3
                          h-3
                          rounded-full
                          bg-green-500
                        "
                      />

                      <span className="text-gray-300">
                        Đã duyệt
                      </span>

                    </div>

                    <span
                      className="
                        font-bold
                        text-green-400
                      "
                    >
                      {eventStatus.approved}
                    </span>

                  </div>


                  {/* PENDING */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
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
                          w-3
                          h-3
                          rounded-full
                          bg-yellow-400
                        "
                      />

                      <span className="text-gray-300">
                        Chờ duyệt
                      </span>

                    </div>

                    <span
                      className="
                        font-bold
                        text-yellow-400
                      "
                    >
                      {eventStatus.pending}
                    </span>

                  </div>


                  {/* CANCELLED */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
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
                          w-3
                          h-3
                          rounded-full
                          bg-red-500
                        "
                      />

                      <span className="text-gray-300">
                        Đã hủy
                      </span>

                    </div>

                    <span
                      className="
                        font-bold
                        text-red-400
                      "
                    >
                      {eventStatus.cancelled}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* EVENT MONTHLY BAR CHART */}
            {/* ================================================= */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
                md:p-8
              "
            >

              <div className="mb-6">

                <h2
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                  "
                >
                  Sự kiện theo tháng
                </h2>

                <p
                  className="
                    text-gray-500
                    text-sm
                    mt-1
                  "
                >
                  Số lượng sự kiện được tạo
                </p>

              </div>


              <div
                className="
                  h-64
                  flex
                  items-end
                  gap-2
                  md:gap-4
                  border-b
                  border-white/10
                  pb-2
                "
              >

                {monthlyEvents.map(
                  (item) => {

                    const height =
                      item.value === 0
                        ? 4
                        :
                        Math.max(
                          8,
                          (item.value /
                            maxMonthlyEvents) *
                            100
                        );

                    return (

                      <div
                        key={item.month}
                        className="
                          flex-1
                          h-full
                          flex
                          flex-col
                          justify-end
                          items-center
                          gap-2
                        "
                      >

                        {/* VALUE */}

                        {item.value > 0 && (

                          <span
                            className="
                              text-xs
                              text-gray-400
                              font-bold
                            "
                          >
                            {item.value}
                          </span>

                        )}


                        {/* BAR */}

                        <div
                          className="
                            w-full
                            max-w-10
                            bg-gradient-to-t
                            from-sky-600
                            to-cyan-400
                            rounded-t-xl
                            transition-all
                            hover:from-sky-400
                            hover:to-cyan-300
                          "
                          style={{
                            height:
                              `${height}%`,
                          }}
                        />


                        {/* MONTH */}

                        <span
                          className="
                            text-[10px]
                            md:text-xs
                            text-gray-500
                          "
                        >
                          {item.month}

                        </span>

                      </div>

                    );

                  }
                )}

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* KPI CHART */}
          {/* ================================================= */}

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
              md:p-8
              mt-6
            "
          >

            <div className="mb-7">

              <h2
                className="
                  text-xl
                  md:text-2xl
                  font-bold
                "
              >
                Tổng quan hệ thống
              </h2>

              <p
                className="
                  text-gray-500
                  text-sm
                  mt-1
                "
              >
                Thống kê các chỉ số chính
              </p>

            </div>


            <div className="space-y-6">


              {/* USERS */}

              <DashboardBar
                label="Người dùng"
                value={Number(
                  stats.totalUsers || 0
                )}
                max={Math.max(
                  Number(stats.totalUsers || 0),
                  Number(stats.totalEvents || 0),
                  Number(stats.totalOrders || 0),
                  1
                )}
                color="bg-sky-400"
                textColor="text-sky-400"
              />


              {/* EVENTS */}

              <DashboardBar
                label="Sự kiện"
                value={Number(
                  stats.totalEvents || 0
                )}
                max={Math.max(
                  Number(stats.totalUsers || 0),
                  Number(stats.totalEvents || 0),
                  Number(stats.totalOrders || 0),
                  1
                )}
                color="bg-pink-400"
                textColor="text-pink-400"
              />


              {/* ORDERS */}

              <DashboardBar
                label="Đơn hàng"
                value={Number(
                  stats.totalOrders || 0
                )}
                max={Math.max(
                  Number(stats.totalUsers || 0),
                  Number(stats.totalEvents || 0),
                  Number(stats.totalOrders || 0),
                  1
                )}
                color="bg-green-400"
                textColor="text-green-400"
              />


              {/* REVENUE */}

              <DashboardBar
                label="Doanh thu"
                value={Number(
                  stats.revenue || 0
                )}
                max={Math.max(
                  Number(stats.revenue || 0),
                  1
                )}
                color="bg-orange-400"
                textColor="text-orange-400"
                money
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* EVENT MANAGEMENT */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-6
              mt-6
            "
          >


            {/* PENDING */}

            <div
              className="
                bg-yellow-500/5
                border
                border-yellow-500/20
                rounded-3xl
                p-6
              "
            >

              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                Chờ duyệt
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  text-yellow-400
                  mt-2
                "
              >
                {eventStatus.pending}
              </h2>

            </div>


            {/* APPROVED */}

            <div
              className="
                bg-green-500/5
                border
                border-green-500/20
                rounded-3xl
                p-6
              "
            >

              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                Đã duyệt
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  text-green-400
                  mt-2
                "
              >
                {eventStatus.approved}
              </h2>

            </div>


            {/* CANCELLED */}

            <div
              className="
                bg-red-500/5
                border
                border-red-500/20
                rounded-3xl
                p-6
              "
            >

              <p
                className="
                  text-gray-400
                  text-sm
                "
              >
                Đã hủy
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  text-red-400
                  mt-2
                "
              >
                {eventStatus.cancelled}
              </h2>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}


// =========================================================
// DASHBOARD BAR COMPONENT
// =========================================================

function DashboardBar({
  label,
  value,
  max,
  color,
  textColor,
  money = false,
}) {

  const percent =
    max > 0
      ? Math.min(
          100,
          (value / max) * 100
        )
      : 0;


  return (

    <div>

      <div
        className="
          flex
          items-center
          justify-between
          mb-2
        "
      >

        <span
          className="
            text-gray-400
            text-sm
          "
        >
          {label}
        </span>

        <span
          className={`
            font-bold
            ${textColor}
          `}
        >

          {money
            ? Number(value).toLocaleString(
                "vi-VN"
              ) + "đ"
            : Number(value).toLocaleString(
                "vi-VN"
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
          className={`
            h-full
            ${color}
            rounded-full
            transition-all
            duration-700
          `}
          style={{
            width:
              `${percent}%`,
          }}
        />

      </div>

    </div>

  );

}