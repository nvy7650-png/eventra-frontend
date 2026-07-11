import { useEffect, useState } from "react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerPromotion() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ==========================
  // STATE
  // ==========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingPromotion, setEditingPromotion] =
    useState(null);

  const [events, setEvents] =
    useState([]);

  const [promotions, setPromotions] =
    useState([]);

  const [form, setForm] =
    useState({
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
      end_date: "",
      status: "ACTIVE",
    });

  // ==========================
  // LOAD DATA
  // ==========================

  useEffect(() => {

    loadPromotions();
    loadEvents();

  }, []);

  const loadPromotions =
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

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  const loadEvents =
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

      } catch (err) {

        console.log(err);

      }

    };

  // ==========================
  // FORM
  // ==========================

  const resetForm = () => {

    setEditingPromotion(null);

    setForm({
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
      end_date: "",
      status: "ACTIVE",
    });

  };

  const openCreateModal = () => {

    resetForm();

    setShowModal(true);

  };

  const openEditModal = (promo) => {

    setEditingPromotion(promo);

    setForm({

      code: promo.code,

      event_id: promo.event_id || "",

      name: promo.name,

      description:
        promo.description || "",

      discount_type:
        promo.discount_type,

      discount_value:
        promo.discount_value,

      min_order_value:
        promo.min_order_value,

      max_discount:
        promo.max_discount || "",

      quantity:
        promo.quantity,

      start_date:
        promo.start_date
          ?.slice(0, 16),

      end_date:
        promo.end_date
          ?.slice(0, 16),

      status:
        promo.status,

    });

    setShowModal(true);

  };
    const closeModal = () => {

    setShowModal(false);

    resetForm();

  };

  // ==========================
  // VALIDATE
  // ==========================

  const validateForm = () => {

    if (!form.code.trim()) {

      alert("Vui lòng nhập mã giảm giá");

      return false;

    }

    if (!form.event_id) {

      alert("Vui lòng chọn sự kiện");

      return false;

    }

    if (
      Number(form.discount_value) <= 0
    ) {

      alert("Giá trị giảm phải lớn hơn 0");

      return false;

    }

    if (
      form.discount_type === "PERCENT" &&
      Number(form.discount_value) > 100
    ) {

      alert("Giảm % không được lớn hơn 100");

      return false;

    }

    if (
      Number(form.quantity) <= 0
    ) {

      alert("Số lượng phải lớn hơn 0");

      return false;

    }

    if (
      new Date(form.end_date) <=
      new Date(form.start_date)
    ) {

      alert(
        "Ngày kết thúc phải lớn hơn ngày bắt đầu"
      );

      return false;

    }

    return true;

  };

  // ==========================
  // CREATE
  // ==========================

  const createPromotion =
    async () => {

      if (!validateForm()) return;

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

                name:
                  events.find(
                    e =>
                      e.id ==
                      form.event_id
                  )?.title || "",

                code:
                  form.code,

                description:
                  form.description,

                discount_type:
                  form.discount_type,

                discount_value:
                  form.discount_value,

                min_order_value:
                  form.min_order_value,

                max_discount:
                  form.max_discount || null,

                quantity:
                  form.quantity,

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
            "Tạo thất bại"
          );

          return;

        }

        await loadPromotions();

        closeModal();

        alert(
          "Tạo mã thành công"
        );

      } catch (err) {

        console.log(err);

        alert("Lỗi server");

      } finally {

        setSaving(false);

      }

    };

  // ==========================
  // UPDATE
  // ==========================

  const updatePromotion =
    async () => {

      if (!validateForm()) return;

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

                name:
                  events.find(
                    e =>
                      e.id ==
                      form.event_id
                  )?.title || "",

                description:
                  form.description,

                discount_type:
                  form.discount_type,

                discount_value:
                  form.discount_value,

                min_order_value:
                  form.min_order_value,

                max_discount:
                  form.max_discount || null,

                quantity:
                  form.quantity,

                start_date:
                  form.start_date,

                end_date:
                  form.end_date,

                status:
                  form.status,

              }),

            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Cập nhật thất bại"
          );

          return;

        }

        await loadPromotions();

        closeModal();

        alert(
          "Cập nhật thành công"
        );

      } catch (err) {

        console.log(err);

        alert("Lỗi server");

      } finally {

        setSaving(false);

      }

    };
      // ==========================
  // HELPERS
  // ==========================

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

  // ==========================
  // LOADING
  // ==========================

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
            text-2xl
            font-bold
          "
        >

          Đang tải...

        </div>

      </div>

    );

  }

  // ==========================
  // JSX
  // ==========================

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      <OrganizerSidebar />

      <div className="ml-80 p-10">

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
              Mã giảm giá
            </h1>

            <p
              className="
                text-gray-400
                mt-2
              "
            >
              Quản lý chương trình
              khuyến mãi cho
              sự kiện của bạn.
            </p>

          </div>

          <button
            onClick={
              openCreateModal
            }
            className="
              px-6
              py-3
              rounded-2xl
              bg-sky-500
              hover:bg-sky-400
              transition
              text-black
              font-bold
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

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >

            <p
              className="
                text-gray-400
              "
            >
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
              {
                promotions.length
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

            <p
              className="
                text-gray-400
              "
            >
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

                  p =>

                    p.status ===
                    "ACTIVE"

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

            <p
              className="
                text-gray-400
              "
            >
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

                  p =>

                    p.status ===
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
                  p-16
                  text-center
                "
              >

                <h2
                  className="
                    text-3xl
                    font-black
                    mb-3
                  "
                >
                  Chưa có mã giảm giá
                </h2>

                <p
                  className="
                    text-gray-400
                  "
                >
                  Hãy tạo mã đầu tiên
                  cho sự kiện.
                </p>

              </div>

            )

          }
          </div>
          {
  promotions.map((promo) => (

    <div
      key={promo.id}
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
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-black
            "
          >
            {promo.code}
          </h2>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            {promo.event_title}
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
                promo.status
              )}
            `}
          >

            {
              promo.status ===
              "ACTIVE"
                ? "Đang hoạt động"
                : "Hết hiệu lực"
            }

          </span>

          <button
            onClick={() =>
              openEditModal(
                promo
              )
            }
            className="
              px-5
              py-2
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
            "
          >

            Sửa

          </button>

        </div>

      </div>

      {/* INFO */}

      <div
        className="
          grid
          md:grid-cols-4
          gap-6
          mt-8
        "
      >

        <div>

          <p
            className="
              text-gray-400
              text-sm
            "
          >
            Giảm giá
          </p>

          <p
            className="
              text-2xl
              font-black
              mt-2
            "
          >

            {promo.discount_value}

            {
              promo.discount_type ===
              "PERCENT"
                ? "%"
                : " đ"
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
              text-2xl
              font-black
              mt-2
            "
          >

            {promo.used_count}
            {" / "}
            {promo.quantity}

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
            {formatDate(
              promo.start_date
            )}
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
            {formatDate(
              promo.end_date
            )}
          </p>

        </div>

      </div>

    </div>

  ))
}

</div>

</div>
  )}