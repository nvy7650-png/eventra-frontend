import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Payment() {

  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`
        );

        const data = await res.json();

        if (!res.ok) {

          alert(
            data.message ||
            "Không tải được đơn hàng"
          );

          return;
        }

        setOrder(data);

      } catch (err) {

        console.log(err);

        alert("Lỗi kết nối server");

      } finally {

        setLoading(false);

      }

    };

    fetchOrder();

  }, [orderId]);

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Đang tải đơn hàng...
      </div>
    );

  }

  if (!order) {

    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Không tìm thấy đơn hàng
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-4xl mx-auto py-12 px-6">

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

          <h1 className="text-4xl font-bold text-sky-400 mb-8">
            Thanh toán
          </h1>

          <div className="mb-4">
            Order #{order.id}
          </div>

          <div className="mb-4">
            {order.event?.title}
          </div>

          <div className="mb-4">
            {order.zone?.name}
          </div>

          <div className="mb-6">

            {order.seats?.map((seat) => (

              <span
                key={seat.id}
                className="
                  inline-block
                  mr-2
                  px-3
                  py-2
                  rounded-lg
                  bg-sky-500
                  text-black
                  font-semibold
                "
              >
                {seat.seat_code}
              </span>

            ))}

          </div>

          <div className="text-3xl font-bold text-sky-400">
            {Number(order.total_price).toLocaleString("vi-VN")}đ

            <button
  onClick={async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${order.id}/pay`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      alert(data.message);

      console.log(data);

    } catch (err) {

      console.log(err);

      alert("Lỗi server");

    }

  }}
  className="
    mt-6
    px-6
    py-3
    rounded-xl
    bg-green-500
    text-black
    font-bold
  "
>
  Thanh toán demo
</button>
          </div>

        </div>

      </div>

    </div>

  );

}