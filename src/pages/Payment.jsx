import {
  useLocation,
  useParams,
} from "react-router-dom";

export default function Payment() {

  const { orderId } =
    useParams();

  const location =
    useLocation();

  const {
    event,
    showtime,
    zone,
    seats,
    totalPrice,
  } = location.state || {};

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      <div className="max-w-4xl mx-auto py-12 px-6">

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

          <h1 className="text-4xl font-bold text-sky-400 mb-8">
            Thanh toán
          </h1>

          <div className="mb-4">
            Order #{orderId}
          </div>

          <div className="mb-4">
            {event?.title}
          </div>

          <div className="mb-4">
            {zone?.name}
          </div>

          <div className="mb-6">
            {seats?.map((seat) => (
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
            {Number(totalPrice).toLocaleString("vi-VN")}đ
          </div>

        </div>

      </div>

    </div>

  );

}