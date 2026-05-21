import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

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
            hover:bg-gray-800
            transition
          "
        >
          <span className="text-lg">←</span>

          <span className="text-sm font-medium">
            Quay về trang chủ
          </span>
        </button>

        {/* CARD */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">

          <h1 className="text-2xl font-bold text-center text-sky-400 mb-2">
            Đăng ký tài khoản
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Tạo tài khoản để mua vé và theo dõi sự kiện
          </p>

          {/* FORM */}
          <div className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              placeholder="Họ và tên"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-800
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-800
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
            />

            {/* PHONE */}
            <input
              type="text"
              placeholder="Số điện thoại"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-800
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Mật khẩu"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-gray-800
                border
                border-gray-700
                focus:outline-none
                focus:border-sky-400
              "
            />

            {/* REGISTER BUTTON */}
            <button
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
              Đăng ký
            </button>

          </div>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-400 mt-6">

            Đã có tài khoản?{" "}

            <span
              onClick={() => navigate("/login")}
              className="text-sky-400 cursor-pointer hover:underline"
            >
              Đăng nhập
            </span>

          </p>

        </div>
      </div>
    </div>
  );
}
