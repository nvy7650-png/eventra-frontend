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
        "REVENUE ERROR:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // =============================
  // LOAD DATA
  // =============================

  useEffect(() => {

    fetchRevenue();

  }, []);

  // =============================
  // FORMAT PRICE
  // =============================

  const formatPrice = (value) => {

    return (
      Number(value || 0)
        .toLocaleString("vi-VN") +
      "đ"
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
  // FILTER PAYMENTS
  // =============================

  const filteredPayments =
    useMemo(() => {

      const keyword =
        search
          .toLowerCase()
          .trim();

      if (!keyword) {

        return payments;

      }

      return payments.filter(
        (item) => {

          const orderId =
            String(
              item.order_id || ""
            ).toLowerCase();

          const eventTitle =
            String(
              item.event_title || ""
            ).toLowerCase();

          const organizerName =
            String(
              item.organizer_name || ""
            ).toLowerCase();

          const organizerEmail =
            String(
              item.organizer_email || ""
            ).toLowerCase();

          return (

            orderId.includes(keyword) ||

            eventTitle.includes(keyword) ||

            organizerName.includes(keyword) ||

            organizerEmail.includes(keyword)

          );

        }
      );

    }, [
      payments,
      search,
    ]);

  // =============================
  // GROUP REVENUE BY ORGANIZER
  // =============================

  const organizerRevenue =
    useMemo(() => {

      const groups = {};

      filteredPayments.forEach(
        (item) => {

          const organizerId =
            item.organizer_id ||
            "unknown";

          if (
            !groups[organizerId]
          ) {

            groups[organizerId] = {

              organizer_id:
                organizerId,

              organizer_name:
                item.organizer_name ||
                "Không xác định",

              organizer_email:
                item.organizer_email ||
                "--",

              revenue: 0,

              orders: new Set(),

              events: new Set(),

            };

          }

          groups[
            organizerId
          ].revenue +=
            Number(
              item.amount || 0
            );

          groups[
            organizerId
          ].orders.add(
            item.order_id
          );

          if (
            item.event_id
          ) {

            groups[
              organizerId
            ].events.add(
              item.event_id
            );

          }

        }
      );

      return Object.values(
        groups
      )
        .map(
          (item) => ({

            ...item,

            total_orders:
              item.orders.size,

            total_events:
              item.events.size,

          })
        )
        .sort(
          (a, b) =>
            b.revenue -
            a.revenue
        );

    }, [
      filteredPayments,
    ]);

  // =============================
  // SUMMARY
  // =============================

  const totalOrganizer =
    organizerRevenue.length;

  const totalTransactions =
    filteredPayments.length;

  const totalRevenue =
    filteredPayments.reduce(
      (sum, item) =>
        sum +
        Number(
          item.amount || 0
        ),
      0
    );

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

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
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


        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5
            mb-8
          "
        >

          {/* TOTAL REVENUE */}

          <div
            className="
              bg-gradient-to-br
              from-green-500/10
              to-emerald-500/10
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
              Tổng doanh thu
            </p>

            <h2
              className="
                text-3xl
                sm:text-4xl
                font-black
                text-green-400
                mt-2
              "
            >
              {formatPrice(
                totalRevenue
              )}
            </h2>

          </div>


          {/* ORGANIZERS */}

          <div
            className="
              bg-gradient-to-br
              from-sky-500/10
              to-cyan-500/10
              border
              border-sky-500/20
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
              Organizer có doanh thu
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-sky-400
                mt-2
              "
            >
              {totalOrganizer}
            </h2>

          </div>


          {/* TRANSACTIONS */}

          <div
            className="
              bg-gradient-to-br
              from-purple-500/10
              to-pink-500/10
              border
              border-purple-500/20
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
              Tổng giao dịch
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-purple-400
                mt-2
              "
            >
              {totalTransactions}
            </h2>

          </div>

        </div>


        {/* =========================
            SEARCH
        ========================= */}

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

          <label
            className="
              block
              text-sm
              text-gray-400
              mb-2
            "
          >
            Tìm kiếm doanh thu
          </label>

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


        {/* =========================
            ORGANIZER REVENUE
        ========================= */}

        <div className="mb-10">

          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-black
                "
              >
                Doanh thu theo Organizer
              </h2>

              <p
                className="
                  text-gray-500
                  text-sm
                  mt-1
                "
              >
                Xếp theo doanh thu cao nhất
              </p>

            </div>

          </div>


          {/* DESKTOP TABLE */}

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

            <div className="overflow-x-auto">

              <table
                className="
                  min-w-[1000px]
                  w-full
                "
              >

                <thead>

                  <tr
                    className="
                      border-b
                      border-white/10
                      text-gray-400
                      text-sm
                    "
                  >

                    <th
                      className="
                        text-left
                        p-5
                      "
                    >
                      Organizer
                    </th>

                    <th
                      className="
                        text-center
                        p-5
                      "
                    >
                      Sự kiện
                    </th>

                    <th
                      className="
                        text-center
                        p-5
                      "
                    >
                      Đơn hàng
                    </th>

                    <th
                      className="
                        text-right
                        p-5
                      "
                    >
                      Doanh thu
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {organizerRevenue.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={4}
                        className="
                          p-10
                          text-center
                          text-gray-400
                        "
                      >
                        Chưa có dữ liệu
                        doanh thu.
                      </td>

                    </tr>

                  ) : (

                    organizerRevenue.map(
                      (organizer) => (

                        <tr
                          key={
                            organizer.organizer_id
                          }
                          className="
                            border-b
                            border-white/5
                            hover:bg-white/5
                            transition
                          "
                        >

                          {/* ORGANIZER */}

                          <td className="p-5">

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
                                  bg-sky-500/10
                                  border
                                  border-sky-500/20
                                  flex
                                  items-center
                                  justify-center
                                  text-sky-400
                                  font-black
                                "
                              >
                                {(
                                  organizer.organizer_name ||
                                  "O"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p
                                  className="
                                    font-bold
                                  "
                                >
                                  {
                                    organizer.organizer_name
                                  }
                                </p>

                                <p
                                  className="
                                    text-sm
                                    text-gray-500
                                  "
                                >
                                  {
                                    organizer.organizer_email
                                  }
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* EVENTS */}

                          <td
                            className="
                              p-5
                              text-center
                            "
                          >

                            <span
                              className="
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                bg-purple-500/10
                                text-purple-400
                                text-sm
                                font-semibold
                              "
                            >
                              {
                                organizer.total_events
                              }
                            </span>

                          </td>


                          {/* ORDERS */}

                          <td
                            className="
                              p-5
                              text-center
                            "
                          >

                            <span
                              className="
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                bg-sky-500/10
                                text-sky-400
                                text-sm
                                font-semibold
                              "
                            >
                              {
                                organizer.total_orders
                              }
                            </span>

                          </td>


                          {/* REVENUE */}

                          <td
                            className="
                              p-5
                              text-right
                              font-black
                              text-green-400
                              text-lg
                            "
                          >
                            {formatPrice(
                              organizer.revenue
                            )}
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

            {organizerRevenue.length ===
            0 ? (

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
                Chưa có dữ liệu
                doanh thu.
              </div>

            ) : (

              organizerRevenue.map(
                (organizer) => (

                  <div
                    key={
                      organizer.organizer_id
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
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-12
                          h-12
                          rounded-2xl
                          bg-sky-500/10
                          border
                          border-sky-500/20
                          flex
                          items-center
                          justify-center
                          text-sky-400
                          font-black
                        "
                      >
                        {(
                          organizer.organizer_name ||
                          "O"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <h3
                          className="
                            font-bold
                          "
                        >
                          {
                            organizer.organizer_name
                          }
                        </h3>

                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {
                            organizer.organizer_email
                          }
                        </p>

                      </div>

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
                          p-4
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
                            font-black
                            text-purple-400
                            mt-1
                          "
                        >
                          {
                            organizer.total_events
                          }
                        </p>

                      </div>


                      <div
                        className="
                          bg-white/5
                          rounded-2xl
                          p-4
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Đơn hàng
                        </p>

                        <p
                          className="
                            text-xl
                            font-black
                            text-sky-400
                            mt-1
                          "
                        >
                          {
                            organizer.total_orders
                          }
                        </p>

                      </div>

                    </div>


                    <div
                      className="
                        mt-4
                        pt-4
                        border-t
                        border-white/10
                      "
                    >

                      <p
                        className="
                          text-sm
                          text-gray-500
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
                        {formatPrice(
                          organizer.revenue
                        )}
                      </p>

                    </div>

                  </div>

                )

              )

            )}

          </div>

        </div>


        {/* =========================
            TRANSACTION DETAIL
        ========================= */}

        <div>

          <h2
            className="
              text-xl
              sm:text-2xl
              font-black
              mb-4
            "
          >
            Chi tiết giao dịch
          </h2>


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

            <div className="overflow-x-auto">

              <table
                className="
                  min-w-[1200px]
                  w-full
                "
              >

                <thead>

                  <tr
                    className="
                      border-b
                      border-white/10
                      text-gray-400
                      text-sm
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
                      Organizer
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

                  {filteredPayments.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="
                          p-10
                          text-center
                          text-gray-400
                        "
                      >
                        Chưa có giao dịch.
                      </td>

                    </tr>

                  ) : (

                    filteredPayments.map(
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

                          <td className="p-4">

                            <span
                              className="
                                font-semibold
                              "
                            >
                              #{item.order_id}
                            </span>

                          </td>


                          <td className="p-4">

                            <div>

                              <p
                                className="
                                  font-semibold
                                "
                              >
                                {
                                  item.organizer_name ||
                                  "Không xác định"
                                }
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                {
                                  item.organizer_email ||
                                  "--"
                                }
                              </p>

                            </div>

                          </td>


                          <td className="p-4">

                            {
                              item.event_title ||
                              "--"
                            }

                          </td>


                          <td className="p-4">

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                bg-sky-500/10
                                text-sky-400
                              "
                            >
                              {
                                item.payment_method ||
                                "--"
                              }
                            </span>

                          </td>


                          <td
                            className="
                              p-4
                              text-right
                              font-semibold
                              text-green-400
                            "
                          >
                            {formatPrice(
                              item.amount
                            )}
                          </td>


                          <td className="p-4">

                            {formatDate(
                              item.paid_at
                            )}

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

            {filteredPayments.length ===
            0 ? (

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
                Chưa có giao dịch.
              </div>

            ) : (

              filteredPayments.map(
                (item) => (

                  <div
                    key={item.id}
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
                        gap-3
                      "
                    >

                      <div>

                        <h3
                          className="
                            font-bold
                          "
                        >
                          Đơn #{item.order_id}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-gray-300
                          "
                        >
                          {
                            item.event_title ||
                            "--"
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
                        mt-4
                        space-y-3
                        text-sm
                      "
                    >

                      <p>

                        <span
                          className="
                            text-gray-500
                          "
                        >
                          Organizer:
                        </span>{" "}

                        <span
                          className="
                            font-semibold
                          "
                        >
                          {
                            item.organizer_name ||
                            "Không xác định"
                          }
                        </span>

                      </p>


                      <p>

                        <span
                          className="
                            text-gray-500
                          "
                        >
                          Email:
                        </span>{" "}

                        {
                          item.organizer_email ||
                          "--"
                        }

                      </p>


                      <p>

                        <span
                          className="
                            text-gray-500
                          "
                        >
                          Phương thức:
                        </span>{" "}

                        {
                          item.payment_method ||
                          "--"
                        }

                      </p>


                      <p>

                        <span
                          className="
                            text-gray-500
                          "
                        >
                          Doanh thu:
                        </span>{" "}

                        <span
                          className="
                            text-green-400
                            font-bold
                          "
                        >
                          {formatPrice(
                            item.amount
                          )}
                        </span>

                      </p>


                      <p>

                        <span
                          className="
                            text-gray-500
                          "
                        >
                          Thanh toán:
                        </span>{" "}

                        {formatDate(
                          item.paid_at
                        )}

                      </p>

                    </div>

                  </div>

                )

              )

            )}

          </div>

        </div>

      </main>

    </div>

  );

}