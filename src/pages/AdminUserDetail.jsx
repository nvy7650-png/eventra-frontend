import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminUserDetail() {

  const { id } = useParams();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

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

  {/* STATS */}
  <div
    className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
    "
  >

    <div
      className="
        bg-sky-500/10
        border
        border-sky-500/20
        rounded-3xl
        p-6
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
        {user.total_orders}
      </h2>
    </div>

    <div
      className="
        bg-green-500/10
        border
        border-green-500/20
        rounded-3xl
        p-6
      "
    >
      <p className="text-gray-400">
        Tổng vé
      </p>

      <h2
        className="
          text-4xl
          font-black
          text-green-400
          mt-2
        "
      >
        {user.total_tickets}
      </h2>
    </div>

    <div
      className="
        bg-orange-500/10
        border
        border-orange-500/20
        rounded-3xl
        p-6
      "
    >
      <p className="text-gray-400">
        Tổng chi tiêu
      </p>

      <h2
        className="
          text-3xl
          font-black
          text-orange-400
          mt-2
        "
      >
        {Number(
          user.total_spent || 0
        ).toLocaleString("vi-VN")}đ
      </h2>
    </div>

  </div>

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

</main>

    </div>

  );

}