import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

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

    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* SIDEBAR */}
      <aside
        className="
          w-[280px]
          bg-black
          border-r
          border-gray-800
          p-6
          flex
          flex-col
          justify-between
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
              "
            >
              HOMIETICKET
            </h1>

            <p className="text-gray-500">
              Admin Center
            </p>

          </div>

          {/* USER */}
          <div
            className="
              bg-[#0B1220]
              border
              border-gray-800
              rounded-2xl
              p-4
              mb-8
            "
          >

            <p className="text-gray-400 text-sm">
              Administrator
            </p>

            <h3 className="font-bold text-lg">
              {user?.name}
            </h3>

          </div>

          {/* MENU */}
          <div className="space-y-3">

            {[
              "Dashboard",
              "Quản lý tài khoản",
              "Quản lý sự kiện",
              "Quản lý đơn hàng",
              "Doanh thu & thống kê",
              "Quản lý danh mục",
            ].map((item) => (

              <button
                key={item}
                className="
                  w-full
                  text-left
                  px-4
                  py-4
                  rounded-2xl
                  bg-[#0B1220]
                  hover:bg-[#111827]
                  transition
                "
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
            font-bold
            transition
          "
        >
          Đăng xuất
        </button>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">

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
                text-4xl
                font-black
              "
            >
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Quản trị hệ thống HOMIETICKET
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="
              px-5
              py-3
              rounded-2xl
              bg-[#0B1220]
              border
              border-gray-700
              hover:bg-[#111827]
            "
          >
            Về trang chủ
          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6">

          {[
            "Users",
            "Events",
            "Orders",
            "Revenue",
          ].map((item) => (

            <div
              key={item}
              className="
                bg-[#0B1220]
                border
                border-gray-800
                rounded-3xl
                p-8
              "
            >

              <p className="text-gray-400 mb-3">
                {item}
              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  text-red-400
                "
              >
                0
              </h2>

            </div>

          ))}

        </div>

      </main>

    </div>

  );

}