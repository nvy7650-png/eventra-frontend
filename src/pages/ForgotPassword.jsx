import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function ForgotPassword() {

  const navigate =
    useNavigate();

  // ===========================
  // STEP
  // 1 = EMAIL
  // 2 = OTP
  // 3 = RESET PASSWORD
  // ===========================

  const [step,
    setStep] =
    useState(1);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [success,
    setSuccess] =
    useState("");

  const [form,
    setForm] =
    useState({

      email: "",

      otp: "",

      newPassword: "",

      confirmPassword: "",

    });

  // ===========================
  // INPUT
  // ===========================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };
      // ===========================
  // SEND OTP
  // ===========================

  const handleSendOTP =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      setError("");

      setSuccess("");

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                email:
                  form.email,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          setError(

            data.message ||

            "Không thể gửi OTP."

          );

          return;

        }

        setSuccess(

          data.message

        );

        setStep(2);

      }

      catch (err) {

        console.log(err);

        setError(

          "Không thể kết nối server."

        );

      }

      finally {

        setLoading(false);

      }

    };
      // ===========================
  // VERIFY OTP
  // ===========================

  const handleVerifyOTP =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      setError("");

      setSuccess("");

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                email:
                  form.email,

                otp:
                  form.otp,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          setError(

            data.message ||

            "OTP không hợp lệ."

          );

          return;

        }

        setSuccess(

          data.message

        );

        setStep(3);

      }

      catch (err) {

        console.log(err);

        setError(

          "Không thể kết nối server."

        );

      }

      finally {

        setLoading(false);

      }

    };
      // ===========================
  // RESET PASSWORD
  // ===========================

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      if (
        form.newPassword.length < 6
      ) {

        setError(
          "Mật khẩu phải có ít nhất 6 ký tự."
        );

        return;

      }

      if (

        form.newPassword !==
        form.confirmPassword

      ) {

        setError(
          "Xác nhận mật khẩu không khớp."
        );

        return;

      }

      setLoading(true);

      try {

        const res =
          await fetch(

`${import.meta.env.VITE_API_URL}/api/auth/reset-password`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                email:
                  form.email,

                otp:
                  form.otp,

                newPassword:
                  form.newPassword,

              }),

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          setError(

            data.message ||

            "Không thể đổi mật khẩu."

          );

          return;

        }

        setSuccess(

          data.message

        );

        setTimeout(() => {

          navigate("/login");

        }, 2000);

      }

      catch (err) {

        console.log(err);

        setError(

          "Không thể kết nối server."

        );

      }

      finally {

        setLoading(false);

      }

    };
      return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#050816]
        px-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-[#0B1220]
          border
          border-white/10
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        {/* LOGO */}

        <div className="text-center mb-8">

          <h1
            className="
              text-4xl
              font-black
              text-sky-400
            "
          >

            HOMIETICKET

          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >

            Quên mật khẩu

          </p>

        </div>

        {/* PROGRESS */}

        <div
          className="
            flex
            items-center
            justify-center
            mb-8
          "
        >

          {[1,2,3].map((item)=>(

            <div
              key={item}
              className="
                flex
                items-center
              "
            >

              <div

                className={`
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-bold

                  ${
                    step >= item

                    ? "bg-sky-500 text-black"

                    : "bg-gray-700 text-white"

                  }
                `}

              >

                {item}

              </div>

              {

                item !== 3 && (

                  <div

                    className={`
                      w-12
                      h-1

                      ${
                        step > item

                        ? "bg-sky-500"

                        : "bg-gray-700"

                      }
                    `}

                  />

                )

              }

            </div>

          ))}

        </div>

        {/* SUCCESS */}

        {

          success && (

            <div
              className="
                bg-green-500/10
                border
                border-green-500/30
                text-green-400
                rounded-2xl
                px-4
                py-3
                mb-5
              "
            >

              {success}

            </div>

          )

        }

        {/* ERROR */}

        {

          error && (

            <div
              className="
                bg-red-500/10
                border
                border-red-500/30
                text-red-400
                rounded-2xl
                px-4
                py-3
                mb-5
              "
            >

              {error}

            </div>

          )

        }
                {/* ===========================
            STEP 1
        =========================== */}

        {

          step === 1 && (

            <form
              onSubmit={handleSendOTP}
              className="space-y-5"
            >

              <div>

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    text-gray-400
                  "
                >

                  Email

                </label>

                <input

                  type="email"

                  name="email"

                  value={form.email}

                  onChange={handleChange}

                  placeholder="Nhập email"

                  required

                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#111827]
                    border
                    border-gray-700
                    text-white
                    focus:border-sky-400
                    focus:outline-none
                  "

                />

              </div>

              <button

                type="submit"

                disabled={loading}

                className="
                  w-full
                  py-3
                  rounded-2xl
                  bg-sky-500
                  hover:bg-sky-400
                  disabled:opacity-50
                  text-black
                  font-bold
                "

              >

                {

                  loading

                  ? "Đang gửi..."

                  : "Gửi OTP"

                }

              </button>

            </form>

          )

        }

        {/* ===========================
            STEP 2
        =========================== */}

        {

          step === 2 && (

            <form
              onSubmit={handleVerifyOTP}
              className="space-y-5"
            >

              <div>

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    text-gray-400
                  "
                >

                  Mã OTP

                </label>

                <input

                  type="text"

                  name="otp"

                  value={form.otp}

                  onChange={handleChange}

                  placeholder="Nhập OTP"

                  maxLength={6}

                  required

                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#111827]
                    border
                    border-gray-700
                    text-white
                    text-center
                    tracking-[8px]
                    text-xl
                    font-bold
                    focus:border-sky-400
                    focus:outline-none
                  "

                />

              </div>

              <button

                type="submit"

                disabled={loading}

                className="
                  w-full
                  py-3
                  rounded-2xl
                  bg-sky-500
                  hover:bg-sky-400
                  disabled:opacity-50
                  text-black
                  font-bold
                "

              >

                {

                  loading

                  ? "Đang xác nhận..."

                  : "Xác nhận OTP"

                }

              </button>

            </form>

          )

        }
                {/* ===========================
            STEP 3
        =========================== */}

        {

          step === 3 && (

            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >

              <div>

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    text-gray-400
                  "
                >

                  Mật khẩu mới

                </label>

                <input

                  type="password"

                  name="newPassword"

                  value={form.newPassword}

                  onChange={handleChange}

                  placeholder="Nhập mật khẩu mới"

                  required

                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#111827]
                    border
                    border-gray-700
                    text-white
                    focus:border-sky-400
                    focus:outline-none
                  "

                />

              </div>

              <div>

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    text-gray-400
                  "
                >

                  Xác nhận mật khẩu

                </label>

                <input

                  type="password"

                  name="confirmPassword"

                  value={form.confirmPassword}

                  onChange={handleChange}

                  placeholder="Nhập lại mật khẩu"

                  required

                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-[#111827]
                    border
                    border-gray-700
                    text-white
                    focus:border-sky-400
                    focus:outline-none
                  "

                />

              </div>

              <button

                type="submit"

                disabled={loading}

                className="
                  w-full
                  py-3
                  rounded-2xl
                  bg-sky-500
                  hover:bg-sky-400
                  disabled:opacity-50
                  text-black
                  font-bold
                "

              >

                {

                  loading

                  ? "Đang cập nhật..."

                  : "Đổi mật khẩu"

                }

              </button>

            </form>

          )

        }

        {/* LOGIN */}

        <div
          className="
            mt-8
            text-center
          "
        >

          <button

            onClick={() =>
              navigate("/login")
            }

            className="
              text-sky-400
              hover:text-sky-300
              transition
            "

          >

            ← Quay lại đăng nhập

          </button>

        </div>

      </div>

    </div>

  );

}