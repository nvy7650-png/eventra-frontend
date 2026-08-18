import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminRevenue() {

  const [payments, setPayments] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedOrganizer,
    setSelectedOrganizer,
  ] = useState(null);


  // =============================
  // FETCH REVENUE
  // =============================

  const fetchRevenue = async () => {

    try {

      const [
        statsRes,
        paymentRes,
      ] = await Promise.all([

        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`
        ),

        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/revenue`
        ),

      ]);


      const statsData =
        await statsRes.json();

      const paymentData =
        await paymentRes.json();


      setStats(statsData);

      setPayments(
        Array.isArray(paymentData)
          ? paymentData
          : []
      );


    } catch (err) {

      console.log(
        "FETCH REVENUE ERROR:",
        err
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchRevenue();

  }, []);


  // =============================
  // FORMAT PRICE
  // =============================

  const formatPrice = (value) => {

    return (
      Number(value || 0)
        .toLocaleString("vi-VN")
      + "đ"
    );

  };


  // =============================
  // FORMAT DATE
  // =============================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    return new Date(date)
      .toLocaleDateString(
        "vi-VN"
      );

  };


  // =============================
  // GROUP BY ORGANIZER
  // =============================

  const organizers = useMemo(() => {

    const map = {};


    payments.forEach((item) => {

      const organizerId =
        item.organizer_id;


      if (!organizerId) {
        return;
      }


      if (!map[organizerId]) {

        map[organizerId] = {

          id: organizerId,

          name:
            item.organizer_name
            || "Chưa xác định",

          email:
            item.organizer_email
            || "--",

          revenue: 0,

          transactions: 0,

          events: {},

          payments: [],

        };

      }


      const organizer =
        map[organizerId];


      // Tổng doanh thu

      organizer.revenue +=
        Number(
          item.amount || 0
        );


      // Số giao dịch

      organizer.transactions += 1;


      // Lưu payment

      organizer.payments.push(
        item
      );


      // =============================
      // GROUP EVENTS
      // =============================

      const eventId =
        item.event_id
        || `unknown-${item.id}`;


      if (
        !organizer.events[eventId]
      ) {

        organizer.events[eventId] = {

          id: eventId,

          title:
            item.event_title
            || "Chưa xác định",

          revenue: 0,

          transactions: 0,

        };

      }


      organizer.events[eventId]
        .revenue +=
        Number(
          item.amount || 0
        );


      organizer.events[eventId]
        .transactions += 1;

    });


    return Object.values(map)
      .map((organizer) => ({

        ...organizer,

        events:
          Object.values(
            organizer.events
          ),

      }))
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );

  }, [payments]);


  // =============================
  // SEARCH ORGANIZER
  // =============================

  const filteredOrganizers =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();


      if (!keyword) {

        return organizers;

      }


      return organizers.filter(
        (organizer) => {

          const organizerMatch =

            organizer.name
              .toLowerCase()
              .includes(keyword)

            ||

            organizer.email
              .toLowerCase()
              .includes(keyword);


          const eventMatch =
            organizer.events.some(
              (event) =>
                event.title
                  .toLowerCase()
                  .includes(keyword)
            );


          const paymentMatch =
            organizer.payments.some(
              (payment) =>
                String(
                  payment.order_id
                )
                  .includes(keyword)
            );


          return (
            organizerMatch
            ||
            eventMatch
            ||
            paymentMatch
          );

        }
      );

    }, [
      organizers,
      search,
    ]);


  // =============================
  // SELECTED ORGANIZER PAYMENTS
  // =============================

  const selectedPayments =
    useMemo(() => {

      if (!selectedOrganizer) {

        return [];

      }


      return selectedOrganizer
        .payments
        .slice()
        .sort(
          (a, b) =>
            new Date(
              b.paid_at
            )
            -
            new Date(
              a.paid_at
            )
        );

    }, [
      selectedOrganizer,
    ]);


  // =============================
  // LOADING
  // =============================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          text-white
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-green-400
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
            Đang tải doanh thu...
          </p>

        </div>

      </div>

    );

  }


  // =============================
  // UI
  // =============================

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        flex
      "
    >

      <AdminSidebar />


      <main
        className="
          flex-1
          min-w-0
          lg:ml-72
          p-4
          sm:p-6
          lg:p-10
        "
      >


        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div
          className="
            mb-8
          "
        >

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-black
            "
          >
            Quản lý doanh thu
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            Theo dõi doanh thu theo
            từng Organizer và sự kiện
          </p>

        </div>


        {/* ========================= */}
        {/* TOTAL REVENUE */}
        {/* ========================= */}

        <div
          className="
            w-full
            bg-gradient-to-r
            from-green-500/10
            to-emerald-500/10
            border
            border-green-500/20
            rounded-3xl
            p-5
            sm:p-6
            mb-8
            shadow-lg
          "
        >

          <p
            className="
              text-gray-400
            "
          >
            Tổng doanh thu hệ thống
          </p>


          <h2
            className="
              text-4xl
              font-black
              text-green-400
              mt-2
            "
          >

            {formatPrice(
              stats?.revenue || 0
            )}

          </h2>

        </div>


        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
            mb-8
          "
        >


          {/* ORGANIZERS */}

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-5
            "
          >

            <p
              className="
                text-gray-400
                text-sm
              "
            >
              Tổng Organizer
            </p>

            <h2
              className="
                text-3xl
                font-black
                text-sky-400
                mt-2
              "
            >
              {organizers.length}
            </h2>

          </div>


          {/* TRANSACTIONS */}

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-5
            "
          >

            <p
              className="
                text-gray-400
                text-sm
              "
            >
              Giao dịch thành công
            </p>

            <h2
              className="
                text-3xl
                font-black
                text-green-400
                mt-2
              "
            >
              {payments.length}
            </h2>

          </div>


          {/* EVENTS */}

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-5
            "
          >

            <p
              className="
                text-gray-400
                text-sm
              "
            >
              Sự kiện có doanh thu
            </p>

            <h2
              className="
                text-3xl
                font-black
                text-pink-400
                mt-2
              "
            >

              {
                new Set(
                  payments
                    .map(
                      item =>
                        item.event_id
                    )
                    .filter(Boolean)
                ).size
              }

            </h2>

          </div>


        </div>


        {/* ========================= */}
        {/* SEARCH */}
        {/* ========================= */}

        <div
          className="
            bg-[#0B1120]
            border
            border-white/10
            rounded-3xl
            p-5
            sm:p-6
            mb-8
          "
        >

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="
              Tìm Organizer, email,
              sự kiện hoặc mã đơn...
            "
            className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              transition
              focus:border-green-500
              focus:ring-2
              focus:ring-green-500/30
            "
          />

        </div>


        {/* ========================= */}
        {/* ORGANIZER LIST */}
        {/* ========================= */}

        {!selectedOrganizer && (

          <>

            {/* DESKTOP */}

            <div
              className="
                hidden
                lg:block
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                overflow-hidden
              "
            >

              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    min-w-[900px]
                    w-full
                  "
                >

                  <thead>

                    <tr
                      className="
                        border-b
                        border-white/10
                        text-gray-400
                      "
                    >

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Organizer
                      </th>

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Email
                      </th>

                      <th
                        className="
                          text-center
                          p-4
                        "
                      >
                        Sự kiện
                      </th>

                      <th
                        className="
                          text-center
                          p-4
                        "
                      >
                        Giao dịch
                      </th>

                      <th
                        className="
                          text-right
                          p-4
                        "
                      >
                        Doanh thu
                      </th>

                      <th
                        className="
                          text-center
                          p-4
                        "
                      >
                        Chi tiết
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredOrganizers.length === 0 ? (

                      <tr>

                        <td
                          colSpan={6}
                          className="
                            p-10
                            text-center
                            text-gray-400
                          "
                        >
                          Không tìm thấy
                          Organizer.
                        </td>

                      </tr>

                    ) : (

                      filteredOrganizers.map(
                        (organizer) => (

                          <tr
                            key={
                              organizer.id
                            }
                            className="
                              border-b
                              border-white/5
                              hover:bg-white/5
                              transition
                            "
                          >

                            <td
                              className="
                                p-4
                              "
                            >

                              <div
                                className="
                                  font-bold
                                "
                              >
                                {
                                  organizer.name
                                }
                              </div>

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                  mt-1
                                "
                              >
                                ID: {
                                  organizer.id
                                }
                              </div>

                            </td>


                            <td
                              className="
                                p-4
                                text-gray-300
                              "
                            >
                              {
                                organizer.email
                              }
                            </td>


                            <td
                              className="
                                p-4
                                text-center
                                font-semibold
                              "
                            >
                              {
                                organizer.events
                                  .length
                              }
                            </td>


                            <td
                              className="
                                p-4
                                text-center
                                font-semibold
                              "
                            >
                              {
                                organizer.transactions
                              }
                            </td>


                            <td
                              className="
                                p-4
                                text-right
                                font-bold
                                text-green-400
                              "
                            >
                              {
                                formatPrice(
                                  organizer.revenue
                                )
                              }
                            </td>


                            <td
                              className="
                                p-4
                                text-center
                              "
                            >

                              <button
                                onClick={() =>
                                  setSelectedOrganizer(
                                    organizer
                                  )
                                }
                                className="
                                  px-4
                                  py-2
                                  rounded-xl
                                  bg-sky-500/10
                                  border
                                  border-sky-500/20
                                  text-sky-400
                                  hover:bg-sky-500
                                  hover:text-black
                                  transition
                                  font-semibold
                                "
                              >
                                Xem
                              </button>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* MOBILE */}

            <div
              className="
                lg:hidden
                space-y-4
              "
            >

              {filteredOrganizers.length === 0 ? (

                <div
                  className="
                    bg-[#0B1120]
                    border
                    border-white/10
                    rounded-3xl
                    p-6
                    text-center
                    text-gray-400
                  "
                >
                  Không tìm thấy
                  Organizer.
                </div>

              ) : (

                filteredOrganizers.map(
                  (organizer) => (

                    <div
                      key={
                        organizer.id
                      }
                      className="
                        bg-[#0B1120]
                        border
                        border-white/10
                        rounded-3xl
                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div>

                          <h3
                            className="
                              font-bold
                              text-lg
                            "
                          >
                            {
                              organizer.name
                            }
                          </h3>

                          <p
                            className="
                              text-sm
                              text-gray-500
                              mt-1
                            "
                          >
                            {
                              organizer.email
                            }
                          </p>

                        </div>


                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            bg-green-500/20
                            text-green-400
                          "
                        >
                          SUCCESS
                        </span>

                      </div>


                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-3
                          mt-5
                        "
                      >

                        <div
                          className="
                            bg-white/5
                            rounded-2xl
                            p-3
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Sự kiện
                          </p>

                          <p
                            className="
                              text-xl
                              font-bold
                              mt-1
                            "
                          >
                            {
                              organizer.events
                                .length
                            }
                          </p>

                        </div>


                        <div
                          className="
                            bg-white/5
                            rounded-2xl
                            p-3
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-gray-500
                            "
                          >
                            Giao dịch
                          </p>

                          <p
                            className="
                              text-xl
                              font-bold
                              mt-1
                            "
                          >
                            {
                              organizer.transactions
                            }
                          </p>

                        </div>

                      </div>


                      <div
                        className="
                          mt-5
                        "
                      >

                        <p
                          className="
                            text-sm
                            text-gray-400
                          "
                        >
                          Tổng doanh thu
                        </p>

                        <p
                          className="
                            text-2xl
                            font-black
                            text-green-400
                            mt-1
                          "
                        >
                          {
                            formatPrice(
                              organizer.revenue
                            )
                          }
                        </p>

                      </div>


                      <button
                        onClick={() =>
                          setSelectedOrganizer(
                            organizer
                          )
                        }
                        className="
                          w-full
                          mt-5
                          py-3
                          rounded-xl
                          bg-sky-500
                          text-black
                          font-bold
                          hover:bg-sky-400
                          transition
                        "
                      >
                        Xem chi tiết
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </>

        )}


        {/* ========================= */}
        {/* ORGANIZER DETAIL */}
        {/* ========================= */}

        {selectedOrganizer && (

          <div>

            {/* BACK */}

            <button
              onClick={() =>
                setSelectedOrganizer(
                  null
                )
              }
              className="
                mb-6
                px-5
                py-3
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:bg-white/10
                transition
              "
            >
              ← Quay lại danh sách Organizer
            </button>


            {/* ORGANIZER HEADER */}

            <div
              className="
                bg-gradient-to-r
                from-sky-500/10
                to-green-500/10
                border
                border-white/10
                rounded-3xl
                p-6
                mb-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-5
                "
              >

                <div>

                  <p
                    className="
                      text-gray-400
                      text-sm
                    "
                  >
                    Organizer
                  </p>

                  <h2
                    className="
                      text-2xl
                      sm:text-3xl
                      font-black
                      mt-1
                    "
                  >
                    {
                      selectedOrganizer.name
                    }
                  </h2>

                  <p
                    className="
                      text-gray-400
                      mt-1
                    "
                  >
                    {
                      selectedOrganizer.email
                    }
                  </p>

                </div>


                <div
                  className="
                    text-left
                    md:text-right
                  "
                >

                  <p
                    className="
                      text-gray-400
                    "
                  >
                    Tổng doanh thu
                  </p>

                  <p
                    className="
                      text-3xl
                      sm:text-4xl
                      font-black
                      text-green-400
                      mt-1
                    "
                  >
                    {
                      formatPrice(
                        selectedOrganizer.revenue
                      )
                    }
                  </p>

                </div>

              </div>

            </div>


            {/* EVENT SUMMARY */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
                mb-6
              "
            >

              <div
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                "
              >

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Số sự kiện
                </p>

                <p
                  className="
                    text-3xl
                    font-black
                    text-sky-400
                    mt-2
                  "
                >
                  {
                    selectedOrganizer
                      .events
                      .length
                  }
                </p>

              </div>


              <div
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                "
              >

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Giao dịch
                </p>

                <p
                  className="
                    text-3xl
                    font-black
                    text-green-400
                    mt-2
                  "
                >
                  {
                    selectedOrganizer
                      .transactions
                  }
                </p>

              </div>


              <div
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                "
              >

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Trung bình / giao dịch
                </p>

                <p
                  className="
                    text-2xl
                    font-black
                    text-orange-400
                    mt-2
                  "
                >

                  {
                    formatPrice(
                      selectedOrganizer
                        .transactions
                        ? selectedOrganizer
                            .revenue
                          /
                          selectedOrganizer
                            .transactions
                        : 0
                    )
                  }

                </p>

              </div>

            </div>


            {/* EVENTS */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-5
                sm:p-6
                mb-6
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  mb-5
                "
              >
                Doanh thu theo sự kiện
              </h3>


              <div
                className="
                  space-y-3
                "
              >

                {selectedOrganizer
                  .events
                  .map((event) => (

                    <div
                      key={event.id}
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        p-4
                        rounded-2xl
                        bg-white/5
                      "
                    >

                      <div>

                        <p
                          className="
                            font-semibold
                          "
                        >
                          {
                            event.title
                          }
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-500
                            mt-1
                          "
                        >
                          {
                            event.transactions
                          } giao dịch
                        </p>

                      </div>


                      <p
                        className="
                          font-bold
                          text-green-400
                        "
                      >
                        {
                          formatPrice(
                            event.revenue
                          )
                        }
                      </p>

                    </div>

                  ))}

              </div>

            </div>


            {/* PAYMENT DETAILS */}

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                overflow-hidden
              "
            >

              <div
                className="
                  p-5
                  sm:p-6
                  border-b
                  border-white/10
                "
              >

                <h3
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Chi tiết giao dịch
                </h3>

              </div>


              {/* DESKTOP */}

              <div
                className="
                  hidden
                  lg:block
                  overflow-x-auto
                "
              >

                <table
                  className="
                    min-w-[900px]
                    w-full
                  "
                >

                  <thead>

                    <tr
                      className="
                        border-b
                        border-white/10
                        text-gray-400
                      "
                    >

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Đơn hàng
                      </th>

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Sự kiện
                      </th>

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Phương thức
                      </th>

                      <th
                        className="
                          text-right
                          p-4
                        "
                      >
                        Doanh thu
                      </th>

                      <th
                        className="
                          text-left
                          p-4
                        "
                      >
                        Ngày thanh toán
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {selectedPayments.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="
                            border-b
                            border-white/5
                            hover:bg-white/5
                            transition
                          "
                        >

                          <td
                            className="
                              p-4
                              font-semibold
                            "
                          >
                            #{item.order_id}
                          </td>


                          <td
                            className="
                              p-4
                            "
                          >
                            {
                              item.event_title
                            }
                          </td>


                          <td
                            className="
                              p-4
                            "
                          >
                            {
                              item.payment_method
                            }
                          </td>


                          <td
                            className="
                              p-4
                              text-right
                              font-semibold
                              text-green-400
                            "
                          >
                            {
                              formatPrice(
                                item.amount
                              )
                            }
                          </td>


                          <td
                            className="
                              p-4
                            "
                          >
                            {
                              formatDate(
                                item.paid_at
                              )
                            }
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* MOBILE */}

              <div
                className="
                  lg:hidden
                  p-4
                  space-y-4
                "
              >

                {selectedPayments.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="
                        bg-white/5
                        rounded-2xl
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          justify-between
                          gap-3
                        "
                      >

                        <p
                          className="
                            font-bold
                          "
                        >
                          Đơn #{item.order_id}
                        </p>

                        <span
                          className="
                            px-2
                            py-1
                            rounded-full
                            text-xs
                            bg-green-500/20
                            text-green-400
                          "
                        >
                          SUCCESS
                        </span>

                      </div>


                      <p
                        className="
                          mt-3
                          text-gray-300
                        "
                      >
                        {
                          item.event_title
                        }
                      </p>


                      <div
                        className="
                          mt-4
                          space-y-2
                          text-sm
                        "
                      >

                        <p>

                          <span
                            className="
                              text-gray-400
                            "
                          >
                            Phương thức:
                          </span>{" "}

                          {
                            item.payment_method
                          }

                        </p>


                        <p>

                          <span
                            className="
                              text-gray-400
                            "
                          >
                            Doanh thu:
                          </span>{" "}

                          <span
                            className="
                              text-green-400
                              font-semibold
                            "
                          >
                            {
                              formatPrice(
                                item.amount
                              )
                            }
                          </span>

                        </p>


                        <p>

                          <span
                            className="
                              text-gray-400
                            "
                          >
                            Thanh toán:
                          </span>{" "}

                          {
                            formatDate(
                              item.paid_at
                            )
                          }

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}