import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminEvents() {

const navigate = useNavigate();

const [events, setEvents] =
useState([]);

const [loading, setLoading] =
useState(true);

useEffect(() => {

fetch(
  `${import.meta.env.VITE_API_URL}/api/events/admin/all`
)
  .then((res) => res.json())
  .then((data) => {

    setEvents(data || []);

  })
  .catch(console.log)
  .finally(() => {

    setLoading(false);

  });

}, []);

if (loading) {

return (

  <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
    Đang tải...
  </div>

);


}

return (


<div className="min-h-screen bg-[#050816] text-white flex">

  <AdminSidebar />

  <main
    className="
      flex-1
      min-w-0
      p-4
      md:p-10

       lg:ml-72
    "
  >

    <div className="mb-8">

      <h1 className="text-3xl font-black">
        Quản lý sự kiện
      </h1>

      <p className="text-gray-400 mt-2">
        Danh sách tất cả sự kiện trong hệ thống
      </p>

    </div>

    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      "
    >

      {events.map((event) => (

        <div
          key={event.id}
          className="
            bg-[#0B1120]
            border
            border-white/10
            rounded-3xl
            p-6
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:justify-between
              gap-4
            "
          >

            <div>

              <h2 className="text-xl font-bold">
                {event.title}
              </h2>

              <p className="text-gray-400 mt-1">
                {event.category_name}
              </p>

            </div>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-xs
                font-bold
                h-fit

                ${
                  event.status === "APPROVED"
                    ? "bg-green-500/20 text-green-400"
                    : event.status === "PENDING"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }
              `}
            >
              {event.status}
            </span>

          </div>

          <div className="mt-6">

            <button
              onClick={() =>
                navigate(
                  `/admin/events/${event.id}`
                )
              }
              className="
                px-5
                py-3
                rounded-2xl
                bg-sky-500
                text-black
                font-bold
              "
            >
              Chi tiết
            </button>

          </div>

        </div>

      ))}

    </div>

  </main>

</div>

);

}
