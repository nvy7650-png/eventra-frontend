import { useNavigate } from "react-router-dom";

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

  const menuItems = [
    "Dashboard",
    "Quản lý tài khoản",
    "Quản lý sự kiện",
    "Quản lý đơn hàng",
    "Quản lý danh mục",
    "Doanh thu & thống kê",
    "Cài đặt hệ thống",
  ];

  return (

    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* SIDEBAR */}
      <aside
        className="
          w-[280px]
          bg-[#040B18]
          border-r
          border-gray-800
          flex
          flex-col
          justify-between
          p-5
        "
      >

        <div>

          {/* LOGO */}
          <div className="mb-10">

            <h1
              className="
                text-4xl
                font-black
                text-red-500
                tracking-wide
              "
            >
              HOMIETICKET
            </h1>

            <p className="text-gray-500 mt-1">
              Admin Center
            </p>

          </div>

          {/* USER */}
          <div
            className="
              bg-[#111827]
              border
              border-gray-800
              rounded-3xl
              p-5
              mb-8
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-red-500
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-black
                "
              >
                A
              </div>

              <div>

                <h3 className="font-bold text-xl">
                  {user?.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  System Admin
                </p>

              </div>

            </div>

          </div>

          {/* MENU */}
          <div className="space-y-3">

            {menuItems.map((item, index) => (

              <button
                key={item}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  rounded-2xl
                  transition
                  font-medium
                  ${
                    index === 0
                      ? `
                        bg-red-500
                        text-white
                      `
                      : `
                        bg-[#111827]
                        hover:bg-[#1F2937]
                        text-white
                      `
                  }
                `}
              >

                {index === 0 && "📊"}
                {index === 1 && "👤"}
                {index === 2 && "🎫"}
                {index === 3 && "🧾"}
                {index === 4 && "📂"}
                {index === 5 && "💰"}
                {index === 6 && "⚙️"}

                {item}

              </button>

            ))}

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full
            py-4
            rounded-2xl
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

        {/* HEADER */}
        <div
          className="
            border-b
            border-gray-800
            px-10
            py-8
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
              "
            >
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2 text-lg">
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="
              px-6
              py-3
              rounded-2xl
              bg-[#111827]
              border
              border-gray-700
              hover:bg-[#1F2937]
              transition
            "
          >
            Trang chủ
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-10">

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-6">

            {/* USERS */}
            <div
              className="
                bg-[#0B1220]
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng Users
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-sky-400
                "
              >
                0
              </h2>

            </div>

            {/* EVENTS */}
            <div
              className="
                bg-[#0B1220]
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng Sự kiện
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-pink-400
                "
              >
                0
              </h2>

            </div>

            {/* ORDERS */}
            <div
              className="
                bg-[#0B1220]
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Tổng Đơn hàng
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-green-400
                "
              >
                0
              </h2>

            </div>

            {/* REVENUE */}
            <div
              className="
                bg-[#0B1220]
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                Doanh thu
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-red-400
                "
              >
                0đ
              </h2>

            </div>

          </div>

          {/* EMPTY STATE */}
          <div
            className="
              mt-10
              bg-[#0B1220]
              border
              border-gray-800
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