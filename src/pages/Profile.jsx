import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // State quản lý Modal thông báo (thay thế cho alert)
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success", // "success" | "error"
    title: "",
    message: "",
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/profile/${currentUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
          }),
        }
      );

      const data = await res.json();

      const updatedUser = {
        ...currentUser,
        name: form.name,
        phone: form.phone,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Mở Modal thành công
      setModal({
        isOpen: true,
        type: "success",
        title: "Cập nhật thành công",
        message: data.message || "Thông tin cá nhân của bạn đã được cập nhật thành công!",
      });
    } catch (err) {
      console.log(err);
      // Mở Modal thất bại
      setModal({
        isOpen: true,
        type: "error",
        title: "Có lỗi xảy ra",
        message: "Không thể cập nhật thông tin. Vui lòng kiểm tra lại kết nối và thử lại!",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Header Card */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8 pb-6 border-b border-white/10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-black shadow-lg shadow-sky-500/20">
              {form.name ? form.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Thông tin cá nhân
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Quản lý và cập nhật chi tiết tài khoản của bạn
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-5 sm:space-y-6">
            {/* Họ và tên */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#111827] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-300">
                  Email
                </label>
                <span className="text-[10px] sm:text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
                  Không thể thay đổi
                </span>
              </div>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#111827]/60 border border-white/5 text-gray-400 cursor-not-allowed text-sm sm:text-base"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#111827] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Button Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-2 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm sm:text-base transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <span>Cập nhật thông tin</span>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* MODAL THÔNG BÁO TÙY CHỈNH */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B1220] border border-white/10 w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-6 shadow-2xl text-center transform transition-all scale-100">
            {/* Icon */}
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                modal.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {modal.type === "success" ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-bold text-white mb-2">
              {modal.title}
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              {modal.message}
            </p>

            {/* Modal Action Button */}
            <button
              onClick={closeModal}
              className={`w-full py-3 rounded-xl font-bold text-sm transition duration-200 ${
                modal.type === "success"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                  : "bg-rose-500 hover:bg-rose-400 text-white"
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}