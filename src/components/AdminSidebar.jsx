import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  FolderKanban,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const logout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };

  const menus = [

    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },

    {
      label: "Quản lý sự kiện",
      icon: CalendarDays,
      path: "/admin/events",
    },

    {
      label: "Quản lý tài khoản",
      icon: Users,
      path: "/admin/users",
    },

    {
      label: "Quản lý đơn hàng",
      icon: Receipt,
      path: "/admin/orders",
    },

    {
      label: "Quản lý danh mục",
      icon: FolderKanban,
      path: "/admin/categories",
    },

    {
      label: "Doanh thu",
      icon: Wallet,
      path: "/admin/revenue",
    },

    {
      label: "Cài đặt",
      icon: Settings,
      path: "/admin/settings",
    },

  ];

  return (

    <aside
      className="
        w-64
        bg-[#0B1120]
        border-r
        border-white/10
        flex
        flex-col
        justify-between
        p-5
      "
    >

      <div>

        <div className="mb-10">

          <h1 className="text-3xl font-black text-sky-400">
            HOMIETICKET
          </h1>

          <p className="text-gray-400 text-sm">
            Admin Center
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-3
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-4
            mb-8
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-full
              bg-sky-500
              text-black
              font-bold
              flex
              items-center
              justify-center
            "
          >
            {user?.name?.charAt(0)}
          </div>

          <div>

            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-xs text-gray-400">
              System Admin
            </p>

          </div>

        </div>

        <div className="space-y-2">

          {menus.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.path}
                onClick={() =>
                  navigate(item.path)
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  hover:bg-white/5
                  transition
                "
              >

                <Icon size={20} />

                {item.label}

              </button>

            );

          })}

        </div>

      </div>

      <button
        onClick={logout}
        className="
          w-full
          py-3
          rounded-2xl
          bg-red-500
          hover:bg-red-400
          flex
          items-center
          justify-center
          gap-2
          font-semibold
        "
      >

        <LogOut size={18} />

        Đăng xuất

      </button>

    </aside>

  );

}