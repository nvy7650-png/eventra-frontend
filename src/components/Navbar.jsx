import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  // GET USER
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

    <header className="border-b border-gray-700 bg-gray-900">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* BRAND */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >

          <h1 className="text-2xl font-bold text-sky-300 tracking-widest">
            HOMIETICKET
          </h1>

          <p className="text-xs text-gray-400">
            Event & Ticket Marketplace
          </p>

        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 mx-10">

          <input
            placeholder="Tìm sự kiện..."
            className="
              w-full
              px-4
              py-2
              rounded-lg
              bg-gray-800
              border border-gray-700
              text-white
              focus:outline-none
              focus:border-sky-300
            "
          />

        </div>

        {/* AUTH */}
        <div className="flex items-center gap-3">

          {!user ? (

            <>

              {/* LOGIN */}
              <button
                onClick={() => navigate("/login")}
                className="
                  px-4 py-2
                  text-sm
                  rounded-lg
                  border border-gray-600
                  text-white
                  hover:bg-gray-800
                "
              >
                Đăng nhập
              </button>

              {/* REGISTER */}
              <button
                onClick={() => navigate("/register")}
                className="
                  px-4 py-2
                  text-sm
                  rounded-lg
                  bg-sky-300
                  hover:bg-sky-400
                  text-black
                  font-semibold
                "
              >
                Đăng ký
              </button>

              {/* ORGANIZER */}
              <button
                onClick={() => navigate("/organizerregister")}
                className="
                  px-4 py-2
                  text-sm
                  rounded-lg
                  bg-purple-500
                  hover:bg-purple-400
                  text-white
                  font-semibold
                "
              >
                Đăng ký nhà tổ chức
              </button>

            </>

          ) : (

            <div className="flex items-center gap-4">

              {/* USER INFO */}
              <div className="text-right">

                <p className="text-sm font-semibold text-white">
                  {user.name}
                </p>

                <p className="text-xs text-gray-400">
                  {user.role}
                </p>

              </div>

              {/* DASHBOARD */}
              {user.role === "ORGANIZER" && (

                <button
                  onClick={() => navigate("/organizer/dashboard")}
                  className="
                    px-4 py-2
                    text-sm
                    rounded-lg
                    bg-sky-500
                    hover:bg-sky-400
                    text-white
                    font-semibold
                  "
                >
                  Dashboard
                </button>

              )}

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="
                  px-4 py-2
                  text-sm
                  rounded-lg
                  bg-red-500
                  hover:bg-red-400
                  text-white
                  font-semibold
                "
              >
                Đăng xuất
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

}