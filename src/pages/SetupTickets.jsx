import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";


import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


function SetupTickets() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    eventData,
  } = location.state || {};

if (!eventData) {

  return null;

}

const isManual =
  eventData.seat_mode ===
  "MANUAL";

const [loading,
  setLoading] =
  useState(false);

const [zones,
  setZones] =
  useState([
    {
      name: "VIP",
      price: "",
      rows: "",
      seatsPerRow: "",
       sale_start: null,
  sale_end: null,
    },
  ]);

const [showtimes,
  setShowtimes] =
  useState([
    {
      start_time: null,
      end_time: null,

      tickets: [
        {
          name: "",
          price: "",
          quantity: "",
          sale_start: null,
          sale_end: null,
        },
      ],
    },
  ]);

const addShowtime =
  () => {

    setShowtimes([
      ...showtimes,
      {
        start_time: null,
        end_time: null,

        tickets: [
          {
            name: "",
            price: "",
            quantity: "",
            sale_start: null,
            sale_end: null,
          },
        ],
      },
    ]);

  };

const removeShowtime =
  (index) => {

    const updated =
      [...showtimes];

    updated.splice(
      index,
      1
    );

    setShowtimes(
      updated
    );

  };

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

    setShowtimes(
      updated
    );

  };

const addTicket =
  (
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
      sale_start: null,
      sale_end: null,

    });

    setShowtimes(
      updated
    );

  };

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

    setShowtimes(
      updated
    );

  };

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

    setShowtimes(
      updated
    );

  };

const addZone =
  () => {

    setZones([
      ...zones,
      {
        name: "",
        price: "",
        rows: "",
        seatsPerRow: "",
            sale_start: null,   
            sale_end: null,
      },
    ]);

  };

const removeZone =
  (index) => {

    const updated =
      [...zones];

    updated.splice(
      index,
      1
    );

    setZones(
      updated
    );

  };

const handleZoneChange =
  (
    index,
    field,
    value
  ) => {

    const updated =
      [...zones];

    updated[index][field] =
      value;

    setZones(
      updated
    );

  };

const handleSubmit =
  () => {

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

      if (
        !showtime.start_time ||
        !showtime.end_time
      ) {

        alert(
          `Suất diễn #${i + 1}: Vui lòng nhập đầy đủ thời gian`
        );

        return;

      }

      if (
        startTime <= now
      ) {

        alert(
          `Suất diễn #${i + 1}: Thời gian bắt đầu phải sau hiện tại`
        );

        return;

      }

      if (
        endTime <= startTime
      ) {

        alert(
          `Suất diễn #${i + 1}: Thời gian kết thúc phải sau thời gian bắt đầu`
        );

        return;

      }

if (!isManual) {

  if (
    showtime.tickets
      .length === 0
  ) {

    alert(
      `Suất diễn #${i + 1}: Phải có ít nhất 1 loại vé`
    );

    return;

  }

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

        if (
          saleStart <= now
        ) {

            alert(
              `Loại vé #${j + 1}: Thời gian bắt đầu bán vé phải sau hiện tại`
            );

            return;

          }

          if (
            saleEnd <= saleStart
          ) {

            alert(
              `Loại vé #${j + 1}: Thời gian kết thúc bán vé phải sau thời gian bắt đầu`
            );

            return;

          }

          if (
            saleStart >=
            startTime
          ) {

            alert(
              `Loại vé #${j + 1}: Thời gian bắt đầu bán vé phải trước thời gian bắt đầu sự kiện`
            );

            return;

          }


    if (
      saleEnd >=
      startTime
    ) {

      alert(
        `Loại vé #${j + 1}: Hạn cuối bán vé phải trước thời gian bắt đầu sự kiện`
      );

      return;

    }

  }

}
    }


      if (isManual) {

  for (
    let i = 0;
    i < zones.length;
    i++
  ) {

    const zone =
      zones[i];

    if (
      !zone.name ||
      !zone.price ||
      !zone.rows ||
      !zone.seatsPerRow ||
      !zone.sale_start ||
      !zone.sale_end
    ) {

      alert(
        `Khu vực #${i + 1}: Vui lòng nhập đầy đủ thông tin`
      );

      return;
    }

  }

}

      setLoading(true);

      const formattedShowtimes =
        showtimes.map(
          (showtime) => ({

            ...showtime,

            start_time:
              showtime.start_time?.toISOString(),

            end_time:
              showtime.end_time?.toISOString(),

            tickets:
              showtime.tickets.map(
                (ticket) => ({

                  ...ticket,

                  sale_start:
                    ticket.sale_start?.toISOString(),

                  sale_end:
                    ticket.sale_end?.toISOString(),

                })
              ),

          })
        );
        const formattedZones =
  zones.map(
    (zone) => ({
      ...zone,

      sale_start:
        zone.sale_start?.toISOString(),

      sale_end:
        zone.sale_end?.toISOString(),
    })
  );

      navigate(
        "/organizer/confirm-event",
        {

          state: {
  eventData,
  showtimes:
    formattedShowtimes,
  zones:
    formattedZones,
},

        }
      );

      setLoading(false);

    };
    
