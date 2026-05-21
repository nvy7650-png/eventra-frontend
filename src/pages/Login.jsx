import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

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

        setError(data.message || "Đăng nhập thất bại");

        setLoading(false);

        return;

      }

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // REDIRECT
      if (data.user.role === "ORGANIZER") {

        navigate("/organizer/dashboard");

      } else {

        navigate("/");

      }

    } catch (err) {

      console.log(err);

      setError("Không thể kết nối server");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="
            mb-4
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-xl
            bg-gray-900
            border
            border-gray-800
            text-gray-300
            hover:border-sky-400
            hover:text-sky-400
            transition
          "
        >
          ← Quay về trang chủ
        </button>

        {/* CARD */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center text-sky-400 mb-2">
            Đăng nhập
          </h1>

          <p className="text-center text-gray-400 mb-8">
            Chào mừng quay trở lại HomieTicket
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-900
                border
                border-gray-700
                text-white
                placeholder-gray-500
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-900
                border
                border-gray-700
                text-white
                placeholder-gray-500
                focus:outline-none
                focus:border-sky-400
              "
              required
            />


            {/* ERROR */}
            {error && (
              <div
                className="
                  bg-red-500/10
                  border
                  border-red-500/30
                  text-red-400
                  text-sm
                  rounded-xl
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
                rounded-xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
            </button>

          </form>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-400 mt-6">

            Chưa có tài khoản?{" "}

            <span
              onClick={() => navigate("/register")}
              className="
                text-sky-400
                hover:underline
                cursor-pointer
              "
            >
              Đăng ký
            </span>

          </p>
          
            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">

              <button
                type="button"
                className="
                  text-sm
                  text-sky-400
                  hover:underline
                "
              >
                Quên mật khẩu?
              </button>

            </div>

        </div>

      </div>

    </div>

  );

}