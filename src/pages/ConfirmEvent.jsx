
import {
  useState,
} from "react";

import {
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  Ticket,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function ConfirmEvent() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    eventData,
    showtimes,
  } = location.state || {};

  const [loading,
    setLoading] =
    useState(false);

  if (
    !eventData ||
    !showtimes
  ) {

    return null;

  }

  const totalTickets =
    showtimes.reduce(
      (sum, showtime) =>

        sum +

        showtime.tickets.reduce(
          (ticketSum, ticket) =>

            ticketSum +
            Number(
              ticket.quantity || 0
            ),

          0
        ),

      0
    );

  const handleSubmit =
    async () => {

      setLoading(true);

      try {

        const submitData =
          new FormData();

        submitData.append(
          "organizer_id",
          eventData.organizer_id
        );

        submitData.append(
          "category_id",
          eventData.category_id
        );

        submitData.append(
          "title",
          eventData.title
        );

        submitData.append(
          "description",
          eventData.description
        );

        submitData.append(
          "location",
          eventData.location
        );

        submitData.append(
          "seat_mode",
          eventData.seat_mode
        );

        submitData.append(
          "image",
          eventData.image
        );

        submitData.append(
          "showtimes",
          JSON.stringify(
            showtimes
          )
        );

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events/create-full`,

            {
              method: "POST",
              body: submitData,
            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Tạo sự kiện thất bại"
          );

          setLoading(false);

          return;

        }

        alert(
          "Gửi duyệt sự kiện thành công 🎉"
        );

        navigate(
          "/organizer/events"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Lỗi server"
        );

      }

      setLoading(false);

    };

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        px-6
        py-10
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            px-8
            py-7
            border-b
            border-white/10
            bg-[#081120]
          "
        >

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              items-center
              gap-2
              text-gray-400
              hover:text-white
              mb-6
            "
          >

            <ArrowLeft
              size={18}
            />

            Quay lại

          </button>

          <p
            className="
              text-sky-400
              font-semibold
            "
          >
            BƯỚC 3 / 3
          </p>

          <h1
            className="
              text-4xl
              font-black
              mt-2
            "
          >
            Xác nhận tạo sự kiện
          </h1>

          <p
            className="
              text-gray-400
              mt-3
            "
          >
            Kiểm tra lại thông tin trước khi gửi duyệt.
          </p>

          <div
            className="
              w-full
              h-2
              bg-white/10
              rounded-full
              overflow-hidden
              mt-6
            "
          >

            <div
              className="
                h-full
                w-full
                bg-sky-400
              "
            />

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6">

          <div
            className="
              bg-[#111827]
              rounded-3xl
              p-6
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              {eventData.title}
            </h2>

            <p className="text-gray-400">
              {eventData.location}
            </p>

            <p className="mt-4 text-gray-300">
              {eventData.description}
            </p>

          </div>

          <div
            className="
              grid
              md:grid-cols-3
              gap-4
            "
          >

            <div
              className="
                bg-[#111827]
                rounded-3xl
                p-6
              "
            >

              <CalendarDays />

              <h3
                className="
                  text-3xl
                  font-black
                  mt-3
                "
              >
                {showtimes.length}
              </h3>

              <p className="text-gray-400">
                Suất diễn
              </p>

            </div>

            <div
              className="
                bg-[#111827]
                rounded-3xl
                p-6
              "
            >

              <Ticket />

              <h3
                className="
                  text-3xl
                  font-black
                  mt-3
                "
              >
                {totalTickets}
              </h3>

              <p className="text-gray-400">
                Tổng số vé
              </p>

            </div>

            <div
              className="
                bg-[#111827]
                rounded-3xl
                p-6
              "
            >

              <h3
                className="
                  text-3xl
                  font-black
                "
              >
                {eventData.seat_mode}
              </h3>

              <p className="text-gray-400">
                Hình thức bán vé
              </p>

            </div>

          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full
              py-5
              rounded-2xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
              text-lg
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {loading
              ? "Đang gửi..."
              : "Gửi duyệt sự kiện"}

            {!loading && (
              <ChevronRight
                size={22}
              />
            )}

          </button>

        </div>

      </div>

    </div>

  );

}
