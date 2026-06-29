import { useEffect, useState } from "react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerPromotion() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [events, setEvents] =
  useState([]);

  const [promotions, setPromotions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [showModal, setShowModal] =
  useState(false);

const [form, setForm] =
  useState({
    code: "",
    event_id: "",
    discount_type: "PERCENT",
    discount_value: "",
    quantity: "",
    start_date: "",
    end_date: "",
  });

  
  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/promotions/organizer/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPromotions(
          Array.isArray(data)
            ? data
            : []
        );
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });

  }, []);

  useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`
  )
    .then((res) => res.json())
    .then((data) => {

      console.log("EVENTS", data);

      setEvents(
        Array.isArray(data)
          ? data
          : []
      );
    })
    .catch(console.log);

}, []);

  const createPromotion =
  async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/promotions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            organizer_id:
              user.id,

            event_id:
  form.event_id,

name:
  events.find(
    e =>
      e.id ==
      form.event_id
  )?.title || "",

            code:
              form.code,

            description:
              "",

            discount_type:
              form.discount_type,

            discount_value:
              form.discount_value,

            min_order_value:
              0,

            max_discount:
              null,

            quantity:
              form.quantity,

            start_date:
              form.start_date,

            end_date:
              form.end_date,
          }),
        }
      );

      if (!res.ok) {

        alert(
          "Tạo thất bại"
        );

        return;
      }

      alert(
        "Tạo mã thành công"
      );

      window.location.reload();

    } catch (err) {

      console.log(err);

      alert("Lỗi server");

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "ACTIVE":
        return "bg-green-500/20 text-green-400";

      case "INACTIVE":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <OrganizerSidebar />

        <div
          className="
            ml-80
            min-h-screen
            flex
            items-center
            justify-center
          "
        >
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      <OrganizerSidebar />

      <div className="ml-80 p-10">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-black">
              Khuyến mãi
            </h1>

            <p className="text-gray-400 mt-2">
              Quản lý mã giảm giá
            </p>
          </div>

         <button
  onClick={() =>
    setShowModal(true)
  }
  className="
    px-6
    py-3
    rounded-2xl
    bg-sky-500
    hover:bg-sky-400
    text-black
    font-bold
  "
>
  + Tạo mã
</button>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >
            <p className="text-gray-400">
              Tổng mã
            </p>

            <h2 className="text-4xl font-black text-sky-400 mt-3">
              {promotions.length}
            </h2>
          </div>

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >
            <p className="text-gray-400">
              Đang hoạt động
            </p>

            <h2 className="text-4xl font-black text-green-400 mt-3">
              {
                promotions.filter(
                  p =>
                    p.status === "ACTIVE"
                ).length
              }
            </h2>
          </div>

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >
            <p className="text-gray-400">
              Đã tắt
            </p>

            <h2 className="text-4xl font-black text-red-400 mt-3">
              {
                promotions.filter(
                  p =>
                    p.status === "INACTIVE"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* LIST */}

        <div className="space-y-6">

          {promotions.map((promo) => (

            <div
              key={promo.id}
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    {promo.code}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Giảm
                    {" "}
                    {promo.discount_value}

                    {promo.discount_type ===
                    "PERCENT"
                      ? "%"
                      : "đ"}
                  </p>

                </div>

                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${getStatusColor(
                      promo.status
                    )}
                  `}
                >
                  {promo.status}
                </span>

              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">

                <div>
                  <p className="text-gray-400 text-sm">
                    Đã dùng
                  </p>

                  <p className="text-2xl font-bold">
                    {promo.used_count}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Số lượng
                  </p>

                  <p className="text-2xl font-bold">
                    {promo.quantity}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Hết hạn
                  </p>

                  <p className="text-lg font-semibold">
                    {new Date(
                      promo.end_date
                    ).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>

              </div>

            </div>

          ))}

          {promotions.length === 0 && (

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-16
                text-center
              "
            >

              <h2 className="text-3xl font-black mb-3">
                Chưa có khuyến mãi
              </h2>

              <p className="text-gray-400">
                Tạo mã giảm giá đầu tiên.
              </p>

            </div>

          )}

        </div>

      </div>

{showModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
  >

    <div
      className="
        w-full
        max-w-xl

        bg-[#0B1120]

        border
        border-white/10

        rounded-3xl

        p-8
      "
    >

      <h2 className="text-3xl font-black mb-6">
        Tạo mã giảm giá
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Mã giảm giá"
          className="w-full p-4 rounded-xl bg-white/5"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code:
                e.target.value,
            })
          }
        />

       <select
  className="
    w-full
    p-4
    rounded-xl
    bg-[#131c31]
    border
    border-white/10
    text-white
  "
  value={form.event_id}
  onChange={(e) =>
    setForm({
      ...form,
      event_id: e.target.value,
    })
  }
>
  <option value="">
    Chọn sự kiện
  </option>

  {events.map((event) => (
    <option
      key={event.id}
      value={event.id}
      className="bg-[#131c31]"
    >
      {event.title}
    </option>
  ))}
</select>

        <select
  className="
    w-full
    p-4
    rounded-xl
    bg-[#131c31]
    border
    border-white/10
    text-white
    outline-none
  "
  value={form.discount_type}
  onChange={(e) =>
    setForm({
      ...form,
      discount_type: e.target.value,
    })
  }
>
  <option
    value="PERCENT"
    className="bg-[#131c31]"
  >
    Giảm %
  </option>

  <option
    value="FIXED"
    className="bg-[#131c31]"
  >
    Giảm tiền
  </option>
</select>

        <input
          type="number"
          placeholder="Giá trị giảm"
          className="w-full p-4 rounded-xl bg-white/5"
          value={
            form.discount_value
          }
          onChange={(e) =>
            setForm({
              ...form,
              discount_value:
                e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Số lượng"
          className="w-full p-4 rounded-xl bg-white/5"
          value={
            form.quantity
          }
          onChange={(e) =>
            setForm({
              ...form,
              quantity:
                e.target.value,
            })
          }
        />

        <input
          type="datetime-local"
          className="w-full p-4 rounded-xl bg-white/5"
          value={
            form.start_date
          }
          onChange={(e) =>
            setForm({
              ...form,
              start_date:
                e.target.value,
            })
          }
        />

        <input
          type="datetime-local"
          className="w-full p-4 rounded-xl bg-white/5"
          value={
            form.end_date
          }
          onChange={(e) =>
            setForm({
              ...form,
              end_date:
                e.target.value,
            })
          }
        />

      </div>

      <div className="flex gap-4 mt-8">

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="
            flex-1
            py-4
            rounded-2xl
            bg-white/10
          "
        >
          Hủy
        </button>

        <button
          onClick={
            createPromotion
          }
          className="
            flex-1
            py-4
            rounded-2xl
            bg-sky-500
            text-black
            font-bold
          "
        >
          Tạo mã
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
}