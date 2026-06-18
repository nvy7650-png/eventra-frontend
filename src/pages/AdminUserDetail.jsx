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

      </main>

    </div>

  );

}