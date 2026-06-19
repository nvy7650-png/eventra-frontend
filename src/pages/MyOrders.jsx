import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab,
    setActiveTab] =
    useState("ALL");

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        setOrders(data);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, []);

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <div
        className="
          max-w-6xl
          mx-auto
          px-4
          md:px-6
          py-8
          md:py-12
        "
      >

        {/* HEADER */}

        <div className="mb-8">

          <h1
            className="
              text-3xl
              md:text-4xl
              font-black
            "
          >
            Đơn hàng của tôi
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            Theo dõi lịch sử mua vé
          </p>

        </div>

        {/* TABS */}

        <div
          className="
            flex
            overflow-x-auto
            gap-3
            pb-2
            mb-8
          "
        >

          {[
            {
              key: "ALL",
              label: "Tất cả",
            },
            {
              key: "PAID",
              label: "Đã thanh toán",
            },
            {
              key: "PENDING",
              label: "Đang xử lý",
            },
            {
              key: "CANCELLED",
              label: "Đã hủy",
            },
          ].map((tab) => (

            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key
                )
              }
              className={`
                px-6
                py-3
                rounded-2xl
                min-w-[160px]
                font-semibold

                ${
                  activeTab === tab.key
                    ? "bg-sky-500 text-black font-bold"
                    : "bg-white/5 text-gray-300"
                }
              `}
            >
              {tab.label}
            </button>

          ))}

        </div>

        {/* LOADING */}

        {loading && (

          <div
            className="
              text-center
              text-gray-400
            "
          >
            Đang tải...
          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          orders.length === 0 && (

          <div
            className="
              bg-[#0B1220]
              border
              border-white/10
              rounded-3xl
              p-12
              text-center
            "
          >

            <h3
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              Chưa có đơn hàng nào
            </h3>

            <p className="text-gray-400">
              Các đơn mua vé sẽ xuất hiện tại đây
            </p>

          </div>

        )}

        {/* LIST */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
          "
        >

          {orders

            .filter((order) => {

              if (
                activeTab === "ALL"
              ) {
                return true;
              }

              return (
  order.status ===
  activeTab
);

            })

            .map((order) => (

              <div
                key={order.id}
                className="
                  bg-[#0B1220]
                  border
                  border-white/10
                  rounded-3xl
                  overflow-hidden
                  hover:border-sky-500
                  transition
                "
              >


                {/* CONTENT */}
                <div
  className="
    p-6
    border-b
    border-white/10
  "
>

  <div
    className="
      flex
      items-center
      justify-between
      gap-4
    "
  >

    <div>

      <p
        className="
          text-gray-500
          text-sm
        "
      >
        Đơn hàng #{order.id}
      </p>

      <h3
        className="
          text-xl
          font-bold
          mt-1
        "
      >
        {order.event_title}
      </h3>

    </div>

  </div>

</div>

                <div className="p-6">

                  <h3
                    className="
                      text-xl
                      font-bold
                      mb-4
                      line-clamp-2
                    "
                  >
                    {
                      order.event_title
                    }
                  </h3>

                  <div
                    className="
                      space-y-3
                      text-sm
                    "
                  >

                    <div>

                      <span className="text-gray-500">
                        Mã đơn:
                      </span>

                      <span className="ml-2">
                        #{order.id}
                      </span>

                    </div>

                    <div>

                      <span className="text-gray-500">
                        Ngày đặt:
                      </span>

                      <span className="ml-2">

                        {new Date(
                          order.created_at
                        ).toLocaleString(
                          "vi-VN"
                        )}

                      </span>

                    </div>

                    <div>

                      <span className="text-gray-500">
                        Tổng tiền:
                      </span>

                      <span
                        className="
                          ml-2
                          text-sky-400
                          font-bold
                        "
                      >

                        {Number(
                          order.total_price
                        ).toLocaleString(
                          "vi-VN"
                        )} đ

                      </span>

                    </div>

                  </div>

                  <div className="mt-5">

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          order.status === "PAID"
                            ? "bg-green-500/20 text-green-400"

                            : order.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"

                            : "bg-red-500/20 text-red-400"
                        }
                      `}
                    >

                      {
                        order.status === "PAID"
                          ? "Đã thanh toán"

                          : order.status === "PENDING"
                          ? "Đang xử lý"

                          : "Đã hủy"
                      }

                    </span>

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>

  );

}