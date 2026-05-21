import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

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

      console.log(data);

      // LOGIN FAIL
      if (!res.ok) {

        setError(data.message);

        return;

      }

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ORGANIZER
      if (data.user.role === "ORGANIZER") {

        navigate("/organizer/dashboard");

      } else {

        navigate("/");

      }

    } catch (err) {

      console.log(err);

      setError("Không thể kết nối server");

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-xl">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-sky-500 mb-2">
          Đăng nhập
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Chào mừng quay trở lại
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
              border
              border-gray-300
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
              border
              border-gray-300
              focus:outline-none
              focus:border-sky-400
            "
            required
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm font-medium">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
              text-white
              font-bold
              transition
            "
          >
            Đăng nhập
          </button>

        </form>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">

          Chưa có tài khoản?{" "}

          <span
            onClick={() => navigate("/register")}
            className="
              text-sky-500
              hover:underline
              cursor-pointer
            "
          >
            Đăng ký
          </span>

        </p>

      </div>

    </div>

  );

}