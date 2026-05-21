import { useNavigate } from "react-router-dom";

export default function OrganizerDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };

  return (

    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* SIDEBAR */}
      <aside
        className="
          w-72
          bg-black
          border-r
          border-gray-800
          min-h-screen
          p-6
        "
      >

        {/* LOGO */}
        <div
          className="cursor-pointer mb-10"
        >

          <h1 className="text-3xl font-bold text-sky-400">
            HOMIETICKET
          </h1>

          <p className="text-sm text-gray-500">
            Organizer Center
          </p>

        </div>

        {/* USER */}
        <div
          className="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-4
            mb-8
          "
        >

          <p className="text-lg font-bold text-white">
            {user?.name}
          </p>

        </div>

        {/* MENU */}
        <div className="space-y-3">

          <button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-sky-500
              text-black
              font-semibold
            "
          >
            Dashboard
          </button>

          <button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-gray-900
              hover:bg-gray-800
              transition
            "
          >
            Sự kiện của tôi
          </button>

          <button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-gray-900
              hover:bg-gray-800
              transition
            "
          >
            Quản lý vé
          </button>

          <button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-gray-900
              hover:bg-gray-800
              transition
            "
          >
            Doanh thu
          </button>

          <button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-gray-900
              hover:bg-gray-800
              transition
            "
          >
            Cài đặt
          </button>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            mt-10
            w-full
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-400
            text-white
            font-bold
            transition
          "
        >
          Đăng xuất
        </button>

      </aside>

      {/* MAIN */}
      <main className="flex-1">

        {/* TOPBAR */}
        <div
          className="
            border-b
            border-gray-800
            bg-black
            px-10
            py-6
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1 className="text-3xl font-bold text-sky-400">
              Organizer Dashboard
            </h1>

            <p className="text-gray-400 mt-1">
              Quản lý sự kiện và vé
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="
              px-5
              py-3
              rounded-xl
              bg-gray-900
              hover:bg-gray-800
              border
              border-gray-700
              transition
            "
          >
            Về trang chủ
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-10">

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6">

            <div
              className="
                bg-gray-900
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng sự kiện
              </p>

              <h2 className="text-5xl font-bold text-sky-400">
                0
              </h2>

            </div>

            <div
              className="
                bg-gray-900
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Vé đã bán
              </p>

              <h2 className="text-5xl font-bold text-green-400">
                0
              </h2>

            </div>

            <div
              className="
                bg-gray-900
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Doanh thu
              </p>

              <h2 className="text-5xl font-bold text-pink-400">
                0đ
              </h2>

            </div>

          </div>

          {/* ACTION */}
          <div className="mt-10">

            <button
              className="
                px-8
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                text-lg
                transition
              "
            >
              + Tạo sự kiện mới
            </button>

          </div>

        </div>

      </main>

    </div>

  );

}