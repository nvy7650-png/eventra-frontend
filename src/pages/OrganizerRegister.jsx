import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrganizerRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization_name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await fetch(
      "https://homieticket-backend.onrender.com/api/auth/organizer/register",
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

    alert("Đăng ký organizer thành công!");

    navigate("/organizer/dashboard");

  } catch (err) {

    console.log(err);

    alert("Có lỗi xảy ra");

  }

};

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg">

        {/* BACK */}
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

          <h1 className="text-3xl font-bold text-center text-sky-400 mb-2">
            Đăng ký nhà tổ chức
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Tạo tài khoản Organizer để đăng và quản lý sự kiện
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ORGANIZATION NAME */}
            <input
              type="text"
              name="organization_name"
              placeholder="Tên tổ chức / công ty"
              value={formData.organization_name}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-900
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

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
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

            {/* PHONE */}
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-900
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
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
                focus:outline-none
                focus:border-sky-400
              "
              required
            />


            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full
                py-3
                rounded-xl
                bg-sky-500
                text-black
                font-bold
                hover:bg-sky-400
                transition
              "
            >
              Đăng ký Organizer
            </button>

          </form>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-400 mt-6">

            Đã có tài khoản?{" "}

            <span
              onClick={() => navigate("/login")}
              className="
                text-sky-400
                hover:underline
                cursor-pointer
              "
            >
              Đăng nhập
            </span>

          </p>

        </div>
      </div>
    </div>
  );
}