return (

<div className="min-h-screen bg-[#050816] text-white p-10">

  {/* HEADER */}
  <div className="mb-10">

    <button
      onClick={() => navigate(-1)}
      className="
        flex
        items-center
        gap-2
        text-gray-400
        hover:text-white
        mb-6
      "
    >

      <ArrowLeft size={18} />

      Quay lại

    </button>

    <h1 className="text-4xl font-black">

      Setup vé & suất diễn

    </h1>

    <p className="text-gray-400 mt-2">

      Bước 2 / 3

    </p>

  </div>

  <div className="space-y-8">

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
                type="button"
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

              <DatePicker
                selected={
                  showtime.start_time
                }
                onChange={(date) =>
                  handleShowtimeChange(
                    showtimeIndex,
                    "start_time",
                    date
                  )
                }
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()}
                placeholderText="Chọn ngày giờ bắt đầu"
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

              <DatePicker
                selected={
                  showtime.end_time
                }
                onChange={(date) =>
                  handleShowtimeChange(
                    showtimeIndex,
                    "end_time",
                    date
                  )
                }
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()}
                placeholderText="Chọn ngày giờ kết thúc"
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

          {/* TICKETS / ZONES */}

          {!isManual ? (

            <div>

              <div className="flex items-center justify-between mb-5">

                <h3 className="text-xl font-bold">

                  Loại vé

                </h3>

                <button
                  type="button"
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

                  <Plus size={18} />

                  Thêm vé

                </button>

              </div>

              <div className="space-y-5">

                {showtime.tickets.map(
                  (
                    ticket,
                    ticketIndex
                  ) => (

                    <div
                      key={ticketIndex}
                      className="
                        border
                        border-white/10
                        rounded-2xl
                        p-5
                        bg-[#111827]
                      "
                    >

                      <div className="flex justify-between mb-4">

                        <h4 className="font-bold">

                          Vé #{ticketIndex + 1}

                        </h4>

                        <button
                          type="button"
                          onClick={() =>
                            removeTicket(
                              showtimeIndex,
                              ticketIndex
                            )
                          }
                        >

                          <Trash2
                            size={18}
                            className="text-red-400"
                          />

                        </button>

                      </div>


                      <div className="grid md:grid-cols-2 gap-4">

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
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
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
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
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
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
                        />

                        <div>

                          <label className="block mb-2">
                            Bắt đầu bán vé
                          </label>

                          <DatePicker
                            selected={ticket.sale_start}
                            onChange={(date) =>
                              handleTicketChange(
                                showtimeIndex,
                                ticketIndex,
                                "sale_start",
                                date
                              )
                            }
                            showTimeSelect
                            dateFormat="dd/MM/yyyy HH:mm"
                            minDate={new Date()}
                            className="
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              bg-[#0B1120]
                              border
                              border-white/10
                            "
                          />

                        </div>

                        <div>

                          <label className="block mb-2">
                            Kết thúc bán vé
                          </label>

                          <DatePicker
                            selected={ticket.sale_end}
                            onChange={(date) =>
                              handleTicketChange(
                                showtimeIndex,
                                ticketIndex,
                                "sale_end",
                                date
                              )
                            }
                            showTimeSelect
                            dateFormat="dd/MM/yyyy HH:mm"
                            minDate={new Date()}
                            className="
                              w-full
                              px-4
                              py-3
                              rounded-xl
                              bg-[#0B1120]
                              border
                              border-white/10
                            "
                          />

                        </div>

                      </div>

                    </div>

                  )

                )}

              </div>

            </div>

          ) : (

            <div>

              <div className="flex items-center justify-between mb-5">

                <h3 className="text-xl font-bold">

                  Loại vé & Khu vực ghế

                </h3>

                <button
                  type="button"
                  onClick={addZone}
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

                  Thêm khu vực

                </button>

              </div>

              <div className="space-y-5">

                {zones.map(
                  (
                    zone,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        border
                        border-white/10
                        rounded-2xl
                        p-5
                        bg-[#111827]
                      "
                    >

                      <div className="flex justify-between mb-4">

                        <h4 className="font-bold">

                          Khu vực #{index + 1}

                        </h4>

                        {zones.length > 1 && (

                          <button
                            type="button"
                            onClick={() =>
                              removeZone(
                                index
                              )
                            }
                          >

                            <Trash2
                              size={18}
                              className="text-red-400"
                            />

                          </button>

                        )}

                      </div>

                      <div className="grid md:grid-cols-2 gap-4">

                        <input
                          type="text"
                          placeholder="Tên khu vực (VIP)"
                          value={zone.name}
                          onChange={(e) =>
                            handleZoneChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
                        />

                        <input
                          type="number"
                          placeholder="Giá vé"
                          value={zone.price}
                          onChange={(e) =>
                            handleZoneChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
                        />

                        <input
                          type="number"
                          placeholder="Số hàng"
                          value={zone.rows}
                          onChange={(e) =>
                            handleZoneChange(
                              index,
                              "rows",
                              e.target.value
                            )
                          }
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
                        />

                        <input
                          type="number"
                          placeholder="Ghế mỗi hàng"
                          value={zone.seatsPerRow}
                          onChange={(e) =>
                            handleZoneChange(
                              index,
                              "seatsPerRow",
                              e.target.value
                            )
                          }
                          className="px-4 py-3 rounded-xl bg-[#0B1120] border border-white/10"
                        />

                       <div>

  <label className="block mb-2">
    Bắt đầu bán vé
  </label>

  <DatePicker
    selected={zone.sale_start}
    onChange={(date) =>
      handleZoneChange(
        index,
        "sale_start",
        date
      )
    }
    showTimeSelect
    dateFormat="dd/MM/yyyy HH:mm"
    minDate={new Date()}
    className="
      w-full
      px-4
      py-3
      rounded-xl
      bg-[#0B1120]
      border
      border-white/10
    "
  />

</div>

<div>

  <label className="block mb-2">
    Kết thúc bán vé
  </label>

  <DatePicker
    selected={zone.sale_end}
    onChange={(date) =>
      handleZoneChange(
        index,
        "sale_end",
        date
      )
    }
    showTimeSelect
    dateFormat="dd/MM/yyyy HH:mm"
    minDate={new Date()}
    className="
      w-full
      px-4
      py-3
      rounded-xl
      bg-[#0B1120]
      border
      border-white/10
    "
  />

</div>

                      </div>

                    </div>

                  )

                )}

              </div>

            </div>

          )}
       </div>

      )

    )}

      {/* ACTIONS */}
      <div className="flex gap-4 mt-8">

        <button
          type="button"
          onClick={addShowtime}
          className="
            flex
            items-center
            gap-2
            px-6
            py-4
            rounded-2xl
            bg-white/10
            hover:bg-white/20
            transition
          "
        >

          <Plus size={20} />

          Thêm suất diễn

        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="
            flex-1
            py-4
            rounded-2xl
            bg-sky-500
            hover:bg-sky-400
            text-black
            font-bold
            text-lg
            transition
          "
        >

          {loading
            ? "Đang xử lý..."
            : "Tiếp tục"}

        </button>

      </div>

    </div>

  </div>

);
}

export default SetupTickets;