import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Plus,
  Trash2,
  Ticket,
} from "lucide-react";

function SetupTickets() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [loading, setLoading] =
    useState(false);

  const [showtimes, setShowtimes] =
    useState([

      {

        start_time: "",

        end_time: "",

        tickets: [],

      },

    ]);

  // ============================
  // ADD SHOWTIME
  // ============================

  const addShowtime =
    () => {

      setShowtimes([

        ...showtimes,

        {

          start_time: "",

          end_time: "",

          tickets: [],

        },

      ]);

    };

  // ============================
  // REMOVE SHOWTIME
  // ============================

  const removeShowtime =
    (index) => {

      const updated =
        [...showtimes];

      updated.splice(index, 1);

      setShowtimes(updated);

    };

  // ============================
  // HANDLE SHOWTIME
  // ============================

  const handleShowtimeChange =
    (
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
  // ADD TICKET
  // ============================

  const addTicket =
    (showtimeIndex) => {

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

  const removeTicket =
    (
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
  // HANDLE TICKET
  // ============================

  const handleTicketChange =
    (
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
  // SUBMIT
  // ============================

  const handleSubmit =
    async () => {

      const now =
        new Date();

      for (
        let i = 0;
        i < showtimes.length;
        i++
      ) {

        const showtime =
          showtimes[i];

        const startTime =
          new Date(
            showtime.start_time
          );

        const endTime =
          new Date(
            showtime.end_time
          );

        // EMPTY
        if (

          !showtime.start_time ||

          !showtime.end_time

        ) {

          alert(

            `Suất diễn #${i + 1}: Vui lòng nhập đầy đủ thời gian`

          );

          return;

        }

        // EVENT START > NOW
        if (
          startTime <= now
        ) {

          alert(

            `Suất diễn #${i + 1}: Thời gian bắt đầu phải sau hiện tại`

          );

          return;

        }

        // EVENT END > START
        if (
          endTime <= startTime
        ) {

          alert(

            `Suất diễn #${i + 1}: Thời gian kết thúc phải sau thời gian bắt đầu`

          );

          return;

        }

        // NO TICKET
        if (
          showtime.tickets
            .length === 0
        ) {

          alert(

            `Suất diễn #${i + 1}: Phải có ít nhất 1 loại vé`

          );

          return;

        }

        // ============================
        // TICKETS
        // ============================

        for (
          let j = 0;
          j <
          showtime.tickets
            .length;
          j++
        ) {

          const ticket =
            showtime.tickets[j];

          const saleStart =
            new Date(
              ticket.sale_start
            );

          const saleEnd =
            new Date(
              ticket.sale_end
            );

          // EMPTY
          if (

            !ticket.name ||

            !ticket.price ||

            !ticket.quantity ||

            !ticket.sale_start ||

            !ticket.sale_end

          ) {

            alert(

              `Loại vé #${j + 1}: Vui lòng nhập đầy đủ thông tin`

            );

            return;

          }

          // PRICE
          if (
            Number(
              ticket.price
            ) <= 0
          ) {

            alert(

              `Loại vé #${j + 1}: Giá vé phải lớn hơn 0`

            );

            return;

          }

          // QUANTITY
          if (
            Number(
              ticket.quantity
            ) <= 0
          ) {

            alert(

              `Loại vé #${j + 1}: Số lượng vé phải lớn hơn 0`

            );

            return;

          }

          // SALE START > NOW
          if (
            saleStart <= now
          ) {

            alert(

              `Loại vé #${j + 1}: Thời gian bắt đầu bán vé phải sau hiện tại`

            );

            return;

          }

          // SALE END > SALE START
          if (
            saleEnd <= saleStart
          ) {

            alert(

              `Loại vé #${j + 1}: Thời gian kết thúc bán vé phải sau thời gian bắt đầu`

            );

            return;

          }

          // SALE START < EVENT START
          if (
            saleStart >= startTime
          ) {

            alert(

              `Loại vé #${j + 1}: Thời gian bắt đầu bán vé phải trước thời gian bắt đầu sự kiện`

            );

            return;

          }

          // SALE END < EVENT START
          if (
            saleEnd >= startTime
          ) {

            alert(

              `Loại vé #${j + 1}: Hạn cuối bán vé phải trước thời gian bắt đầu sự kiện`

            );

            return;

          }

        }

      }

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

              body:
                JSON.stringify({

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

        alert(
          "Setup vé thành công"
        );

        // STEP 3
        navigate(

          `/organizer/event/${id}/payment`

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

    <div className="min-h-screen bg-[#050816] text-white p-10">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-black">

          Setup vé & suất diễn

        </h1>

        <p className="text-gray-400 mt-2">

          Bước 2/3

        </p>

      </div>

      {/* SHOWTIMES */}
      <div className="space-y-10">

        {showtimes.map(

          (
            showtime,
            showtimeIndex
          ) => (

            <div
              key={showtimeIndex}
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-8
              "
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-8">

                <h2 className="text-2xl font-bold">

                  Suất diễn #
                  {showtimeIndex + 1}

                </h2>

                {showtimes.length > 1 && (

                  <button
                    onClick={() =>
                      removeShowtime(
                        showtimeIndex
                      )
                    }
                    className="
                      p-3
                      rounded-xl
                      bg-red-500/20
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                )}

              </div>

              {/* TIME */}
              <div className="grid md:grid-cols-2 gap-5 mb-8">

                <div>

                  <label className="block mb-2">

                    Thời gian bắt đầu

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
                      py-3
                      rounded-2xl
                      bg-[#111827]
                      border
                      border-white/10
                    "
                  />

                </div>

                <div>

                  <label className="block mb-2">

                    Thời gian kết thúc

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
                      py-3
                      rounded-2xl
                      bg-[#111827]
                      border
                      border-white/10
                    "
                  />

                </div>

              </div>

              {/* TICKETS */}
              <div className="space-y-5">

                {showtime.tickets.map(

                  (
                    ticket,
                    ticketIndex
                  ) => (

                    <div
                      key={ticketIndex}
                      className="
                        bg-black/30
                        border
                        border-white/10
                        rounded-2xl
                        p-6
                      "
                    >

                      <div className="flex justify-between mb-5">

                        <h3 className="font-bold">

                          Loại vé #
                          {ticketIndex + 1}

                        </h3>

                        <button
                          onClick={() =>
                            removeTicket(
                              showtimeIndex,
                              ticketIndex
                            )
                          }
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

                      <div className="grid md:grid-cols-2 gap-5">

                        <input
                          type="text"
                          placeholder="Tên vé"
                          value={ticket.name}
                          onChange={(e) =>
                            handleTicketChange(
                              showtimeIndex,
                              ticketIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
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
                              showtimeIndex,
                              ticketIndex,
                              "price",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
                            rounded-2xl
                            bg-[#111827]
                            border
                            border-white/10
                          "
                        />

                        <input
                          type="number"
                          placeholder="Số lượng vé"
                          value={ticket.quantity}
                          onChange={(e) =>
                            handleTicketChange(
                              showtimeIndex,
                              ticketIndex,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
                            rounded-2xl
                            bg-[#111827]
                            border
                            border-white/10
                          "
                        />

                        <div />

                        <input
                          type="datetime-local"
                          value={ticket.sale_start}
                          onChange={(e) =>
                            handleTicketChange(
                              showtimeIndex,
                              ticketIndex,
                              "sale_start",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
                            rounded-2xl
                            bg-[#111827]
                            border
                            border-white/10
                          "
                        />

                        <input
                          type="datetime-local"
                          value={ticket.sale_end}
                          onChange={(e) =>
                            handleTicketChange(
                              showtimeIndex,
                              ticketIndex,
                              "sale_end",
                              e.target.value
                            )
                          }
                          className="
                            px-4
                            py-3
                            rounded-2xl
                            bg-[#111827]
                            border
                            border-white/10
                          "
                        />

                      </div>

                    </div>

                  )

                )}

                {/* ADD TICKET */}
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
                    px-5
                    py-3
                    rounded-2xl
                    bg-sky-500
                    text-black
                    font-bold
                  "
                >

                  <Plus size={18} />

                  Tạo loại vé

                </button>

              </div>

            </div>

          )

        )}

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-10">

        <button
          onClick={addShowtime}
          className="
            px-6
            py-4
            rounded-2xl
            bg-white/10
          "
        >

          Thêm suất diễn

        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            px-8
            py-4
            rounded-2xl
            bg-sky-500
            text-black
            font-bold
          "
        >

          {loading
            ? "Đang xử lý..."
            : "Tiếp tục bước 3"}

        </button>

      </div>

    </div>

  );

}

export default SetupTickets;