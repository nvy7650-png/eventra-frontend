import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import OrganizerSidebar
  from "../components/OrganizerSidebar";

export default function OrganizerEventDetail() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [event,
    setEvent] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/events/${id}`
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setEvent(data);

      })
      .catch((err) => {

        console.log(err);

      })
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  const handleCancel =
    async () => {

      const confirmed =
        window.confirm(
          "Bạn có chắc muốn hủy sự kiện?"
        );

      if (!confirmed)
        return;

      try {

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events/${id}/cancel`,

            {
              method: "PUT",
            }

          );

        if (!res.ok) {

          alert(
            "Không thể hủy sự kiện"
          );

          return;

        }

        setEvent({

          ...event,
          status:
            "CANCELLED",

        });

      } catch (err) {

        console.log(err);

      }

    };

  if (loading) {

    return (

      <div className="min-h-screen flex bg-[#050816] text-white">

        <OrganizerSidebar />

        <div className="flex-1 flex items-center justify-center">

          Đang tải...

        </div>

      </div>

    );

  }

  if (!event) {

    return (

      <div className="min-h-screen flex bg-[#050816] text-white">

        <OrganizerSidebar />

        <div className="flex-1 flex items-center justify-center">

          Không tìm thấy sự kiện

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen flex bg-[#050816] text-white">

      <OrganizerSidebar />

      <div className="flex-1">

        <div className="p-10">

          <img
            src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
            alt={event.title}
            className="
              w-full
              h-[350px]
              object-cover
              rounded-3xl
            "
          />

          <div className="mt-8 flex justify-between items-start">

            <div>

              <h1
                className="
                  text-4xl
                  font-black
                "
              >

                {event.title}

              </h1>

              <p className="text-gray-400 mt-3">

                {event.category_name}

              </p>

            </div>

            <div className="flex gap-3">

              {event.status !==
                "CANCELLED" && (

                <button
                  onClick={() =>
                    navigate(
                      `/organizer/event/edit/${event.id}`
                    )
                  }
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-yellow-500
                    text-black
                    font-bold
                  "
                >

                  Sửa

                </button>

              )}

              {event.status ===
                "PENDING" && (

                <button
                  onClick={
                    handleCancel
                  }
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-red-500
                    font-bold
                  "
                >

                  Hủy

                </button>

              )}

            </div>

          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-10">

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  mb-5
                "
              >

                Thông tin sự kiện

              </h2>

              <div className="space-y-4">

                <div>

                  <p className="text-gray-400">

                    Trạng thái

                  </p>

                  <p>

                    {event.status}

                  </p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Địa điểm

                  </p>

                  <p>

                    {event.location}

                  </p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Danh mục

                  </p>

                  <p>

                    {event.category_name}

                  </p>

                </div>

              </div>

            </div>

            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  mb-5
                "
              >

                Mô tả

              </h2>

              <p className="text-gray-300 whitespace-pre-wrap">

                {event.description}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}