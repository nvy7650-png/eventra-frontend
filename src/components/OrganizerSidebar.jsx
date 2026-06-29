import {
  Calendar,
  LayoutDashboard,
  Ticket,
  BadgePercent,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function OrganizerSidebar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const menuItems = [

    {
      name: "Dashboard",
      icon:
        LayoutDashboard,
      path:
        "/organizer/dashboard",
    },

    {
      name:
        "Sự kiện của tôi",
      icon:
        Calendar,
      path:
        "/organizer/events",
    },

    {
      name:
        "Quản lý vé",
      icon:
        Ticket,
      path:
        "/organizer/tickets",
    },

    {
  name: "Check-in vé",
  icon: Ticket,
  path: "/organizer/scan",
}, 

    {
      name:
        "Khuyến mãi",
      icon:
        BadgePercent,
      path:
        "/organizer/promotions",
    },

    {
      name:
        "Doanh thu",
      icon:
        Wallet,
      path:
        "/organizer/revenue",
    },

    {
      name:
        "Cài đặt",
      icon:
        Settings,
      path:
        "/organizer/settings",
    },

  ];

  const handleLogout =
    () => {

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/login"
      );

    };

  return (

    <div
  className="
    fixed
    left-0
    top-0

    w-80
    h-screen

    bg-[#081224]

    border-r
    border-white/10

    flex
    flex-col

    z-50
  "
>

      {/* LOGO */}
      <div className="px-6 pt-7 pb-6">

        <h1
          className="
            text-4xl
            font-black
            text-sky-500
            tracking-tight
            leading-none
          "
        >

          HOMIETICKET

        </h1>

        <p
          className="
            text-gray-400
            mt-3
            text-sm
          "
        >

          Organizer Center

        </p>

      </div>

      {/* USER */}
      <div className="px-5">

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-4
            flex
            items-center
            gap-3
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
              text-black
              font-black
              text-lg
            "
          >

            {user?.name?.charAt(0)}

          </div>

          <div>

            <h3
              className="
                font-bold
                text-base
              "
            >

              {user?.name}

            </h3>

            <p
              className="
                text-gray-400
                text-sm
              "
            >

              Organizer

            </p>

          </div>

        </div>

      </div>

      {/* MENU */}
      <div
        className="
          flex-1
          px-5
          mt-8
          space-y-2
        "
      >

        {menuItems.map(
          (item) => {

            const Icon =
              item.icon;

            const active =
              location.pathname ===
              item.path;

            return (

              <button
                key={item.path}
                onClick={() =>
                  navigate(
                    item.path
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-4
                  rounded-2xl
                  transition

                  ${
                    active
                      ? "bg-sky-500 text-black font-bold"
                      : "text-white hover:bg-white/10"
                  }
                `}
              >

                <Icon size={22} />

                {item.name}

              </button>

            );

          }
        )}

      </div>

      {/* LOGOUT */}
      <div className="p-5">

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

      </div>

    </div>

  );

}
