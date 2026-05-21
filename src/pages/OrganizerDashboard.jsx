
export default function OrganizerDashboard() {

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="border-b border-gray-800 bg-black">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-sky-400">
              Organizer Dashboard
            </h1>

            <p className="text-sm text-gray-400">
              Quản lý sự kiện và vé
            </p>

          </div>

          <button
            className="
              px-4
              py-2
              rounded-xl
              bg-red-500
              hover:bg-red-400
              transition
              font-semibold
            "
          >
            Đăng xuất
          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 mb-2">
              Tổng sự kiện
            </p>

            <h2 className="text-4xl font-bold text-sky-400">
              0
            </h2>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 mb-2">
              Vé đã bán
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              0
            </h2>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-400 mb-2">
              Doanh thu
            </p>

            <h2 className="text-4xl font-bold text-pink-400">
              0đ
            </h2>

          </div>

        </div>

        {/* ACTION */}
        <div className="mt-10">

          <button
            className="
              px-6
              py-3
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
              transition
            "
          >
            + Tạo sự kiện mới
          </button>

        </div>

      </div>

    </div>
  );
}