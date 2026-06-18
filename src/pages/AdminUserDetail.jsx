import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminUserDetail() {


const [activeTab, setActiveTab] =
  useState("");
  
  const { id } = useParams();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

    useEffect(() => {

  if (!user) return;

  if (user.role === "USER") {

    setActiveTab(
      "ORDERS"
    );

  } else {

    setActiveTab(
      "EVENTS"
    );

  }

}, [user]);

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/users/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
          console.log("USER DETAIL:", data);


        setUser(data);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  if (loading) {

    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Đang tải...
      </div>
    );

  }

  if (!user) {

    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Không tìm thấy user
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#050816] text-white flex">

      <AdminSidebar />

     <main
  className="
    flex-1
    lg:ml-72
    p-4
    md:p-10
  "
>

  <h1
    className="
      text-3xl
      font-black
      mb-8
    "
  >
    Chi tiết tài khoản
  </h1>

  {/* PROFILE */}
  <div
    className="
      bg-[#0B1120]
      border
      border-white/10
      rounded-3xl
      p-6
      mb-8
    "
  >

    <div className="flex items-center gap-4">

      <div
        className="
          w-20
          h-20
          rounded-full
          bg-sky-500
          flex
          items-center
          justify-center
          text-3xl
          font-black
          text-black
        "
      >
        {user.name?.charAt(0)}
      </div>

      <div>

        <h2 className="text-2xl font-bold">
          {user.name}
        </h2>

        <p className="text-gray-400">
          {user.email}
        </p>

      </div>

    </div>

  </div>

  {/* USER STATS */}

{user.role === "USER" && (

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-6
  "
>

  <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-6">
    <p className="text-gray-400">
      Tổng đơn hàng
    </p>

    <h2 className="text-4xl font-black text-sky-400 mt-2">
      {user.total_orders}
    </h2>
  </div>

  <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6">
    <p className="text-gray-400">
      Tổng vé
    </p>

    <h2 className="text-4xl font-black text-green-400 mt-2">
      {user.total_tickets}
    </h2>
  </div>

  <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6">
    <p className="text-gray-400">
      Tổng chi tiêu
    </p>

    <h2 className="text-3xl font-black text-orange-400 mt-2">
      {Number(
        user.total_spent || 0
      ).toLocaleString("vi-VN")}đ
    </h2>
  </div>

</div>

)}

{user.role === "ORGANIZER" && (

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-6
  "
>

  <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-6">

    <p className="text-gray-400">
      Tổng sự kiện
    </p>

    <h2 className="text-4xl font-black text-sky-400 mt-2">
      {user.total_events}
    </h2>

  </div>

  <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6">

    <p className="text-gray-400">
      Đã duyệt
    </p>

    <h2 className="text-4xl font-black text-green-400 mt-2">
      {user.approved_events}
    </h2>

  </div>

  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">

    <p className="text-gray-400">
      Chờ duyệt
    </p>

    <h2 className="text-4xl font-black text-yellow-400 mt-2">
      {user.pending_events}
    </h2>

  </div>

</div>

)}

  {/* INFO */}
  <div
    className="
      mt-8
      bg-[#0B1120]
      border
      border-white/10
      rounded-3xl
      p-6
    "
  >

    <h2
      className="
        text-xl
        font-bold
        mb-6
      "
    >
      Thông tin tài khoản
    </h2>

    <div className="space-y-4">

      <p>
        <span className="text-gray-400">
          ID:
        </span>{" "}
        {user.id}
      </p>

      <p>
        <span className="text-gray-400">
          Số điện thoại:
        </span>{" "}
        {user.phone || "Chưa cập nhật"}
      </p>

      <p>
        <span className="text-gray-400">
          Role:
        </span>{" "}
        {user.role}
      </p>

      <p>
        <span className="text-gray-400">
          Trạng thái:
        </span>{" "}
        {user.status}
      </p>

      <p>
        <span className="text-gray-400">
          Ngày tạo:
        </span>{" "}
        {new Date(
          user.created_at
        ).toLocaleDateString("vi-VN")}
      </p>

    </div>

  </div>

  <div
  className="
    mt-8
    flex
    gap-3
  "
>

  {user.role === "USER" ? (

<>

  <button
    onClick={() =>
      setActiveTab("ORDERS")
    }
    className={`

      px-5
      py-3
      rounded-2xl
      font-bold

      ${
        activeTab === "ORDERS"
          ? "bg-sky-500 text-black"
          : "bg-[#0B1120] border border-white/10"
      }

    `}
  >
    Lịch sử đơn hàng
    {" "}
    ({user.orders?.length || 0})
  </button>

  <button
    onClick={() =>
      setActiveTab("TICKETS")
    }
    className={`

      px-5
      py-3
      rounded-2xl
      font-bold

      ${
        activeTab === "TICKETS"
          ? "bg-sky-500 text-black"
          : "bg-[#0B1120] border border-white/10"
      }

    `}
  >
    Vé đã mua
    {" "}
    ({user.tickets?.length || 0})
  </button>

</>

) : (

<>

  <button
    onClick={() =>
      setActiveTab("EVENTS")
    }
    className={`

      px-5
      py-3
      rounded-2xl
      font-bold

      ${
        activeTab === "EVENTS"
          ? "bg-sky-500 text-black"
          : "bg-[#0B1120] border border-white/10"
      }

    `}
  >
    Sự kiện đã tạo
    {" "}
    ({user.events?.length || 0})
  </button>

</>

)}

</div>

  
  {activeTab === "ORDERS" && (

<>

<div
  className="
    mt-8
    bg-[#0B1120]
    border
    border-white/10
    rounded-3xl
    p-6
  "
>

  <h2
    className="
      text-xl
      font-bold
      mb-6
    "
  >
    Lịch sử đơn hàng
  </h2>

  {user.orders?.length > 0 ? (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-white/10">

            <th className="text-left p-3">
              Mã đơn
            </th>

            <th className="text-left p-3">
              Sự kiện
            </th>

            <th className="text-left p-3">
              Tổng tiền
            </th>

            <th className="text-left p-3">
              Trạng thái
            </th>

            <th className="text-left p-3">
              Ngày mua
            </th>

          </tr>

        </thead>

        <tbody>

          {user.orders.map((order) => (

            <tr
              key={order.id}
              className="
                border-b
                border-white/5
              "
            >

              <td className="p-3">
                #{order.id}
              </td>

              <td className="p-3">
                {order.event_title}
              </td>

              <td className="p-3">
                {Number(
                  order.total_price
                ).toLocaleString("vi-VN")}đ
              </td>

              <td className="p-3">

                <span
                  className={`

                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold

                    ${
                      order.status === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }

                  `}
                >

                  {order.status === "PAID"
                    ? "Thành công"
                    : order.status === "PENDING"
                    ? "Chờ thanh toán"
                    : order.status === "EXPIRED"
                    ? "Hết hạn"
                    : "Đã hủy"}

                </span>

              </td>

              <td className="p-3">

                {new Date(
                  order.created_at
                ).toLocaleDateString("vi-VN")}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  ) : (

    <p className="text-gray-400">
      Chưa có đơn hàng nào
    </p>

  )}

</div>
</>

)}
{activeTab === "TICKETS" && (

<>

<div
  className="
    mt-8
    bg-[#0B1120]
    border
    border-white/10
    rounded-3xl
    p-6
  "
>

  <h2
    className="
      text-xl
      font-bold
      mb-6
    "
  >
    Danh sách vé đã mua
  </h2>

  {user.tickets?.length > 0 ? (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-white/10">

            <th className="text-left p-3">
              Mã vé
            </th>

            <th className="text-left p-3">
              Sự kiện
            </th>

            <th className="text-left p-3">
              Ghế
            </th>

            <th className="text-left p-3">
              Trạng thái
            </th>

          </tr>

        </thead>

        <tbody>

          {user.tickets.map((ticket) => (

            <tr
              key={ticket.id}
              className="
                border-b
                border-white/5
              "
            >

              <td className="p-3">
                {ticket.ticket_code}
              </td>

              <td className="p-3">
                {ticket.event_title}
              </td>

              <td className="p-3">
                {ticket.seat_code || "-"}
              </td>

              <td className="p-3">

                <span
                  className={`

                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold

                    ${
                      ticket.status === "VALID"
                        ? "bg-green-500/20 text-green-400"
                        : ticket.status === "USED"
                        ? "bg-gray-500/20 text-gray-300"
                        : "bg-red-500/20 text-red-400"
                    }

                  `}
                >

                  {ticket.status === "VALID"
                    ? "Còn hiệu lực"
                    : ticket.status === "USED"
                    ? "Đã sử dụng"
                    : "Đã hủy"}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  ) : (

    <p className="text-gray-400">
      Chưa có vé nào
    </p>

  )}

</div>

</>

)}

</main>

    </div>

  );

}