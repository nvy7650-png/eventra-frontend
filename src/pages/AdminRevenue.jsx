import { useEffect, useMemo, useState } from "react";

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

  const fetchRevenue = async () => {

    try {

      const [statsRes, paymentRes] =
        await Promise.all([

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
        paymentData || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchRevenue();

  }, []);

  const filteredPayments =
    useMemo(() => {

      return payments.filter(
        (item) =>

          item.order_id
            .toString()
            .includes(search)

          ||

          item.event_title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

    }, [payments, search]);

  const formatPrice = (value) =>

    Number(value).toLocaleString(
      "vi-VN"
    ) + "đ";

  const formatDate = (date) =>

    date
      ? new Date(date)
          .toLocaleDateString("vi-VN")
      : "--";

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
        Đang tải...
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

        <div className="mb-8">

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-black
            "
          >
            Quản lý doanh thu
          </h1>

          <p className="text-gray-400 mt-2">
            Theo dõi doanh thu hệ thống
          </p>

        </div>

        {/* CARD */}

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

          <p className="text-gray-400">
            Tổng doanh thu
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

        {/* SEARCH */}

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
            placeholder="Tìm theo mã đơn hoặc tên sự kiện..."
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

        {/* TABLE */}

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
                min-w-[900px]
                w-full
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                  "
                >

                  <th className="text-left p-4">
                    Đơn hàng
                  </th>

                  <th className="text-left p-4">
                    Sự kiện
                  </th>

                  <th className="text-left p-4">
                    Phương thức
                  </th>

                  <th className="text-left p-4">
                    Doanh thu
                  </th>

                  <th className="text-left p-4">
                    Ngày thanh toán
                  </th>

                </tr>

              </thead>

              <tbody>
                                {filteredPayments.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="
                        p-10
                        text-center
                        text-gray-400
                      "
                    >
                      Chưa có doanh thu.
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
                          #{item.order_id}
                        </td>

                        <td className="p-4">
                          {item.event_title}
                        </td>

                        <td className="p-4">
                          {item.payment_method}
                        </td>

                        <td
                          className="
                            p-4
                            font-semibold
                            text-green-400
                          "
                        >
                          {formatPrice(item.amount)}
                        </td>

                        <td className="p-4">
                          {formatDate(item.paid_at)}
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

          {filteredPayments.length === 0 ? (

            <div
              className="
                bg-[#0B1120]
                rounded-3xl
                p-6
                text-center
                text-gray-400
              "
            >
              Chưa có doanh thu.
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

                  <div className="flex justify-between">

                    <h3 className="font-bold">
                      Đơn #{item.order_id}
                    </h3>

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

                  <p className="mt-3 text-gray-300">
                    {item.event_title}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">

                    <p>
                      <span className="text-gray-400">
                        Phương thức:
                      </span>{" "}
                      {item.payment_method}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Doanh thu:
                      </span>{" "}
                      <span className="text-green-400 font-semibold">
                        {formatPrice(item.amount)}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Thanh toán:
                      </span>{" "}
                      {formatDate(item.paid_at)}
                    </p>

                  </div>

                </div>

              )

            )

          )}

        </div>

      </main>

    </div>

  );

}