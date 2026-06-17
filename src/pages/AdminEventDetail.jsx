import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminEventDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  const [showtimes, setShowtimes] = useState([]);

  const [zones, setZones] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/${id}`
    )
      .then((res) => res.json())
      .then((data) => {

        setEvent(data.event || null);

        setShowtimes(data.showtimes || []);

        setZones(data.zones || []);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  const handleApprove = async () => {

    try {

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/events/${id}/approve`,

        {
          method: "PUT",
        }

      );

      if (!res.ok) {

        alert("Không thể duyệt sự kiện");

        return;

      }

      setEvent({

        ...event,
        status: "APPROVED",

      });

      alert("Duyệt thành công");

    } catch (err) {

      console.log(err);

    }

  };

  const handleCancel = async () => {

    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy sự kiện?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/events/${id}/cancel`,

        {
          method: "PUT",
        }

      );

      if (!res.ok) {

        alert("Không thể hủy sự kiện");

        return;

      }

      setEvent({

        ...event,
        status: "CANCELLED",

      });

      alert("Đã hủy sự kiện");

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex bg-[#050816] text-white">

        <AdminSidebar />

        <div className="flex-1 flex items-center justify-center">

          Đang tải...

        </div>

      </div>

    );

  }

  if (!event) {

    return (

      <div className="min-h-screen flex bg-[#050816] text-white">

        <AdminSidebar />

        <div className="flex-1 flex items-center justify-center">

          Không tìm thấy sự kiện

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen flex bg-[#050816] text-white">

      <AdminSidebar />

      <div className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          {/* BANNER */}

          <div className="relative overflow-hidden rounded-3xl">

            <img
              src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
              alt={event.title}
              className="w-full h-[420px] object-cover"
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/40
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-8
              "
            >

              <p className="text-sky-400 font-semibold">

                {event.category_name}

              </p>

              <h1 className="text-5xl font-black mt-2">

                {event.title}

              </h1>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-3 mt-6">

            <button
              onClick={() => navigate(-1)}
              className="
                px-5 py-3
                rounded-2xl
                bg-white/10
              "
            >
              Quay lại
            </button>

            {event.status === "PENDING" && (

              <button
                onClick={handleApprove}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-green-500
                  text-black
                  font-bold
                "
              >
                Duyệt sự kiện
              </button>

            )}

            {event.status !== "CANCELLED" && (

              <button
                onClick={handleCancel}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-red-500
                  font-bold
                "
              >
                Hủy sự kiện
              </button>

            )}

          </div>

          {/* INFO */}

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <div className="bg-[#0B1120] rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-4">

                Thông tin sự kiện

              </h2>

              <div className="space-y-4">

                <div>

                  <p className="text-gray-400">

                    Trạng thái

                  </p>

                  <p>{event.status}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Địa điểm

                  </p>

                  <p>{event.location}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Danh mục

                  </p>

                  <p>{event.category_name}</p>

                </div>

              </div>

            </div>

            <div className="bg-[#0B1120] rounded-3xl p-6">

              <h2 className="text-xl font-bold mb-4">

                Mô tả

              </h2>

              <p className="text-gray-300 whitespace-pre-wrap">

                {event.description}

              </p>

            </div>

          </div>

          {/* SHOWTIMES */}

          <div className="mt-8">

            <h2 className="text-2xl font-bold mb-4">

              Suất diễn

            </h2>

            <div className="grid lg:grid-cols-2 gap-4">

              {showtimes.map((st) => (

                <div
                  key={st.id}
                  className="
                    bg-[#0B1120]
                    rounded-3xl
                    p-6
                  "
                >

                  <p className="text-gray-400">

                    Bắt đầu

                  </p>

                  <p>

                    {new Date(
                      st.start_time
                    ).toLocaleString("vi-VN")}

                  </p>

                  <p className="text-gray-400 mt-3">

                    Kết thúc

                  </p>

                  <p>

                    {new Date(
                      st.end_time
                    ).toLocaleString("vi-VN")}

                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* ZONES */}

          <div className="mt-8">

            <h2 className="text-2xl font-bold mb-4">

              Hạng vé

            </h2>

            <div className="grid lg:grid-cols-2 gap-4">

              {zones.map((zone) => (

                <div
                  key={zone.id}
                  className="
                    bg-[#0B1120]
                    rounded-3xl
                    p-6
                  "
                >

                  <h3 className="font-bold text-xl">

                    {zone.name}

                  </h3>

                  <p className="text-sky-400 mt-2">

                    {Number(zone.price)
                      .toLocaleString("vi-VN")}đ

                  </p>

                  <p className="mt-3">

                    Loại:
                    {" "}
                    {zone.zone_type}

                  </p>

                  <p>

                    Sức chứa:
                    {" "}
                    {zone.capacity}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}