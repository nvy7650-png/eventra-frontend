import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchOrders = () => {

    setLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/orders`
    )
      .then((res) => res.json())
      .then((data) => {

        setOrders(data || []);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const filteredOrders = useMemo(() => {

    return orders.filter((item) => {

      return (

        item.id
          .toString()
          .includes(search)

        ||

        item.event_title
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  }, [orders, search]);

  const formatPrice = (value) => {

    return Number(value).toLocaleString(
      "vi-VN"
    ) + "đ";

  };

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      "vi-VN"
    );

  };

  const renderStatus = (status) => {

    switch (status) {

      case "PAID":

        return (
          <span
            className="
              px-3
              py-1
              rounded-full
              bg-green-500/20
              text-green-400
              text-xs
              font-bold
            "
          >
            Đã thanh toán
          </span>
        );

      case "PENDING":

        return (
          <span
            className="
              px-3
              py-1
              rounded-full
              bg-yellow-500/20
              text-yellow-400
              text-xs
              font-bold
            "
          >
            Chờ thanh toán
          </span>
        );

      default:

        return (
          <span
            className="
              px-3
              py-1
              rounded-full
              bg-gray-500/20
              text-gray-300
              text-xs
              font-bold
            "
          >
            {status}
          </span>
        );

    }

  };

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
            Quản lý đơn hàng
          </h1>

          <p className="text-gray-400 mt-2">

            Theo dõi tất cả đơn hàng trong hệ thống

          </p>

        </div>

        {/* THỐNG KÊ */}

        <div
          className="
            w-full
            bg-gradient-to-r
            from-sky-500/10
            to-cyan-500/10
            border
            border-sky-500/20
            rounded-3xl
            p-5
            sm:p-6
            mb-8
            shadow-lg
          "
        >

          <p className="text-gray-400">

            Tổng đơn hàng

          </p>

          <h2
            className="
              text-4xl
              font-black
              text-sky-400
              mt-2
            "
          >
            {orders.length}
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
              setSearch(e.target.value)
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
              focus:border-sky-500
              focus:ring-2
              focus:ring-sky-500/30
            "
          />

        </div>

        {/* TABLE DESKTOP */}

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
                    ID
                  </th>

                  <th className="text-left p-4">
                    Sự kiện
                  </th>

                  <th className="text-left p-4">
                    Tổng tiền
                  </th>

                  <th className="text-left p-4">
                    Trạng thái
                  </th>

                  <th className="text-left p-4">
                    Ngày tạo
                  </th>

                </tr>

              </thead>

              <tbody>
                                {filteredOrders.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="
                        p-10
                        text-center
                        text-gray-400
                      "
                    >
                      Không có đơn hàng nào.
                    </td>

                  </tr>

                ) : (

                  filteredOrders.map((item) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-white/5
                        hover:bg-white/5
                        transition
                      "
                    >

                      <td className="p-4 font-semibold">
                        #{item.id}
                      </td>

                      <td className="p-4">
                        {item.event_title}
                      </td>

                      <td className="p-4 font-bold text-sky-400">
                        {formatPrice(item.total_price)}
                      </td>

                      <td className="p-4">
                        {renderStatus(item.status)}
                      </td>

                      <td className="p-4">
                        {formatDate(item.created_at)}
                      </td>

                    </tr>

                  ))

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

          {filteredOrders.length === 0 ? (

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-8
                text-center
                text-gray-400
              "
            >
              Không có đơn hàng nào.
            </div>

          ) : (

            filteredOrders.map((item) => (

              <div
                key={item.id}
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                  shadow-lg
                "
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      Đơn hàng #{item.id}
                    </h3>

                    <p
                      className="
                        text-gray-400
                        mt-2
                      "
                    >
                      {item.event_title}
                    </p>

                  </div>

                  {renderStatus(item.status)}

                </div>

                <div
                  className="
                    border-t
                    border-white/10
                    my-4
                  "
                />

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Tổng tiền
                    </span>

                    <span className="font-bold text-sky-400">
                      {formatPrice(item.total_price)}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Ngày tạo
                    </span>

                    <span>
                      {formatDate(item.created_at)}
                    </span>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>

  );

}