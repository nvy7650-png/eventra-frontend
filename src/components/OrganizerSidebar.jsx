import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BadgePercent,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function OrganizerSidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] =
    useState(false);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const menuItems = [

    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/organizer/dashboard",
    },

    {
      name: "Sự kiện của tôi",
      icon: Calendar,
      path: "/organizer/events",
    },

    {
      name: "Quản lý vé",
      icon: Ticket,
      path: "/organizer/tickets",
    },

    {
      name: "Check-in vé",
      icon: Ticket,
      path: "/organizer/scan",
    },

    {
      name: "Khuyến mãi",
      icon: BadgePercent,
      path: "/organizer/promotions",
    },

    {
      name: "Doanh thu",
      icon: Wallet,
      path: "/organizer/revenue",
    },

    {
      name: "Cài đặt",
      icon: Settings,
      path: "/organizer/settings",
    },

  ];

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();

  };

  return (

    <>

      {/* MOBILE BUTTON */}

      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          lg:hidden

          fixed
          top-5
          right-5

          z-[1100]

          p-3

          rounded-xl

          bg-sky-500

          text-black

          shadow-lg
        "
      >

        <Menu size={22} />

      </button>

      {/* OVERLAY */}

      {open && (

        <div
          onClick={() =>
            setOpen(false)
          }
          className="
            lg:hidden

            fixed
            inset-0

            bg-black/60

            z-[999]
          "
        />

      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          top-0
          left-0

          z-[1000]

          h-screen

          w-72

          bg-[#0B1120]

          border-r
          border-white/10

          flex
          flex-col
          justify-between

          p-5

          transition-all
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        <div>

          {/* HEADER */}

          <div className="mb-10 flex items-start justify-between">

            <div>

              <h1 className="text-3xl font-black text-sky-400">

                HOMIETICKET

              </h1>

              <p className="text-gray-400 text-sm">

                Organizer Center

              </p>

            </div>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="
                lg:hidden
                p-2
                rounded-xl
                hover:bg-white/10
              "
            >

              <X size={22} />

            </button>

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

                Organizer

              </p>

            </div>

          </div>

          {/* MENU */}

          <div className="space-y-2">

            {menuItems.map((item) => {

              const Icon =
                item.icon;

              return (

                <button
                  key={item.path}
                  onClick={() => {

                    navigate(
                      item.path
                    );

                    setOpen(false);

                  }}
                  className={`
                    w-full

                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    transition

                    ${
                      location.pathname ===
                      item.path
                        ? "bg-sky-500 text-black font-bold"
                        : "hover:bg-white/5"
                    }
                  `}
                >

                  <Icon size={20} />

                  {item.name}

                </button>

              );

            })}

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
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

    </>

  );

}