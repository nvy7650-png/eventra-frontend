import {
  useState,
} from "react";

import {
  ChevronRight,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

export default function OrganizerPayment() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      bank_name: "",

      bank_account_name: "",

      bank_account_number: "",

      momo_phone: "",

      zalopay_phone: "",

    });

  // ============================
  // CHANGE
  // ============================

  const handleChange = (
    e
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit =
    async () => {

      // VALIDATE
      if (

        !formData.bank_name ||

        !formData.bank_account_name ||

        !formData.bank_account_number

      ) {

        alert(
          "Vui lòng nhập đầy đủ thông tin ngân hàng"
        );

        return;

      }

      setLoading(true);

      try {

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events/${id}/payment-info`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify(
                formData
              ),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          alert(

            data.message ||
            "Lỗi lưu thông tin thanh toán"

          );

          setLoading(false);

          return;

        }

        alert(
          "Tạo sự kiện thành công 🎉"
        );

        navigate(
          "/organizer/dashboard"
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
            Thông tin thanh toán
          </h1>

          <p
            className="
              text-gray-400
              mt-3
            "
          >
            Hệ thống sẽ dùng thông tin này
            để chuyển doanh thu bán vé.
          </p>

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
                w-full
                bg-sky-400
              "
            />

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">

          {/* BANK */}
          <div
            className="
              bg-[#111827]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <Landmark
                className="
                  text-sky-400
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Tài khoản ngân hàng
              </h2>

            </div>

            <div
              className="
                grid
                md:grid-cols-2
                gap-5
              "
            >

              {/* BANK NAME */}
              <div>

                <label
                  className="
                    text-sm
                    text-gray-400
                    block
                    mb-2
                  "
                >
                  Tên ngân hàng *
                </label>

                <input
                  type="text"
                  name="bank_name"
                  value={
                    formData.bank_name
                  }
                  onChange={
                    handleChange
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

              {/* ACCOUNT NAME */}
              <div>

                <label
                  className="
                    text-sm
                    text-gray-400
                    block
                    mb-2
                  "
                >
                  Tên chủ tài khoản *
                </label>

                <input
                  type="text"
                  name="bank_account_name"
                  value={
                    formData.bank_account_name
                  }
                  onChange={
                    handleChange
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

            {/* ACCOUNT NUMBER */}
            <div className="mt-5">

              <label
                className="
                  text-sm
                  text-gray-400
                  block
                  mb-2
                "
              >
                Số tài khoản *
              </label>

              <input
                type="text"
                name="bank_account_number"
                value={
                  formData.bank_account_number
                }
                onChange={
                  handleChange
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

          {/* EWALLET */}
          <div
            className="
              bg-[#111827]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <Wallet
                className="
                  text-pink-400
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Ví điện tử
              </h2>

            </div>

            <div
              className="
                grid
                md:grid-cols-2
                gap-5
              "
            >

              {/* MOMO */}
              <div>

                <label
                  className="
                    text-sm
                    text-gray-400
                    block
                    mb-2
                  "
                >
                  Số điện thoại MoMo
                </label>

                <input
                  type="text"
                  name="momo_phone"
                  value={
                    formData.momo_phone
                  }
                  onChange={
                    handleChange
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
                />

              </div>

              {/* ZALOPAY */}
              <div>

                <label
                  className="
                    text-sm
                    text-gray-400
                    block
                    mb-2
                  "
                >
                  Số điện thoại ZaloPay
                </label>

                <input
                  type="text"
                  name="zalopay_phone"
                  value={
                    formData.zalopay_phone
                  }
                  onChange={
                    handleChange
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
                />

              </div>

            </div>

          </div>

          {/* NOTE */}
          <div
            className="
              bg-sky-500/10
              border
              border-sky-400/20
              rounded-3xl
              p-5
              text-sm
              text-gray-300
              leading-relaxed
            "
          >

            Hệ thống sẽ xét duyệt sự kiện trước
            khi mở bán chính thức. Organizer
            chịu trách nhiệm về nội dung sự kiện
            và thông tin thanh toán đã cung cấp.

          </div>

          {/* SUBMIT */}
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
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {loading
              ? "Đang hoàn tất..."
              : "Hoàn tất tạo sự kiện"}

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