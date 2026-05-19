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

          <h1 className="text-2xl font-bold text-center text-sky-400 mb-6">
            Đăng ký tài khoản
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Chọn loại tài khoản bạn muốn tạo
          </p>

          <div className="space-y-4">

            {/* USER */}
            <button
              onClick={() => navigate("/register/user")}
              className="
                w-full
                py-3
                rounded-xl
                bg-sky-500
                text-black
                font-semibold
                hover:bg-sky-400
                transition
              "
            >
              Đăng ký User
            </button>

            {/* ORGANIZER */}
            <button
              onClick={() => navigate("/register/organizer")}
              className="
                w-full
                py-3
                rounded-xl
                border
                border-sky-500
                text-sky-400
                font-semibold
                hover:bg-sky-500
                hover:text-black
                transition
              "
            >
              Đăng ký Organizer
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}