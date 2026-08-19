import { useState } from "react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  // Nội dung tĩnh cho từng loại Modal
  const modalContents = {
    terms: {
      title: "Điều khoản sử dụng",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-300">
          <p>
            Chào mừng bạn đến với <strong>HOMIETICKET</strong>. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau:
          </p>
          <h4 className="font-semibold text-white text-base">1. Quy định mua vé</h4>
          <p>
            Vé điện tử sẽ được gửi qua Email và có sẵn trong tài khoản ngay sau khi thanh toán thành công. Mỗi vé chỉ có giá trị check-in 01 lần duy nhất.
          </p>
          <h4 className="font-semibold text-white text-base">2. Trách nhiệm người dùng</h4>
          <p>
            Người dùng có trách nhiệm bảo mật thông tin mã QR trên vé. HOMIETICKET không chịu trách nhiệm trong trường hợp khách hàng tự làm lộ mã QR cho bên thứ ba dẫn đến việc vé bị sử dụng trước.
          </p>
          <h4 className="font-semibold text-white text-base">3. Hủy vé & Hoàn tiền</h4>
          <p>
            Tùy thuộc vào chính sách của từng Ban Tổ Chức (BTC) sự kiện, vé đã thanh toán có thể không được hoàn trả ngoại trừ trường hợp sự kiện bị hủy bỏ hoàn toàn từ phía Ban Tổ Chức.
          </p>
        </div>
      ),
    },
    privacy: {
      title: "Chính sách bảo mật",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-300">
          <p>
            HOMIETICKET cam kết bảo vệ thông tin cá nhân của bạn theo các tiêu chuẩn bảo mật hàng đầu.
          </p>
          <h4 className="font-semibold text-white text-base">1. Dữ liệu thu thập</h4>
          <p>
            Chúng tôi thu thập các thông tin bao gồm: Họ tên, Email, Số điện thoại và lịch sử giao dịch nhằm phục vụ mục đích xuất vé và hỗ trợ khách hàng.
          </p>
          <h4 className="font-semibold text-white text-base">2. Mục đích sử dụng</h4>
          <p>
            Thông tin của bạn được dùng để: Xử lý đơn hàng, gửi vé điện tử, xác thực tài khoản và gửi thông báo quan trọng liên quan đến sự kiện bạn đã đăng ký.
          </p>
          <h4 className="font-semibold text-white text-base">3. Cam kết bảo mật</h4>
          <p>
            Tuyệt đối không chia sẻ, bán hoặc trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào ngoài mục đích thanh toán và xử lý đơn hàng.
          </p>
        </div>
      ),
    },
    payment: {
      title: "Chính sách thanh toán",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-300">
          <p>
            HOMIETICKET hỗ trợ nhiều hình thức thanh toán an toàn và tiện lợi:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Chuyển khoản Ngân hàng (QR Code / VietQR):</strong> Hệ thống tự động xác nhận giao dịch trong vòng 1-3 phút.</li>
            <li><strong>Ví điện tử (MoMo, ZaloPay, VNPay):</strong> Thanh toán tức thì qua ứng dụng ví điện tử.</li>
            <li><strong>Thẻ ATM nội địa / Thẻ quốc tế (Visa, Mastercard):</strong> Bảo mật qua cổng thanh toán được mã hóa.</li>
          </ul>
          <h4 className="font-semibold text-white text-base">Lưu ý thanh toán:</h4>
          <p>
            Đơn hàng chưa thanh toán sẽ tự động bị hủy sau <strong>15 phút</strong> để giải phóng giữ chỗ cho người dùng khác.
          </p>
        </div>
      ),
    },
    support: {
      title: "Hỗ trợ khách hàng",
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-300">
          <p>
            Đội ngũ hỗ trợ HOMIETICKET luôn sẵn sàng đồng hành cùng bạn từ <strong>08:00 - 22:00</strong> tất cả các ngày trong tuần (kể cả Lễ, Tết).
          </p>
          <div className="bg-gray-800 p-4 rounded-xl space-y-2">
            <p className="flex items-center gap-2 text-white font-medium">
              <span>📞 Hotline:</span>
              <a href="tel:0903841056" className="text-sky-400 hover:underline">0903 841 056</a>
            </p>
            <p className="flex items-center gap-2 text-white font-medium">
              <span>📧 Email:</span>
              <a href="mailto:support@eventra.vn" className="text-sky-400 hover:underline">support@eventra.vn</a>
            </p>
            <p className="text-gray-400 text-xs">
              📍 Địa chỉ: 285 Cách Mạng Tháng 8, Phường 12, Quận 10, TP.HCM
            </p>
          </div>
          <p>
            Nếu gặp sự cố về vé (không nhận được email vé, trùng mã QR, sai thông tin đặt vé), vui lòng gọi ngay Hotline để được hỗ trợ trực tiếp.
          </p>
        </div>
      ),
    },
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-sky-400 mb-3 tracking-widest">
            HOMIETICKET
          </h2>
          <p className="text-sm leading-6">
            Nền tảng quản lý và bán vé sự kiện hiện đại. Hỗ trợ đặt vé online,
            QR check-in và quản lý sự kiện chuyên nghiệp.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
          <div className="space-y-3 text-sm">
            <a
              href="tel:0903841056"
              className="block hover:text-sky-400 transition"
            >
              📞 0903841056
            </a>
            <a
              href="mailto:support@eventra.vn"
              className="block hover:text-sky-400 transition"
            >
              📧 support@eventra.vn
            </a>
            <p className="leading-6">📍 285 Cách Mạng Tháng 8, Quận 10, TP.HCM</p>
          </div>
        </div>

        {/* POLICY */}
        <div>
          <h3 className="text-white font-semibold mb-4">Chính sách</h3>
          <div className="space-y-3 text-sm">
            <p
              onClick={() => setActiveModal("terms")}
              className="hover:text-sky-400 cursor-pointer transition"
            >
              Điều khoản sử dụng
            </p>
            <p
              onClick={() => setActiveModal("privacy")}
              className="hover:text-sky-400 cursor-pointer transition"
            >
              Chính sách bảo mật
            </p>
            <p
              onClick={() => setActiveModal("payment")}
              className="hover:text-sky-400 cursor-pointer transition"
            >
              Chính sách thanh toán
            </p>
            <p
              onClick={() => setActiveModal("support")}
              className="hover:text-sky-400 cursor-pointer transition"
            >
              Hỗ trợ khách hàng
            </p>
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">Theo dõi chúng tôi</h3>
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
        © {new Date().getFullYear()} HOMIETICKET. All rights reserved.
      </div>

      {/* MODAL CỐ ĐỊNH */}
      {activeModal && modalContents[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            {/* Header Modal */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-sky-400">
                {modalContents[activeModal].title}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content Body Modal (có thanh cuộn nếu dài) */}
            <div className="py-4 overflow-y-auto flex-1 pr-1">
              {modalContents[activeModal].content}
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-gray-800 text-right">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold text-sm transition"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}