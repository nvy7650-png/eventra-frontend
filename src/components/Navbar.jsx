import { useState } from "react";
import {
  useNavigate
} from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

const [search,
  setSearch] =
  useState("");

  const [showMenu, setShowMenu] = useState(false);

  const [showMobileMenu,
  setShowMobileMenu] =
  useState(false);

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

    <header className="border-b border-gray-800 bg-[#081120] sticky top-0 z-50">

      <div
        className="
          max-w-6xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* BRAND */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >

          <h1
            className="
  text-2xl
  md:text-4xl
  font-black
  tracking-widest
  text-sky-400
"
          >
            HOMIETICKET
          </h1>

          <p className="text-sm text-gray-400">
            Event & Ticket Marketplace
          </p>

        </div>

        {/* SEARCH */}
        <div
  className="
    flex-1
    mx-4
    hidden
    sm:flex
  "
>

          <input
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
  onKeyDown={(e) => {

    if (
      e.key === "Enter"
    ) {

      navigate(
  `/events?keyword=${encodeURIComponent(search)}`
);

    }

  }}
  placeholder="Tìm sự kiện..."
  className="
    w-full
    px-5
    py-3
    rounded-2xl
    bg-[#111827]
    border
    border-gray-700
    text-white
    placeholder:text-gray-500
    focus:outline-none
    focus:border-sky-400
  "
/>

        </div>

        {/* MOBILE MENU BUTTON */}

<div className="md:hidden">

  <button
    onClick={() =>
  setShowMobileMenu(
    !showMobileMenu
  )
}
    className="
      px-4
      py-2
      rounded-xl
      bg-sky-500
      text-black
      font-bold
    "
  >
    ☰
  </button>

</div>

{/* AUTH DESKTOP */}


        {/* AUTH */}
        <div
  className="
    hidden
    md:flex
    items-center
    gap-3
  "
>

          {!user ? (

            <>

              {/* LOGIN */}
              <button
                onClick={() => navigate("/login")}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  border
                  border-gray-700
                  text-white
                  hover:bg-[#111827]
                  transition
                "
              >
                Đăng nhập
              </button>

              {/* REGISTER */}
              <button
                onClick={() => navigate("/register")}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-sky-400
                  hover:bg-sky-300
                  text-black
                  font-bold
                  transition
                "
              >
                Đăng ký
              </button>

              {/* ORGANIZER */}
              <button
                onClick={() =>
                  navigate("/organizerregister")
                }
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-purple-500
                  hover:bg-purple-400
                  text-white
                  font-bold
                  transition
                "
              >
                Đăng ký nhà tổ chức
              </button>

            </>

          ) : (

            <div className="relative">

              {/* ACCOUNT BUTTON */}
              <button
                onClick={() =>
                  setShowMenu(!showMenu)
                }
                className="
                  flex
                  items-center
                  gap-3
                  px-5
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  hover:bg-[#1F2937]
                  transition
                "
              >

                <div className="text-left">

                  <p
                    className="
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {user.name}
                  </p>

                </div>

                <span className="text-gray-400">
                  ▼
                </span>

              </button>

              {/* DROPDOWN */}
              {showMenu && (

                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-64
                    rounded-2xl
                    bg-[#0B1220]
                    border
                    border-gray-800
                    shadow-2xl
                    overflow-hidden
                    z-50
                  "
                >

                  {/* DASHBOARD ADMIN */}
                  {user.role === "ADMIN" && (

                    <button
                      onClick={() => {

                        setShowMenu(false);

                        navigate("/admin/dashboard");

                      }}
                      className="
                        w-full
                        text-left
                        px-5
                        py-4
                        hover:bg-[#111827]
                        transition
                        text-white
                        font-medium
                      "
                    >
                      Admin Dashboard
                    </button>

                  )}

                  {/* DASHBOARD ORGANIZER */}
                  {user.role === "ORGANIZER" && (

                    <button
                      onClick={() => {

                        setShowMenu(false);

                        navigate("/organizer/dashboard");

                      }}
                      className="
                        w-full
                        text-left
                        px-5
                        py-4
                        hover:bg-[#111827]
                        transition
                        text-white
                        font-medium
                      "
                    >
                      Organizer Dashboard
                    </button>

                  )}

                  {/* ACCOUNT */}
                  <button
  onClick={() => {

    setShowMenu(false);

    navigate("/profile");

  }}
  className="
    w-full
    text-left
    px-5
    py-4
    hover:bg-[#111827]
    transition
    text-white
    font-medium
  "
>
  Tài khoản của tôi
</button>

                  {user.role === "USER" && (
  <>
    <button
      onClick={() => {
        setShowMenu(false);
        navigate("/my-orders");
      }}
      className="
        w-full
        text-left
        px-5
        py-4
        hover:bg-[#111827]
        transition
        text-white
        font-medium
      "
    >
      Đơn hàng của tôi
    </button>

    <button
      onClick={() => {
        setShowMenu(false);
        navigate("/my-tickets");
      }}
      className="
        w-full
        text-left
        px-5
        py-4
        hover:bg-[#111827]
        transition
        text-white
        font-medium
      "
    >
      Vé của tôi
    </button>
  </>
)}

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      text-left
                      px-5
                      py-4
                      hover:bg-red-500/10
                      transition
                      text-red-400
                      font-medium
                    "
                  >
                    Đăng xuất
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>
      {/* MOBILE SEARCH */}

<div
  className="
    sm:hidden
    px-4
    py-3
    border-t
    border-white/10
    bg-[#081120]
  "
>

  <input
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    onKeyDown={(e) => {

      if (e.key === "Enter") {

        navigate(
          `/events?keyword=${search}`
        );

      }

    }}
    placeholder="Tìm sự kiện..."
    className="
      w-full
      px-4
      py-3
      rounded-2xl
      bg-[#111827]
      border
      border-white/10
      text-white
    "
  />

</div>

{showMobileMenu && (

  <div
    className="
      md:hidden
      border-t
      border-white/10
      bg-[#0B1220]
      p-4
      flex
      flex-col
      gap-3
    "
  >

    {!user ? (

      <>

        <button
          onClick={() =>
            navigate("/login")
          }
          className="
            w-full
            py-3
            rounded-xl
            border
            border-white/10
          "
        >
          Đăng nhập
        </button>

        <button
          onClick={() =>
            navigate("/register")
          }
          className="
            w-full
            py-3
            rounded-xl
            bg-sky-500
            text-black
            font-bold
          "
        >
          Đăng ký
        </button>

        <button
          onClick={() =>
            navigate(
              "/organizerregister"
            )
          }
          className="
            w-full
            py-3
            rounded-xl
            bg-purple-500
            font-bold
          "
        >
          Đăng ký nhà tổ chức
        </button>

      </>

    ) : (

      <>

        {user.role === "ADMIN" && (

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            className="
              w-full
              py-3
              rounded-xl
              bg-white/5
            "
          >
            Admin Dashboard
          </button>

        )}

        {user.role === "ORGANIZER" && (

          <button
            onClick={() =>
              navigate(
                "/organizer/dashboard"
              )
            }
            className="
              w-full
              py-3
              rounded-xl
              bg-white/5
            "
          >
            Organizer Dashboard
          </button>

        )}

        <button
  onClick={() =>
    navigate("/profile")
  }
  className="
    w-full
    py-3
    rounded-xl
    bg-white/5
  "
>
  Tài khoản của tôi
</button>

        <button
          onClick={handleLogout}
          className="
            w-full
            py-3
            rounded-xl
            bg-red-500
          "
        >
          Đăng xuất
        </button>


      </>

    )}

  </div>

)}

    </header>
    

  );

}