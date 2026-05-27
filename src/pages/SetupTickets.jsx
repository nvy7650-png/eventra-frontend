import {
  useState,
} from "react";

import {
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

export default function SetupTickets() {

  const navigate = useNavigate();

  const { id } = useParams();

  // ============================
  // SHOWTIMES
  // ============================

  const [showtimes,
    setShowtimes] =
    useState([
      {
        start_time: "",
      },
    ]);

  // ============================
  // TICKETS
  // ============================

  const [tickets,
    setTickets] =
    useState([

      {

        name: "",

        price: "",

        quantity: "",

      },

    ]);

  const [loading,
    setLoading] =
    useState(false);

  // ============================
  // SHOWTIME CHANGE
  // ============================

  const handleShowtimeChange = (
    index,
    value
  ) => {

    const updated =
      [...showtimes];

    updated[index]
      .start_time = value;

    setShowtimes(updated);

  };

  // ADD SHOWTIME
  const addShowtime = () => {

    setShowtimes([

      ...showtimes,

      {
        start_time: "",
      },

    ]);

  };

  // REMOVE SHOWTIME
  const removeShowtime = (
    index
  ) => {

    const updated =
      [...showtimes];

    updated.splice(index, 1);

    setShowtimes(updated);

  };

  // ============================
  // TICKET CHANGE
  // ============================

  const handleTicketChange = (
    index,
    field,
    value
  ) => {

    const updated =
      [...tickets];

    updated[index][field] =
      value;

    setTickets(updated);

  };

  // ADD TICKET
  const addTicket = () => {

    setTickets([

      ...tickets,

      {

        name: "",

        price: "",

        quantity: "",

      },

    ]);

  };

  // REMOVE TICKET
  const removeTicket = (
    index
  ) => {

    const updated =
      [...tickets];

    updated.splice(index, 1);

    setTickets(updated);

  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit =
    async () => {

      setLoading(true);

      try {

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events/${id}/tickets`,

            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                showtimes,

                tickets,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Lỗi setup vé"
          );

          setLoading(false);

          return;

        }

        // NEXT STEP
        navigate(

          `/organizer/event/${id}/payment`

        );

      } catch (err) {

        console.log(err);

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

          <p
            className="
              text-sky-400
              font-semibold
            "
          >
            BƯỚC 2 / 3
          </p>

          <h1
            className="
              text-4xl
              font-black
              mt-2
            "
          >
            Setup vé & suất diễn
          </h1>

          {/* PROGRESS */}
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
                w-2/3
                bg-sky-400
              "
            />

          </div>

        </div>

        <div className="p-8">

          {/* SHOWTIMES */}
          <div>

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Suất diễn
              </h2>

              <button
                onClick={addShowtime}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-sky-500
                  text-black
                  font-semibold
                "
              >

                <Plus size={18} />

                Thêm suất diễn

              </button>

            </div>

            <div className="space-y-4">

              {showtimes.map(
                (
                  showtime,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      flex
                      gap-3
                    "
                  >

                    <input
                      type="datetime-local"
                      value={
                        showtime.start_time
                      }
                      onChange={(e) =>

                        handleShowtimeChange(

                          index,

                          e.target.value

                        )

                      }
                      className="
                        flex-1
                        px-4
                        py-4
                        rounded-2xl
                        bg-[#111827]
                        border
                        border-white/10
                        focus:outline-none
                        focus:border-sky-400
                      "
                    />

                    <button
                      onClick={() =>
                        removeShowtime(
                          index
                        )
                      }
                      className="
                        px-4
                        rounded-2xl
                        bg-red-500
                      "
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

          {/* TICKETS */}
          <div className="mt-12">

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Loại vé
              </h2>

              <button
                onClick={addTicket}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-sky-500
                  text-black
                  font-semibold
                "
              >

                <Plus size={18} />

                Thêm vé

              </button>

            </div>

            <div className="space-y-4">

              {tickets.map(
                (
                  ticket,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      grid
                      md:grid-cols-4
                      gap-3
                    "
                  >

                    <input
                      type="text"
                      placeholder="Tên vé"
                      value={ticket.name}
                      onChange={(e) =>

                        handleTicketChange(

                          index,

                          "name",

                          e.target.value

                        )

                      }
                      className="
                        px-4
                        py-4
                        rounded-2xl
                        bg-[#111827]
                        border
                        border-white/10
                      "
                    />

                    <input
                      type="number"
                      placeholder="Giá vé"
                      value={ticket.price}
                      onChange={(e) =>

                        handleTicketChange(

                          index,

                          "price",

                          e.target.value

                        )

                      }
                      className="
                        px-4
                        py-4
                        rounded-2xl
                        bg-[#111827]
                        border
                        border-white/10
                      "
                    />

                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={ticket.quantity}
                      onChange={(e) =>

                        handleTicketChange(

                          index,

                          "quantity",

                          e.target.value

                        )

                      }
                      className="
                        px-4
                        py-4
                        rounded-2xl
                        bg-[#111827]
                        border
                        border-white/10
                      "
                    />

                    <button
                      onClick={() =>
                        removeTicket(
                          index
                        )
                      }
                      className="
                        rounded-2xl
                        bg-red-500
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              mt-10
              w-full
              py-4
              rounded-2xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
              text-lg
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {loading
              ? "Đang lưu..."
              : "Tiếp tục"}

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