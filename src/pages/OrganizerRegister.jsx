import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function OrganizerRegister() {

  const navigate = useNavigate();

  const [formData,
    setFormData] =
    useState({

      organization_name: "",
      email: "",
      phone: "",
      password: "",

    });

  const [error,
    setError] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // SUBMIT
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setLoading(true);

      try {

        const res = await fetch(

          `${import.meta.env.VITE_API_URL}/api/auth/organizer/register`,

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(formData),

          }

        );

        const data =
          await res.json();

        // FAIL
        if (!res.ok) {

          setError(

            data.message ||

            "Đăng ký thất bại"

          );

          setLoading(false);

          return;

        }

        // AUTO LOGIN
        localStorage.setItem(

          "user",

          JSON.stringify({

            id:
              data.user?.id,

            name:
              data.user?.name ||

              formData.organization_name,

            email:
              data.user?.email ||

              formData.email,

            role:
              "ORGANIZER",

          })

        );

        // SUCCESS
        navigate(
          "/organizer/dashboard"
        );

      } catch (err) {

        console.log(err);

        setError(
          "Không thể kết nối server"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >

      <div className="w-full max-w-lg">

        {/* BACK */}
        <button
          onClick={() =>
            navigate("/")
          }
          className="
            mb-5
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-[#0B1220]
            border
            border-white/10
            text-gray-300
            hover:border-sky-400
            hover:text-sky-400
            transition
          "
        >

          ← Quay về trang chủ

        </button>

        {/* CARD */}
        <div
          className="
            bg-[#0B1220]
            border
            border-white/10
            rounded-3xl
            p-8
            shadow-2xl
          "
        >

          {/* TITLE */}
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

            <p className="text-gray-400 mt-3">
              Đăng ký tài khoản Organizer
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ORGANIZATION */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  mb-2
                  block
                "
              >
                Tên tổ chức
              </label>

              <input
                type="text"
                name="organization_name"
                placeholder="Tên công ty / tổ chức"
                value={
                  formData.organization_name
                }
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-gray-700
                  text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-sky-400
                  transition
                "
                required
              />

            </div>

            {/* EMAIL */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  mb-2
                  block
                "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={
                  formData.email
                }
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-gray-700
                  text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-sky-400
                  transition
                "
                required
              />

            </div>

            {/* PHONE */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  mb-2
                  block
                "
              >
                Số điện thoại
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={
                  formData.phone
                }
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-gray-700
                  text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-sky-400
                  transition
                "
                required
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                  mb-2
                  block
                "
              >
                Mật khẩu
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Nhập mật khẩu"
                value={
                  formData.password
                }
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-gray-700
                  text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:border-sky-400
                  transition
                "
                required
              />

              {/* SHOW PASSWORD */}
              <button
                type="button"
                onClick={() =>

                  setShowPassword(
                    !showPassword
                  )

                }
                className="
                  mt-3
                  text-sm
                  text-gray-400
                  hover:text-sky-400
                  transition
                "
              >

                {showPassword
                  ? "Ẩn mật khẩu"
                  : "Hiện mật khẩu"}

              </button>

            </div>

            {/* ERROR */}
            {error && (

              <div
                className="
                  bg-red-500/10
                  border
                  border-red-500/30
                  text-red-400
                  text-sm
                  rounded-2xl
                  px-4
                  py-3
                "
              >
                {error}
              </div>

            )}

            {/* BUTTON */}
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
                text-lg
                transition
              "
            >

              {loading
                ? "Đang xử lý..."
                : "Đăng ký Organizer"}

            </button>

          </form>

          {/* LOGIN */}
          <div
            className="
              text-center
              text-sm
              text-gray-500
              mt-8
            "
          >

            Đã có tài khoản?{" "}

            <span
              onClick={() =>
                navigate("/login")
              }
              className="
                text-sky-400
                hover:text-sky-300
                cursor-pointer
                font-semibold
              "
            >
              Đăng nhập
            </span>

          </div>

        </div>

      </div>

    </div>

  );

}