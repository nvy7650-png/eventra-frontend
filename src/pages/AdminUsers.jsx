import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminUsers() {

  const [users, setUsers] =
    useState([]);
    const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);
const [search, setSearch] =
  useState("");
  const [roleFilter, setRoleFilter] =
  useState("ALL");

const updateStatus = async (
  id,
  action
) => {

  try {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/users/${id}/${action}`,
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
      `${import.meta.env.VITE_API_URL}/api/auth/users`
    )
      .then((res) => res.json())
      .then((data) => {

  console.log("USERS:", data);

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
         <div
  className="
    mt-6
    flex
    flex-col
    md:flex-row
    gap-4
  "
>

  <input
    type="text"
    placeholder="Tìm tên hoặc email..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      flex-1
      bg-[#111827]
      border
      border-white/10
      rounded-2xl
      px-4
      py-3
      outline-none
    "
  />

  <select
    value={roleFilter}
    onChange={(e) =>
      setRoleFilter(e.target.value)
    }
    className="
      bg-[#111827]
      border
      border-white/10
      rounded-2xl
      px-4
      py-3
    "
  >
    <option value="ALL">
      Tất cả role
    </option>

    <option value="USER">
      USER
    </option>

    <option value="ORGANIZER">
      ORGANIZER
    </option>

    <option value="ADMIN">
      ADMIN
    </option>

  </select>

</div>
          <div
  className="
    grid
    grid-cols-1
    sm:grid-cols-3
    gap-4
    mt-6
  "
>

  <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Tổng tài khoản
    </p>
    <h2 className="text-3xl font-black text-sky-400">
      {users.length}
    </h2>
  </div>

  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Đang hoạt động
    </p>
    <h2 className="text-3xl font-black text-green-400">
      {
        users.filter(
          u => u.status === "ACTIVE"
        ).length
      }
    </h2>
  </div>

  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Đã khóa
    </p>
    <h2 className="text-3xl font-black text-red-400">
      {
        users.filter(
          u => u.status === "BLOCKED"
        ).length
      }
    </h2>
  </div>

</div>

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

               {users
  .filter((user) => {

  const matchSearch =

    user.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

    ||

    user.email
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );

  const matchRole =

    roleFilter === "ALL"

    ||

    user.role === roleFilter;

  return (
    matchSearch &&
    matchRole
  );

})
  .map((user) => (

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

  <span
    className={`

      px-3
      py-1

      rounded-full

      text-xs
      font-bold

      ${
        user.role === "ADMIN"
          ? "bg-red-500/20 text-red-400"
          : user.role === "ORGANIZER"
          ? "bg-sky-500/20 text-sky-400"
          : "bg-green-500/20 text-green-400"
      }

    `}
  >

    {user.role}

  </span>

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

  <div className="flex gap-2">

    <button
      onClick={() =>
        navigate(
          `/admin/users/${user.id}`
        )
      }
      className="
        px-4
        py-2
        rounded-xl
        bg-sky-500
        text-black
        text-sm
        font-bold
      "
    >
      Chi tiết
    </button>

    {user.role === "ADMIN" ? (

      <span
        className="
          text-sky-400
          font-bold
          flex
          items-center
        "
      >
        Protected
      </span>

    ) : user.status === "ACTIVE" ? (

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

  </div>

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