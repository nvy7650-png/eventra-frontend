import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MyTickets() {

  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/api/tickets/my/${user.id}`
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

        <h1
  className="
    text-2xl
    md:text-4xl
    font-black
    text-sky-400
    mb-8
  "
>
          Vé của tôi
        </h1>

        {loading && (
          <div>Đang tải...</div>
        )}

        {!loading &&
          tickets.length === 0 && (
            <div>
              Bạn chưa có vé nào
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

          {tickets.map((ticket) => (

            <div
              key={ticket.id}
              className="
  bg-[#0B1220]
  border
  border-white/10
  rounded-3xl
  overflow-hidden
"
            >

              <div className="text-2xl font-bold text-sky-400 mb-3">
                {ticket.event_title}
              </div>

              <div className="mb-2">
                Khu vực: {ticket.zone_name}
              </div>

              <div className="mb-2">
                Ghế: {ticket.seat_code}
              </div>

              <div className="mb-2">
                Mã vé:
                {" "}
                {ticket.ticket_code}
              </div>


              <div className="mb-2">
                Trạng thái:
                {" "}
                <span
  className={`
    px-3
    py-1
    rounded-full
    text-xs
    font-bold

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
    navigate(`/ticket/${ticket.id}`)
  }
  className="
  mt-5
  w-full
  py-3
  rounded-2xl
  bg-sky-500
  hover:bg-sky-400
  text-black
  font-bold
  transition
"
>
  Xem vé
</button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}