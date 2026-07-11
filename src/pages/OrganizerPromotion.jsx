import { useEffect, useState } from "react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerPromotion() {

  // =========================
  // USER
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =========================
  // STATE
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingPromotion,
    setEditingPromotion] =
    useState(null);

  const [events, setEvents] =
    useState([]);

  const [promotions,
    setPromotions] =
    useState([]);

  const emptyForm = {

    code: "",

    event_id: "",

    name: "",

    description: "",

    discount_type: "PERCENT",

    discount_value: "",

    min_order_value: 0,

    max_discount: "",

    quantity: "",

    start_date: "",

    end_date: ""

  };

  const [form, setForm] =
    useState(emptyForm);

  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    fetchEvents();

    fetchPromotions();

  }, []);

  // =========================
  // GET EVENTS
  // =========================

  const fetchEvents =
    async () => {

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`

          );

        const data =
          await res.json();

        setEvents(
          Array.isArray(data)
            ? data
            : []
        );

      }

      catch (err) {

        console.log(err);

      }

    };

  // =========================
  // GET PROMOTIONS
  // =========================

  const fetchPromotions =
    async () => {

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/promotions/organizer/${user.id}`

          );

        const data =
          await res.json();

        setPromotions(

          Array.isArray(data)

            ? data

            : []

        );

      }

      catch (err) {

        console.log(err);

      }

      finally {

        setLoading(false);

      }

    };
      // =========================
  // FORM
  // =========================

  const resetForm = () => {

    setEditingPromotion(null);

    setForm(emptyForm);

  };

  const closeModal = () => {

    setShowModal(false);

    resetForm();

  };

  const openCreateModal = () => {

    resetForm();

    setShowModal(true);

  };

  const openEditModal = (
    promotion
  ) => {

    setEditingPromotion(
      promotion
    );

    setForm({

      code:
        promotion.code,

      event_id:
        promotion.event_id || "",

      name:
        promotion.name || "",

      description:
        promotion.description || "",

      discount_type:
        promotion.discount_type,

      discount_value:
        promotion.discount_value,

      min_order_value:
        promotion.min_order_value,

      max_discount:
        promotion.max_discount || "",

      quantity:
        promotion.quantity,

     start_date:
  new Date(promotion.start_date)
    .toISOString()
    .slice(0,16),

end_date:
  new Date(promotion.end_date)
    .toISOString()
    .slice(0,16),
    });

    setShowModal(true);

  };

  // =========================
  // VALIDATE
  // =========================

  const validateForm = () => {

    if (!form.code.trim()) {

      alert(
        "Vui lòng nhập mã giảm giá."
      );

      return false;

    }

    if (!form.event_id) {

      alert(
        "Vui lòng chọn sự kiện."
      );

      return false;

    }

    if (
      Number(
        form.discount_value
      ) <= 0
    ) {

      alert(
        "Giá trị giảm phải lớn hơn 0."
      );

      return false;

    }

    if (

      form.discount_type ===
      "PERCENT"

      &&

      Number(
        form.discount_value
      ) > 100

    ) {

      alert(
        "Giảm % không được lớn hơn 100."
      );

      return false;

    }

    if (

      Number(
        form.quantity
      ) <= 0

    ) {

      alert(
        "Số lượng phải lớn hơn 0."
      );

      return false;

    }

    if (

      new Date(
        form.end_date
      ) <=

      new Date(
        form.start_date
      )

    ) {

      alert(
        "Ngày kết thúc phải lớn hơn ngày bắt đầu."
      );

      return false;

    }

    return true;

  };
    // =========================
  // CREATE PROMOTION
  // =========================

  const createPromotion =
    async () => {

      if (!validateForm())
        return;

      setSaving(true);

      try {

        const res =
          await fetch(

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

                code:
                  form.code
                    .trim()
                    .toUpperCase(),

                name:
                  form.name,

                description:
                  form.description,

                discount_type:
                  form.discount_type,

                discount_value:
                  Number(
                    form.discount_value
                  ),

                min_order_value:
                  Number(
                    form.min_order_value
                  ),

                max_discount:
                  form.max_discount
                    ? Number(
                        form.max_discount
                      )
                    : null,

                quantity:
                  Number(
                    form.quantity
                  ),

                start_date:
                  form.start_date,

                end_date:
                  form.end_date,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Tạo mã thất bại."
          );

          return;

        }

        await fetchPromotions();

        closeModal();

        alert(
          "Tạo mã thành công."
        );

      }

      catch (err) {

        console.log(err);

        alert(
          "Lỗi server."
        );

      }

      finally {

        setSaving(false);

      }

    };

  // =========================
  // UPDATE PROMOTION
  // =========================

  const updatePromotion =
    async () => {

      if (!validateForm())
        return;

      setSaving(true);

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/promotions/${editingPromotion.id}`,

            {

              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                event_id:
                  form.event_id,

                code:
                  form.code
                    .trim()
                    .toUpperCase(),

                name:
                  form.name,

                description:
                  form.description,

                discount_type:
                  form.discount_type,

                discount_value:
                  Number(
                    form.discount_value
                  ),

                min_order_value:
                  Number(
                    form.min_order_value
                  ),

                max_discount:
                  form.max_discount
                    ? Number(
                        form.max_discount
                      )
                    : null,

                quantity:
                  Number(
                    form.quantity
                  ),

                start_date:
                  form.start_date,

                end_date:
                  form.end_date,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Cập nhật thất bại."
          );

          return;

        }

        await fetchPromotions();

        closeModal();

        alert(
          "Cập nhật thành công."
        );

      }

      catch (err) {

        console.log(err);

        alert(
          "Lỗi server."
        );

      }

      finally {

        setSaving(false);

      }

    };
      // =========================
  // HELPERS
  // =========================

  const formatDate = (
    value
  ) => {

    if (!value)
      return "--";

    return new Date(
      value
    ).toLocaleString(
      "vi-VN"
    );

  };

  const getStatusColor = (
    status
  ) => {

    switch (status) {

      case "ACTIVE":

        return `
          bg-green-500/20
          text-green-400
          border
          border-green-500/30
        `;

      case "INACTIVE":

        return `
          bg-red-500/20
          text-red-400
          border
          border-red-500/30
        `;

      default:

        return `
          bg-gray-500/20
          text-gray-300
        `;

    }

  };

  const getDiscountText = (
    promotion
  ) => {

    if (
      promotion.discount_type ===
      "PERCENT"
    ) {

      return `${promotion.discount_value}%`;

    }

    return Number(
      promotion.discount_value
    ).toLocaleString(
      "vi-VN"
    ) + " đ";

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          text-white
        "
      >

        <OrganizerSidebar />

        <div
          className="
            ml-80
            flex
            justify-center
            items-center
            h-screen
            text-2xl
            font-bold
          "
        >

          Đang tải...

        </div>

      </div>

    );

  }

  // =========================
  // JSX
  // =========================

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
      "
    >

      <OrganizerSidebar />

      <div
        className="
          ml-80
          p-10
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-10
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-black
              "
            >

              Quản lý
              Mã giảm giá

            </h1>

            <p
              className="
                text-gray-400
                mt-2
              "
            >

              Tạo và quản lý
              chương trình
              khuyến mãi.

            </p>

          </div>

          <button

            onClick={
              openCreateModal
            }

            className="
              bg-sky-500
              hover:bg-sky-400
              px-6
              py-3
              rounded-2xl
              font-bold
              text-black
              transition
            "

          >

            + Tạo mã

          </button>

        </div>

        {/* STATS */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
            mb-10
          "
        >
                  {/* TOTAL */}

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

            <h2
              className="
                text-4xl
                font-black
                text-sky-400
                mt-4
              "
            >

              {promotions.length}

            </h2>

          </div>

          {/* ACTIVE */}

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

            <h2
              className="
                text-4xl
                font-black
                text-green-400
                mt-4
              "
            >

              {

                promotions.filter(

                  item =>

                    item.status ===
                    "ACTIVE"

                ).length

              }

            </h2>

          </div>

          {/* INACTIVE */}

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

              Hết hiệu lực

            </p>

            <h2
              className="
                text-4xl
                font-black
                text-red-400
                mt-4
              "
            >

              {

                promotions.filter(

                  item =>

                    item.status ===
                    "INACTIVE"

                ).length

              }

            </h2>

          </div>

        </div>

        {/* LIST */}

        <div
          className="
            space-y-6
          "
        >

          {

            promotions.length === 0 && (

              <div
                className="
                  bg-[#0B1120]
                  rounded-3xl
                  border
                  border-white/10
                  py-20
                  text-center
                "
              >

                <h2
                  className="
                    text-3xl
                    font-black
                  "
                >

                  Chưa có mã giảm giá

                </h2>

                <p
                  className="
                    mt-3
                    text-gray-400
                  "
                >

                  Nhấn
                  "Tạo mã"
                  để bắt đầu.

                </p>

              </div>

            )

          }

          {

            promotions.map(

              (promotion) => (
                              <div
                key={promotion.id}
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-7
                  hover:border-sky-500/30
                  transition
                "
              >

                {/* HEADER */}

                <div
                  className="
                    flex
                    justify-between
                    items-start
                    mb-8
                  "
                >

                  <div>

                    <h2
                      className="
                        text-3xl
                        font-black
                      "
                    >

                      {promotion.code}

                    </h2>

                    <p
  className="
    text-gray-400
    mt-2
  "
>

  {promotion.event_title || "Không có sự kiện"}

</p>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-bold
                        ${getStatusColor(
                          promotion.status
                        )}
                      `}
                    >

                      {

                        promotion.status ===
                        "ACTIVE"

                          ? "Đang hoạt động"

                          : "Hết hiệu lực"

                      }

                    </span>

                    <button

                      onClick={() =>
                        openEditModal(
                          promotion
                        )
                      }

                      className="
                        bg-sky-500
                        hover:bg-sky-400
                        text-black
                        font-bold
                        px-5
                        py-2
                        rounded-xl
                        transition
                      "

                    >

                      Sửa

                    </button>

                  </div>

                </div>

                {/* BODY */}

                <div
                  className="
                    grid
                    md:grid-cols-4
                    gap-6
                  "
                >

                  <div>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >

                      Giá trị giảm

                    </p>

                    <p
                      className="
                        mt-2
                        text-2xl
                        font-black
                      "
                    >

                      {

                        getDiscountText(
                          promotion
                        )

                      }

                    </p>

                  </div>

                  <div>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >

                      Đã sử dụng

                    </p>

                    <p
                      className="
                        mt-2
                        text-2xl
                        font-black
                      "
                    >

                      {

                        promotion.used_count

                      }

                      {" / "}

                      {

                        promotion.quantity

                      }

                    </p>

                  </div>

                  <div>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >

                      Bắt đầu

                    </p>

                    <p
                      className="
                        mt-2
                        font-semibold
                      "
                    >

                      {

                        formatDate(
                          promotion.start_date
                        )

                      }

                    </p>

                  </div>

                  <div>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >

                      Kết thúc

                    </p>

                    <p
                      className="
                        mt-2
                        font-semibold
                      "
                    >

                      {

                        formatDate(
                          promotion.end_date
                        )

                      }

                    </p>

                  </div>

                </div>

              </div>

            )

          )}

        </div>
              {/* =========================
          MODAL
      ========================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-6
          "
        >

          <div
            className="
              w-full
              max-w-3xl
              bg-[#0B1120]
              rounded-3xl
              border
              border-white/10
              p-8
              max-h-[90vh]
              overflow-y-auto
            "
          >

            <div
              className="
                flex
                justify-between
                items-center
                mb-8
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                {

                  editingPromotion

                    ? "Chỉnh sửa mã giảm giá"

                    : "Tạo mã giảm giá"

                }

              </h2>

              <button

                onClick={closeModal}

                className="
                  text-3xl
                  text-gray-400
                  hover:text-white
                "

              >

                ×

              </button>

            </div>

            {/* EVENT */}

            <div className="mb-5">

              <label className="block mb-2 font-semibold">

                Sự kiện

              </label>

              <select

                value={form.event_id}

                onChange={(e)=>

                  setForm({

                    ...form,

                    event_id:e.target.value

                  })

                }

                className="
                  w-full
                  rounded-xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  py-3
                "

              >

                <option value="">

                  Chọn sự kiện

                </option>

                {

                  events.map(

                    event=>(

                      <option

                        key={event.id}

                        value={event.id}

                      >

                        {event.title}

                      </option>

                    )

                  )

                }

              </select>

            </div>

            {/* CODE */}

            <div className="mb-5">

              <label className="block mb-2 font-semibold">

                Mã giảm giá

              </label>

              <input

                type="text"

                value={form.code}

                onChange={(e)=>

                  setForm({

                    ...form,

                    code:e.target.value.toUpperCase()

                  })

                }

                className="
                  w-full
                  rounded-xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  py-3
                "

                placeholder="SUMMER2026"

              />

            </div>

            {/* NAME */}

            <div className="mb-5">

              <label className="block mb-2 font-semibold">

                Tên chương trình

              </label>

              <input

                type="text"

                value={form.name}

                onChange={(e)=>

                  setForm({

                    ...form,

                    name:e.target.value

                  })

                }

                className="
                  w-full
                  rounded-xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  py-3
                "

                placeholder="Giảm giá mùa hè"

              />

            </div>

            {/* DESCRIPTION */}

            <div className="mb-6">

              <label className="block mb-2 font-semibold">

                Mô tả

              </label>

              <textarea

                rows={4}

                value={form.description}

                onChange={(e)=>

                  setForm({

                    ...form,

                    description:e.target.value

                  })

                }

                className="
                  w-full
                  rounded-xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  py-3
                "

              />

            </div>
                        {/* DISCOUNT */}

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
                mb-6
              "
            >

              <div>

                <label className="block mb-2 font-semibold">

                  Loại giảm

                </label>

                <select

                  value={form.discount_type}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      discount_type:e.target.value

                    })

                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                  "

                >

                  <option value="PERCENT">

                    Phần trăm (%)

                  </option>

                  <option value="FIXED">

                    Số tiền

                  </option>

                </select>

              </div>

              <div>

                <label className="block mb-2 font-semibold">

                  Giá trị giảm

                </label>

                <input

                  type="number"

                  value={form.discount_value}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      discount_value:e.target.value

                    })

                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                  "

                />

              </div>

            </div>

            {/* ORDER */}

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
                mb-6
              "
            >

              <div>

                <label className="block mb-2 font-semibold">

                  Giá trị đơn tối thiểu

                </label>

                <input

                  type="number"

                  value={form.min_order_value}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      min_order_value:e.target.value

                    })

                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                  "

                />

              </div>

              <div>

                <label className="block mb-2 font-semibold">

                  Giảm tối đa

                </label>

                <input

                  type="number"

                  value={form.max_discount}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      max_discount:e.target.value

                    })

                  }

                  disabled={
                    form.discount_type ===
                    "FIXED"
                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                    disabled:opacity-40
                  "

                />

              </div>

            </div>

            {/* QUANTITY */}

            <div className="mb-6">

              <label className="block mb-2 font-semibold">

                Số lượng sử dụng

              </label>

              <input

                type="number"

                value={form.quantity}

                onChange={(e)=>

                  setForm({

                    ...form,

                    quantity:e.target.value

                  })

                }

                className="
                  w-full
                  rounded-xl
                  bg-[#111827]
                  border
                  border-white/10
                  px-4
                  py-3
                "

              />

            </div>

            {/* DATE */}

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >

              <div>

                <label className="block mb-2 font-semibold">

                  Ngày bắt đầu

                </label>

                <input

                  type="datetime-local"

                  value={form.start_date}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      start_date:e.target.value

                    })

                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                  "

                />

              </div>

              <div>

                <label className="block mb-2 font-semibold">

                  Ngày kết thúc

                </label>

                <input

                  type="datetime-local"

                  value={form.end_date}

                  onChange={(e)=>

                    setForm({

                      ...form,

                      end_date:e.target.value

                    })

                  }

                  className="
                    w-full
                    rounded-xl
                    bg-[#111827]
                    border
                    border-white/10
                    px-4
                    py-3
                  "

                />

              </div>

            </div>
                        {/* ACTION */}

            <div
              className="
                flex
                justify-end
                gap-4
                mt-10
              "
            >

              <button

                type="button"

                onClick={closeModal}

                className="
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-white/10
                  hover:bg-white/10
                  transition
                "

              >

                Hủy

              </button>

              <button

                type="button"

                disabled={saving}

                onClick={() => {

                  if (editingPromotion) {

                    updatePromotion();

                  }

                  else {

                    createPromotion();

                  }

                }}

                className="
                  px-8
                  py-3
                  rounded-xl
                  bg-sky-500
                  hover:bg-sky-400
                  disabled:opacity-50
                  transition
                  text-black
                  font-bold
                "

              >

                {

                  saving

                    ? "Đang lưu..."

                    : editingPromotion

                    ? "Cập nhật"

                    : "Tạo mã"

                }

              </button>

            </div>

          </div>

        </div>
      )}

</div>
    </div>


  );

}

