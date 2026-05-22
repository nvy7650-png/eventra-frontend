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
          w-[300px]
          bg-black
          border-r
          border-gray-800
          flex
          flex-col
          justify-between
          p-6
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

          {/* ADMIN INFO */}
          <div
            className="
              bg-[#0B1220]
              border
              border-gray-800
              rounded-3xl
              p-5
              mb-8
            "
          >

            <p className="text-sm text-gray-400">
              Administrator
            </p>

            <h2
              className="
                text-xl
                font-bold
                mt-1
              "
            >
              {user?.name}
            </h2>

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                px-3
                py-1
                rounded-full
                bg-red-500/20
                text-red-400
                text-sm
                font-medium
              "
            >
              ● System Admin
            </div>

          </div>

          {/* MENU */}
          <div className="space-y-3">

            {menuItems.map((item, index) => (

              <button
                key={item}
                className={`
                  w-full
                  text-left
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
                        shadow-lg
                        shadow-red-500/20
                      `
                      : `
                        bg-[#0B1220]
                        border
                        border-gray-800
                        hover:bg-[#111827]
                      `
                  }
                `}
              >
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
      <main className="flex-1 p-10">

        {/* TOPBAR */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-10
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
                leading-tight
              "
            >
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Quản trị toàn bộ hệ thống HOMIETICKET
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="
              px-6
              py-3
              rounded-2xl
              bg-[#0B1220]
              border
              border-gray-700
              hover:bg-[#111827]
              transition
            "
          >
            Về trang chủ
          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {/* USERS */}
          <div
            className="
              bg-[#0B1220]
              border
              border-gray-800
              rounded-3xl
              p-7
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
              p-7
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
              p-7
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
              p-7
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

        {/* RECENT SECTION */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* NEW USERS */}
          <div
            className="
              bg-[#0B1220]
              border
              border-gray-800
              rounded-3xl
              p-7
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-6
              "
            >

              <h3 className="text-2xl font-bold">
                User mới
              </h3>

              <button className="text-red-400 text-sm">
                Xem tất cả
              </button>

            </div>

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-center
                    justify-between
                    bg-[#111827]
                    rounded-2xl
                    px-4
                    py-4
                  "
                >

                  <div>

                    <p className="font-semibold">
                      User {item}
                    </p>

                    <p className="text-sm text-gray-400">
                      user{item}@gmail.com
                    </p>

                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-500/20
                      text-green-400
                      text-sm
                    "
                  >
                    ACTIVE
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* NEW EVENTS */}
          <div
            className="
              bg-[#0B1220]
              border
              border-gray-800
              rounded-3xl
              p-7
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-6
              "
            >

              <h3 className="text-2xl font-bold">
                Event mới
              </h3>

              <button className="text-red-400 text-sm">
                Xem tất cả
              </button>

            </div>

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="
                    flex
                    items-center
                    justify-between
                    bg-[#111827]
                    rounded-2xl
                    px-4
                    py-4
                  "
                >

                  <div>

                    <p className="font-semibold">
                      Event {item}
                    </p>

                    <p className="text-sm text-gray-400">
                      Organizer {item}
                    </p>

                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-yellow-500/20
                      text-yellow-400
                      text-sm
                    "
                  >
                    PENDING
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}