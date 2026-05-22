import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      // LOGIN FAIL
      if (!res.ok) {

        setError(
          data.message ||
          "Sai email hoặc mật khẩu"
        );

        return;

      }

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ADMIN
      if (data.user.role === "ADMIN") {

        navigate("/admin/dashboard");

      // ORGANIZER
      } else if (
        data.user.role === "ORGANIZER"
      ) {

        navigate("/organizer/dashboard");

      // USER
      } else {

        navigate("/user/dashboard");

      }

    } catch (err) {

      console.log(err);

      setError("Không thể kết nối server");

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
          border-gray-800
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
              tracking-wide
            "
          >
            HOMIETICKET
          </h1>

          <p className="text-gray-400 mt-2">
            Chào mừng quay trở lại
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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
              value={formData.email}
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

            <div
              className="
                flex
                items-center
                justify-between
                mb-2
              "
            >

              <label
                className="
                  text-sm
                  text-gray-400
                "
              >
                Mật khẩu
              </label>

              <button
                type="button"
                className="
                  text-sm
                  text-sky-400
                  hover:text-sky-300
                  transition
                "
              >
                Quên mật khẩu?
              </button>

            </div>

            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
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
            className="
              w-full
              py-3
              rounded-2xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
              text-lg
              transition
            "
          >
            Đăng nhập
          </button>

        </form>

        {/* REGISTER */}
        <div
          className="
            text-center
            text-sm
            text-gray-500
            mt-8
          "
        >

          Chưa có tài khoản?{" "}

          <span
            onClick={() => navigate("/register")}
            className="
              text-sky-400
              hover:text-sky-300
              cursor-pointer
              font-semibold
            "
          >
            Đăng ký ngay
          </span>

        </div>

      </div>

    </div>

  );

}