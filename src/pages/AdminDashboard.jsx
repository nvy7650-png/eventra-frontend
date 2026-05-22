import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  FolderKanban,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };

  return (

    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* SIDEBAR */}
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

          {/* LOGO */}
          <div className="mb-10">

            <h1 className="text-3xl font-black text-sky-400 tracking-wide">
              HOMIETICKET
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Admin Center
            </p>

          </div>

          {/* USER */}
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
                flex
                items-center
                justify-center
                font-bold
                text-lg
                text-black
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

          {/* MENU */}
          <div className="space-y-2">

            {/* DASHBOARD */}
            <button
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                bg-sky-500
                text-black
                font-semibold
              "
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            {/* ACCOUNT */}
            <button
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
              <Users size={20} />
              Quản lý tài khoản
            </button>

            {/* EVENT */}
            <button
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
              <CalendarDays size={20} />
              Quản lý sự kiện
            </button>

            {/* ORDER */}
            <button
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
              <Receipt size={20} />
              Quản lý đơn hàng
            </button>

            {/* CATEGORY */}
            <button
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
              <FolderKanban size={20} />
              Quản lý danh mục
            </button>

            {/* REVENUE */}
            <button
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
              <Wallet size={20} />
              Doanh thu & thống kê
            </button>

            {/* SETTINGS */}
            <button
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
              <Settings size={20} />
              Cài đặt hệ thống
            </button>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-2xl
            bg-red-500
            hover:bg-red-400
            font-semibold
            transition
            mt-6
          "
        >
          <LogOut size={18} />
          Đăng xuất
        </button>

      </aside>

      {/* MAIN */}
      <main className="flex-1">

        {/* TOPBAR */}
        <div
          className="
            flex
            items-center
            justify-between
            px-10
            py-6
            border-b
            border-white/10
            bg-[#081120]
          "
        >

          <div>

            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-1">
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white/5
              hover:bg-white/10
              border
              border-white/10
              transition
            "
          >
            Trang chủ
            <ChevronRight size={18} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-10">

          {/* STATS */}
          <div className="grid lg:grid-cols-4 gap-6">

            {/* USERS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng Users
              </p>

              <h2 className="text-5xl font-black text-sky-400">
                0
              </h2>

            </div>

            {/* EVENTS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng sự kiện
              </p>

              <h2 className="text-5xl font-black text-pink-400">
                0
              </h2>

            </div>

            {/* ORDERS */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng đơn hàng
              </p>

              <h2 className="text-5xl font-black text-green-400">
                0
              </h2>

            </div>

            {/* REVENUE */}
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-7
              "
            >

              <p className="text-gray-400 mb-3">
                Doanh thu
              </p>

              <h2 className="text-5xl font-black text-orange-400">
                0đ
              </h2>

            </div>

          </div>

          {/* EMPTY STATE */}
          <div
            className="
              mt-10
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-16
              text-center
            "
          >

            <h2
              className="
                text-4xl
                font-black
                mb-4
              "
            >
              HOMIETICKET ADMIN
            </h2>

            <p className="text-gray-400 text-lg">
              Quản lý toàn bộ hệ thống sự kiện,
              organizer, user và doanh thu.
            </p>

          </div>

        </div>

      </main>

    </div>

  );

}