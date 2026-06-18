import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminUsers() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

const updateStatus = async (
  id,
  action
) => {

  try {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${id}/${action}`,
      {
        method: "PUT",
      }
    );

    setUsers((prev) =>
      prev.map((user) => {

        if (user.id !== id)
          return user;

        return {
          ...user,
          status:
            action === "block"
              ? "BLOCKED"
              : "ACTIVE",
        };

      })
    );

  } catch (err) {

    console.log(err);

  }

};

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users`
    )
      .then((res) => res.json())
      .then((data) => {

        setUsers(data || []);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, []);

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
          md:p-10
        "
      >

        <div className="mb-8">

          <h1
            className="
              text-3xl
              font-black
            "
          >
            Quản lý tài khoản
          </h1>

          <p className="text-gray-400 mt-2">
            Danh sách tài khoản hệ thống
          </p>

        </div>

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
              overflow-x-auto
            "
          >

            <table className="w-full">

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                  "
                >

                  <th className="text-left p-4">
                    Tên
                  </th>

                  <th className="text-left p-4">
                    Email
                  </th>

                  <th className="text-left p-4">
                    Role
                  </th>

                  <th className="text-left p-4">
                    Trạng thái
                  </th>
                  <th className="text-left p-4">
                     Hành động
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-white/5
                    "
                  >

                    <td className="p-4">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      {user.role}
                    </td>

                    <td className="p-4">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-bold

                          ${
                            user.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        `}
                      >
                        {user.status}
                      </span>

                    </td>
                    <td className="p-4">

  {user.status === "ACTIVE" ? (

    <button
      onClick={() =>
        updateStatus(
          user.id,
          "block"
        )
      }
      className="
        px-4
        py-2
        rounded-xl
        bg-red-500
        text-white
        text-sm
        font-bold
      "
    >
      Khóa
    </button>

  ) : (

    <button
      onClick={() =>
        updateStatus(
          user.id,
          "unblock"
        )
      }
      className="
        px-4
        py-2
        rounded-xl
        bg-green-500
        text-white
        text-sm
        font-bold
      "
    >
      Mở khóa
    </button>

  )}

</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>

  );

}