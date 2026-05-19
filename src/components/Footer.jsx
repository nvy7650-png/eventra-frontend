export default function Footer() {

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>

          <h2 className="text-2xl font-bold text-sky-400 mb-3 tracking-widest">
            EVENTRA
          </h2>

          <p className="text-sm leading-6">
            Nền tảng quản lý và bán vé sự kiện hiện đại.
            Hỗ trợ đặt vé online, QR check-in và quản lý sự kiện chuyên nghiệp.
          </p>

        </div>
{/* CONTACT */}
<div>

  <h3 className="text-white font-semibold mb-4">
    Liên hệ
  </h3>

  <div className="space-y-3 text-sm">

    <a
      href="tel:19001234"
      className="block hover:text-sky-400 transition"
    >
      📞 1900 1234
    </a>

    <a
      href="mailto:support@eventra.vn"
      className="block hover:text-sky-400 transition"
    >
      📧 support@eventra.vn
    </a>

    <p className="leading-6">
      📍 285 Cách Mạng Tháng 8,
      Quận 10, TP.HCM
    </p>

  </div>

</div>

        {/* POLICY */}
        <div>

          <h3 className="text-white font-semibold mb-4">
            Chính sách
          </h3>

          <div className="space-y-3 text-sm">

            <p className="hover:text-sky-400 cursor-pointer transition">
              Điều khoản sử dụng
            </p>

            <p className="hover:text-sky-400 cursor-pointer transition">
              Chính sách bảo mật
            </p>

            <p className="hover:text-sky-400 cursor-pointer transition">
              Chính sách thanh toán
            </p>

            <p className="hover:text-sky-400 cursor-pointer transition">
              Hỗ trợ khách hàng
            </p>

          </div>

        </div>

        {/* SOCIAL */}
        <div>

          <h3 className="text-white font-semibold mb-4">
            Theo dõi chúng tôi
          </h3>

          <div className="flex gap-4 text-2xl">

            <span className="hover:text-sky-400 cursor-pointer transition">
              🌐
            </span>

            <span className="hover:text-sky-400 cursor-pointer transition">
              📘
            </span>

            <span className="hover:text-sky-400 cursor-pointer transition">
              📸
            </span>

            <span className="hover:text-sky-400 cursor-pointer transition">
              🎵
            </span>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">

        © {new Date().getFullYear()} EVENTRA. All rights reserved.

      </div>

    </footer>
  );
}