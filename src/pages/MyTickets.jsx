import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-5xl mx-auto py-12 px-6">

        <h1 className="text-4xl font-bold text-sky-400 mb-8">
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

        <div className="grid gap-6">

          {tickets.map((ticket) => (

            <div
              key={ticket.id}
              className="
                bg-gray-900
                border
                border-gray-800
                rounded-3xl
                p-6
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
                <span className="text-green-400">
                  {ticket.status}
                </span>
              </div>

              <button
  onClick={() =>
    navigate(`/ticket/${ticket.id}`)
  }
  className="
    mt-4
    px-5
    py-3
    rounded-xl
    bg-sky-500
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

    </div>

  );

}