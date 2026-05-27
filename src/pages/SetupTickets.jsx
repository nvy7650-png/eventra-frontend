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

  const [loading,
    setLoading] =
    useState(false);

  // ============================
  // SHOWTIMES
  // ============================

  const [showtimes,
    setShowtimes] =
    useState([

      {

        start_time: "",

        end_time: "",

        tickets: [

          {

            name: "",

            price: "",

            quantity: "",

            sale_start: "",

            sale_end: "",

          },

        ],

      },

    ]);

  // ============================
  // SHOWTIME CHANGE
  // ============================

  const handleShowtimeChange = (
    index,
    field,
    value
  ) => {

    const updated =
      [...showtimes];

    updated[index][field] =
      value;

    setShowtimes(updated);

  };

  // ============================
  // ADD SHOWTIME
  // ============================

  const addShowtime = () => {

    setShowtimes([

      ...showtimes,

      {

        start_time: "",

        end_time: "",

        tickets: [

          {

            name: "",

            price: "",

            quantity: "",

            sale_start: "",

            sale_end: "",

          },

        ],

      },

    ]);

  };

  // ============================
  // REMOVE SHOWTIME
  // ============================

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

    showtimeIndex,

    ticketIndex,

    field,

    value

  ) => {

    const updated =
      [...showtimes];

    updated[
      showtimeIndex
    ].tickets[
      ticketIndex
    ][field] = value;

    setShowtimes(updated);

  };

  // ============================
  // ADD TICKET
  // ============================

  const addTicket = (
    showtimeIndex
  ) => {

    const updated =
      [...showtimes];

    updated[
      showtimeIndex
    ].tickets.push({

      name: "",

      price: "",

      quantity: "",

      sale_start: "",

      sale_end: "",

    });

    setShowtimes(updated);

  };

  // ============================
  // REMOVE TICKET
  // ============================

  const removeTicket = (

    showtimeIndex,

    ticketIndex

  ) => {

    const updated =
      [...showtimes];

    updated[
      showtimeIndex
    ].tickets.splice(
      ticketIndex,
      1
    );

    setShowtimes(updated);

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
          max-w-6xl
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

        {/* CONTENT */}
        <div className="p-8">

          {/* SHOWTIMES */}
          <div className="space-y-8">

            {showtimes.map(
              (
                showtime,
                showtimeIndex
              ) => (

                <div
                  key={showtimeIndex}
                  className="
                    bg-[#111827]
                    border
                    border-white/10
                    rounded-3xl
                    p-6
                  "
                >

                  {/* HEADER */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    "
                  >

                    <h2
                      className="
                        text-2xl
                        font-bold
                      "
                    >
                      Suất diễn #

                      {showtimeIndex + 1}

                    </h2>

                    <button
                      onClick={() =>

                        removeShowtime(
                          showtimeIndex
                        )

                      }
                      className="
                        px-4
                        py-3
                        rounded-2xl
                        bg-red-500
                      "
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                  {/* SHOWTIME TIME */}
                  <div
                    className="
                      grid
                      md:grid-cols-2
                      gap-4
                    "
                  >

                    <div>

                      <label
                        className="
                          text-sm
                          text-gray-400
                          block
                          mb-2
                        "
                      >
                        Thời gian bắt đầu *
                      </label>

                      <input
                        type="datetime-local"
                        value={
                          showtime.start_time
                        }
                        onChange={(e) =>

                          handleShowtimeChange(

                            showtimeIndex,

                            "start_time",

                            e.target.value

                          )

                        }
                        className="
                          w-full
                          px-4
                          py-4
                          rounded-2xl
                          bg-[#0B1120]
                          border
                          border-white/10
                        "
                        required
                      />

                    </div>

                    <div>

                      <label
                        className="
                          text-sm
                          text-gray-400
                          block
                          mb-2
                        "
                      >
                        Thời gian kết thúc *
                      </label>

                      <input
                        type="datetime-local"
                        value={
                          showtime.end_time
                        }
                        onChange={(e) =>

                          handleShowtimeChange(

                            showtimeIndex,

                            "end_time",

                            e.target.value

                          )

                        }
                        className="
                          w-full
                          px-4
                          py-4
                          rounded-2xl
                          bg-[#0B1120]
                          border
                          border-white/10
                        "
                        required
                      />

                    </div>

                  </div>

                  {/* TICKETS */}
                  <div className="mt-8">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-5
                      "
                    >

                      <h3
                        className="
                          text-xl
                          font-bold
                        "
                      >
                        Loại vé
                      </h3>

                      <button
                        onClick={() =>

                          addTicket(
                            showtimeIndex
                          )

                        }
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

                        <Plus
                          size={18}
                        />

                        Thêm loại vé

                      </button>

                    </div>

                    <div className="space-y-4">

                      {showtime.tickets.map(
                        (
                          ticket,
                          ticketIndex
                        ) => (

                          <div
                            key={ticketIndex}
                            className="
                              bg-[#0B1120]
                              border
                              border-white/10
                              rounded-3xl
                              p-5
                              space-y-5
                            "
                          >

                            {/* HEADER */}
                            <div
                              className="
                                flex
                                items-center
                                justify-between
                              "
                            >

                              <h4
                                className="
                                  text-lg
                                  font-bold
                                "
                              >
                                Loại vé #

                                {ticketIndex + 1}

                              </h4>

                              <button
                                onClick={() =>

                                  removeTicket(

                                    showtimeIndex,

                                    ticketIndex

                                  )

                                }
                                className="
                                  w-11
                                  h-11
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

                            {/* BASIC */}
                            <div
                              className="
                                grid
                                md:grid-cols-3
                                gap-4
                              "
                            >

                              <div>

                                <label
                                  className="
                                    text-sm
                                    text-gray-400
                                    block
                                    mb-2
                                  "
                                >
                                  Tên loại vé *
                                </label>

                                <input
                                  type="text"
                                  value={
                                    ticket.name
                                  }
                                  onChange={(e) =>

                                    handleTicketChange(

                                      showtimeIndex,

                                      ticketIndex,

                                      "name",

                                      e.target.value

                                    )

                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-2xl
                                    bg-[#111827]
                                    border
                                    border-white/10
                                  "
                                  required
                                />

                              </div>

                              <div>

                                <label
                                  className="
                                    text-sm
                                    text-gray-400
                                    block
                                    mb-2
                                  "
                                >
                                  Giá vé *
                                </label>

                                <input
                                  type="number"
                                  value={
                                    ticket.price
                                  }
                                  onChange={(e) =>

                                    handleTicketChange(

                                      showtimeIndex,

                                      ticketIndex,

                                      "price",

                                      e.target.value

                                    )

                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-2xl
                                    bg-[#111827]
                                    border
                                    border-white/10
                                  "
                                  required
                                />

                              </div>

                              <div>

                                <label
                                  className="
                                    text-sm
                                    text-gray-400
                                    block
                                    mb-2
                                  "
                                >
                                  Số lượng vé *
                                </label>

                                <input
                                  type="number"
                                  value={
                                    ticket.quantity
                                  }
                                  onChange={(e) =>

                                    handleTicketChange(

                                      showtimeIndex,

                                      ticketIndex,

                                      "quantity",

                                      e.target.value

                                    )

                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-2xl
                                    bg-[#111827]
                                    border
                                    border-white/10
                                  "
                                  required
                                />

                              </div>

                            </div>

                            {/* SALE TIME */}
                            <div
                              className="
                                grid
                                md:grid-cols-2
                                gap-4
                              "
                            >

                              <div>

                                <label
                                  className="
                                    text-sm
                                    text-gray-400
                                    block
                                    mb-2
                                  "
                                >
                                  Thời gian bắt đầu bán vé *
                                </label>

                                <input
                                  type="datetime-local"
                                  value={
                                    ticket.sale_start
                                  }
                                  onChange={(e) =>

                                    handleTicketChange(

                                      showtimeIndex,

                                      ticketIndex,

                                      "sale_start",

                                      e.target.value

                                    )

                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-2xl
                                    bg-[#111827]
                                    border
                                    border-white/10
                                  "
                                  required
                                />

                              </div>

                              <div>

                                <label
                                  className="
                                    text-sm
                                    text-gray-400
                                    block
                                    mb-2
                                  "
                                >
                                  Thời gian kết thúc bán vé *
                                </label>

                                <input
                                  type="datetime-local"
                                  value={
                                    ticket.sale_end
                                  }
                                  onChange={(e) =>

                                    handleTicketChange(

                                      showtimeIndex,

                                      ticketIndex,

                                      "sale_end",

                                      e.target.value

                                    )

                                  }
                                  className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-2xl
                                    bg-[#111827]
                                    border
                                    border-white/10
                                  "
                                  required
                                />

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

          {/* ADD SHOWTIME */}
          <button
            onClick={addShowtime}
            className="
              mt-8
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-sky-500
              text-black
              font-bold
            "
          >

            <Plus size={20} />

            Thêm suất diễn

          </button>

          {/* SUBMIT */}
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