import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MyTickets() {

  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket,
  setSelectedTicket] =
  useState(null);
  const [activeTab,
  setActiveTab] =
  useState("ALL");

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    fetch(
  `${import.meta.env.VITE_API_URL}/api/tickets/my-tickets/${user.id}`
)
      .then((res) => res.json())
      .then((data) => {

        setTickets(data);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, []);

  return (

   <div className="min-h-screen bg-[#050816] text-white">

  <Navbar />

      <div
  className="
    max-w-6xl
    mx-auto
    py-8
    md:py-12
    px-4
    md:px-6
  "
>

       <div className="mb-8">

  <h1
    className="
      text-3xl
      md:text-4xl
      font-black
    "
  >
    Vé của tôi
  </h1>

  <p
    className="
      text-gray-400
      mt-2
    "
  >
    Quản lý tất cả vé đã mua
  </p>

</div>

        <div
  className="
    flex
overflow-x-auto
gap-3
pb-2
    mb-8
  "
>

  {[
    {
      key: "ALL",
      label: "Tất cả",
    },
    {
      key: "VALID",
      label: "Còn hiệu lực",
    },
    {
      key: "USED",
      label: "Đã sử dụng",
    },
    {
      key: "CANCELLED",
      label: "Đã hủy",
    },
  ].map((tab) => (

    <button
      key={tab.key}
      onClick={() =>
        setActiveTab(
          tab.key
        )
      }
      className={`
        px-6
py-3
rounded-2xl
min-w-[160px]
font-semibold

        ${
          activeTab ===
          tab.key

            ? "bg-sky-500 text-black font-bold"

            : "bg-white/5 text-gray-300"
        }
      `}
    >

      {tab.label}

    </button>

  ))}

</div>

        {loading && (
          <div>Đang tải...</div>
        )}

        {!loading &&
          tickets.length === 0 && (
           <div
  className="
    bg-[#0B1220]
    border
    border-white/10
    rounded-3xl
    p-12
    text-center
  "
>

  <h3
    className="
      text-2xl
      font-bold
      mb-3
    "
  >
    Chưa có vé nào
  </h3>

  <p className="text-gray-400">
    Các vé đã mua sẽ xuất hiện tại đây
  </p>

</div>
          )}

        <div
  className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-6
  "
>

          {tickets

.filter((ticket) => {

  if (
    activeTab === "ALL"
  ) {

    return true;

  }

  return (
    ticket.status ===
    activeTab
  );

}).map((ticket) => (

           <div
  key={ticket.id}
  className="
    bg-[#0B1220]
    border
    border-white/10
    rounded-3xl
    p-6
    md:p-8
    hover:border-sky-500
    transition
  "
>

              <h3
  className="
    text-xl
    md:text-2xl
    font-bold
    text-white
    mb-6
    line-clamp-2
  "
>
  {ticket.event_title}
</h3>

             <div
  className="
    space-y-4
    mb-6
  "
>

  <div>

    <p
      className="
        text-gray-500
        text-sm
      "
    >
      Mã vé
    </p>

    <p
      className="
        text-sky-400
        font-semibold
        mt-1
        break-all
      "
    >
      {ticket.ticket_code}
    </p>

  </div>

  <div>

    <p
      className="
        text-gray-500
        text-sm
      "
    >
      Thời gian diễn ra
    </p>

    <p className="text-white mt-1">
  {ticket.start_time
    ? new Date(
        ticket.start_time
      ).toLocaleString(
        "vi-VN",
        {
          dateStyle: "full",
          timeStyle: "short",
        }
      )
    : "Chưa cập nhật"}
</p>

  </div>

  <div>

    <p
      className="
        text-gray-500
        text-sm
      "
    >
      Địa điểm
    </p>

    <p className="text-white mt-1">
      {ticket.location}
    </p>

  </div>

</div>


             <div className="mb-6">

  <span
    className={`
      px-4
      py-2
      rounded-full
      text-sm
      font-semibold

      ${
        ticket.status === "VALID"
          ? "bg-green-500/20 text-green-400"
          : ticket.status === "USED"
          ? "bg-gray-500/20 text-gray-300"
          : "bg-red-500/20 text-red-400"
      }
    `}
  >
    {
      ticket.status === "VALID"
        ? "Còn hiệu lực"
        : ticket.status === "USED"
        ? "Đã sử dụng"
        : "Đã hủy"
    }
  </span>

</div>

              <button
  onClick={() =>
    setSelectedTicket(ticket)
  }
  className="
    mt-6
    w-full
    py-4
    rounded-2xl
    bg-gradient-to-r
    from-sky-500
    to-cyan-400
    text-black
    font-bold
  "
>
  Xem vé
</button>

            </div>

          ))}

        </div>

      </div>
      {selectedTicket && (

  <div
    className="
      fixed
      inset-0
      bg-black/80
      backdrop-blur-sm
      z-50
      flex
      items-center
      justify-center
      p-4
    "
  >

    <div
      className="
        w-full
        max-w-lg
        bg-[#0B1220]
        rounded-3xl
        border
        border-white/10
        p-6
        relative
      "
    >

      <button
        onClick={() =>
          setSelectedTicket(null)
        }
        className="
          absolute
          top-4
          right-4
          text-gray-400
          text-2xl
        "
      >
        ×
      </button>

      <h2
        className="
          text-2xl
          font-black
          text-sky-400
          mb-4
        "
      >
        Vé điện tử
      </h2>

      <h3
        className="
          text-lg
          font-bold
          mb-4
        "
      >
        {selectedTicket.event_title}
      </h3>

      <div className="space-y-3 mb-6">

  <div>
    <p className="text-gray-500">
      Khu vực
    </p>

    <p className="text-white">
      {selectedTicket.zone_name || "-"}
    </p>
  </div>

  <div>
    <p className="text-gray-500">
      Ghế
    </p>

    <p className="text-white">
      {selectedTicket.seat_code || "-"}
    </p>
  </div>

</div>

      <img
        src={
          selectedTicket.qr_code
        }
        alt="QR Code"
        className="
          w-64
          h-64
          mx-auto
          bg-white
          p-2
          rounded-2xl
        "
      />

      <div
        className="
          mt-6
          space-y-3
        "
      >

        <div>

          <p className="text-gray-500">
            Mã vé
          </p>

          <p className="text-sky-400">
            {
              selectedTicket.ticket_code
            }
          </p>

        </div>

        <div>

          <p className="text-gray-500">
            Trạng thái
          </p>

          <p>
            {
              selectedTicket.status
            }
          </p>

        </div>

      </div>

    </div>

  </div>

)}

    </div>

  );

}