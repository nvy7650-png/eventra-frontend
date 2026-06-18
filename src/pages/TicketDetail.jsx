import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";

export default function TicketDetail() {

  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
         console.log("TICKET DATA:", data);

        setTicket(data);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Đang tải vé...
      </div>
    );

  }

  if (!ticket) {

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Không tìm thấy vé
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-3xl mx-auto py-12 px-6">

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

          <h1 className="text-4xl font-bold text-sky-400 mb-8">
            Vé điện tử
          </h1>

          <div className="mb-4 text-2xl font-bold">
            {ticket.event_title}
          </div>

          <div className="mb-2">
            Khu vực: {ticket.zone_name}
          </div>

          <div className="mb-2">
            Ghế: {ticket.seat_code}
          </div>

          <div className="mb-6">
            Mã vé: {ticket.ticket_code}
          </div>

          <div className="flex justify-center mb-8">

            <div className="bg-white p-4 rounded-2xl">

              <QRCode
                value={ticket.ticket_code}
                size={220}
              />

            </div>

          </div>

          <div
            className="
              bg-yellow-500/10
              border
              border-yellow-500/30
              text-yellow-300
              rounded-xl
              p-4
            "
          >
            ⚠ Không chia sẻ mã QR này cho người khác.
            Người check-in đầu tiên sẽ được chấp nhận.
          </div>

        </div>

      </div>

    </div>

  );

}