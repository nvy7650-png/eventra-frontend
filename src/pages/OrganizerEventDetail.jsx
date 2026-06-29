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

  const [showtimes, setShowtimes] = useState([]);
  const [zones, setZones] = useState([]);

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

        setEvent(data.event || null);
        setShowtimes(data.showtimes || []);
        setZones(data.zones || []);

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

        <div className="ml-80 flex items-center justify-center">

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

          <div className="relative overflow-hidden rounded-3xl">

            <img
              src={`${import.meta.env.VITE_API_URL}${event.image_url}`}
              alt={event.title}
              className="
                w-full
                h-[420px]
                object-cover
              "
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
      flex
      justify-between
      items-end
    "
  >

    <div>

      <p className="text-sky-400 font-semibold mb-2">
        {event.category_name}
      </p>

      <h1 className="text-5xl font-black">
        {event.title}
      </h1>

    </div>

    <div className="flex gap-3">

      {event.status !== "CANCELLED" && (

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

      {event.status === "PENDING" && (

        <button
          onClick={handleCancel}
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

              <div className="grid grid-cols-3 gap-4">

  <div className="bg-[#081018] rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Trạng thái
    </p>

    <p className="font-bold mt-2">
      {event.status}
    </p>
  </div>

  <div className="bg-[#081018] rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Danh mục
    </p>

    <p className="font-bold mt-2">
      {event.category_name}
    </p>
  </div>

  <div className="bg-[#081018] rounded-2xl p-4">
    <p className="text-gray-400 text-sm">
      Địa điểm
    </p>

    <p className="font-bold mt-2">
      {event.location}
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

          <div className="grid lg:grid-cols-2 gap-6 mt-6">

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

                Suất diễn

              </h2>

              <div className="space-y-4">

                {showtimes.length === 0 ? (

                  <p className="text-gray-400">Không có suất diễn</p>

                ) : (

                  showtimes.map((st) => (

                    <div
  key={st.id}
  className="
    bg-gradient-to-r
    from-[#081018]
    to-[#10203A]
    rounded-2xl
    p-5
    border
    border-sky-500/20
    hover:border-sky-400/50
    transition
  "
>
  <div className="flex justify-between items-center">

    <div>

      <p className="text-gray-400 text-sm">
        Ngày diễn
      </p>

      <p className="font-bold text-2xl mt-1">
        {
          new Date(
            st.start_time
          ).toLocaleDateString("vi-VN")
        }
      </p>

    </div>

    <div className="text-right">

      <p className="text-gray-400 text-sm">
        Thời gian
      </p>

      <p className="font-bold text-sky-400 mt-1">
        {
          new Date(
            st.start_time
          ).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        }

        {" - "}

        {
          new Date(
            st.end_time
          ).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        }
      </p>

    </div>

  </div>
</div>

                  ))

                )}

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

                Khu vực & thời gian bán vé

              </h2>

              <div className="space-y-4">

                {zones.length === 0 ? (

                  <p className="text-gray-400">Không có khu vực</p>

                ) : (


                  zones.map((zone) => (

                   <div
                        key={zone.id || zone.name}
                        className="
                          bg-[#081018]
                          rounded-2xl
                          p-5
                          border
                          border-white/5
                        "
                      >

                      <p className="text-gray-400">Tên</p>

                      <p>{zone.name}</p>

                      <p className="text-gray-400 mt-2">Giá</p>

                      <p className="text-sky-400 font-bold text-lg"> {Number(zone.price).toLocaleString("vi-VN")} đ </p>

                      <p className="text-gray-400 mt-2">Loại</p>

                      <p
                        className={`
                          inline-block
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${
                            zone.zone_type === "SEATING"
                              ? "bg-sky-500/20 text-sky-400"
                              : "bg-purple-500/20 text-purple-400"
                          }
                        `}
                      >
                        {zone.zone_type}
                      </p>

                      {zone.zone_type === "STANDING" && (

                        <>

                          <p className="text-gray-400 mt-2">Sức chứa</p>

                          <p>{zone.capacity}</p>

                        </>

                      )}

                      {zone.zone_type === "SEATING" && (

                        <>

                          <p className="text-gray-400 mt-2">Số hàng</p>

                          <p>{zone.total_rows}</p>

                          <p className="text-gray-400 mt-2">Ghế mỗi hàng</p>

                          <p>{zone.seats_per_row}</p>

                        </>

                      )}

                      <p className="text-gray-400 mt-2">Bắt đầu bán</p>

                      <p>{zone.sale_start ? new Date(zone.sale_start).toLocaleString("vi-VN") : zone.sale_start}</p>

                      <p className="text-gray-400 mt-2">Kết thúc bán</p>

                      <p>{zone.sale_end ? new Date(zone.sale_end).toLocaleString("vi-VN") : zone.sale_end}</p>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

  );

}