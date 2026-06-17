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

export default function EditEvent() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);

  const [categories,
    setCategories] =
    useState([]);

  const [showtimes, setShowtimes] = useState([]);



  const handleShowtimeChange = (
  index,
  field,
  value
) => {

  const updated = [...showtimes];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setShowtimes(updated);

};

  const [zones, setZones] = useState([]);

  const [formData,
    setFormData] =
    useState({

      title: "",

      description: "",

      location: "",

      category_id: "",

    });


useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/api/events/${id}`
  )
    .then((res) =>
      res.json()
    )

    .then((data) => {

      const event = data.event || {};

        setShowtimes(data.showtimes || []);

        setZones(data.zones || []);

      setFormData({

        title:
          event.title || "",

        description:
          event.description || "",

        location:
          event.location || "",

        category_id:
          event.category_id || "",

      });

    })
    .catch((err) => {

      console.log(err);

    })
    .finally(() => {

      setLoading(false);

    });

}, [id]);

useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/api/categories`
  )
    .then((res) =>
      res.json()
    )
    .then((data) => {

      setCategories(
        data
      );

    })
    .catch((err) => {

      console.log(err);

    });

}, []);

const handleZoneChange = (
  index,
  field,
  value
) => {

  const updated = [...zones];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setZones(updated);

};

const handleChange =
  (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

const handleSubmit =
  async (e) => {

    e.preventDefault();

    setSaving(true);

    try {

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/api/events/${id}`,

          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({
  ...formData,
  showtimes,
  zones,
}),

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Cập nhật thất bại"
        );

        return;

      }

      alert(
        "Cập nhật thành công. Sự kiện đã chuyển về trạng thái chờ duyệt."
      );

      navigate(
        `/organizer/event/${id}`
      );

    } catch (err) {

      console.log(err);

      alert(
        "Lỗi server"
      );

    } finally {

      setSaving(false);

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

  return (

    <div className="min-h-screen flex bg-[#050816] text-white">

      <OrganizerSidebar />

      <div className="flex-1 p-10">

        <div className="max-w-4xl mx-auto bg-[#0B1120] border border-white/10 rounded-3xl overflow-hidden">

          <div className="px-8 py-6 border-b border-white/10 bg-[#081120]">

            <h1 className="text-2xl font-black">Sửa sự kiện</h1>

            <p className="text-gray-400 mt-1">Chỉnh sửa thông tin sự kiện</p>

          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            <div>

              <label className="text-sm text-gray-400 block mb-2">Tiêu đề *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-[#111827] border border-white/10 focus:outline-none focus:border-sky-400"
                required
              />

            </div>

            <div>

              <label className="text-sm text-gray-400 block mb-2">Mô tả</label>

              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-[#111827] border border-white/10 focus:outline-none focus:border-sky-400 resize-none"
              />

            </div>

            <div>

              <label className="text-sm text-gray-400 block mb-2">Địa điểm *</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-[#111827] border border-white/10 focus:outline-none focus:border-sky-400"
                required
              />

            </div>

            <div>

              <label className="text-sm text-gray-400 block mb-2">Danh mục *</label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-[#111827] border border-white/10 focus:outline-none focus:border-sky-400"
                required
              >

                <option value="">Chọn danh mục</option>

                {categories.map((c) => (

                  <option key={c.id} value={c.id}>{c.name}</option>

                ))}

              </select>
            </div>

              <div className="pt-6 border-t border-white/10">

  <h2 className="text-xl font-bold mb-4">
    Suất diễn
  </h2>

  <div className="space-y-4">

    {showtimes.map((st, index) => (

      <div
        key={st.id}
        className="
          bg-[#111827]
          border border-white/10
          rounded-2xl
          p-4
        "
      >

        <div className="font-semibold mb-3">
          Suất diễn #{index + 1}
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="datetime-local"
  value={
    st.start_time?.slice(0,16) || ""
  }
  onChange={(e) =>
    handleShowtimeChange(
      index,
      "start_time",
      e.target.value
    )
  }
            className="
              px-4 py-3
              rounded-xl
              bg-[#0B1120]
              border border-white/10
            "
          />

          <input
                type="datetime-local"
                value={
                  st.end_time
                    ?.slice(0,16) || ""
                }
                onChange={(e) =>
                  handleShowtimeChange(
                    index,
                    "end_time",
                    e.target.value
                  )
                }

            className="
              px-4 py-3
              rounded-xl
              bg-[#0B1120]
              border border-white/10
            "
          />

        </div>

      </div>

    ))}

  </div>
<div className="pt-6 border-t border-white/10">

  <h2 className="text-xl font-bold mb-4">
    Hạng vé
  </h2>

  <div className="space-y-4">

    {zones.map((zone, index) => (

      <div
        key={zone.id}
        className="
          bg-[#111827]
          border border-white/10
          rounded-2xl
          p-5
        "
      >

        <h3 className="font-bold text-lg mb-4">
          {zone.name}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-gray-400 mb-1">
              Giá vé
            </p>

            <input
              value={zone.price}
              onChange={(e) =>
                handleZoneChange(
                  index,
                  "price",
                  e.target.value
                )
              }
              className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#0B1120]
                border border-white/10
              "
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">
              Sức chứa
            </p>

            <input
              value={zone.capacity || ""}
              onChange={(e) =>
    handleZoneChange(
      index,
      "capacity",
      e.target.value
    )
  }
              className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#0B1120]
                border border-white/10
              "
            />
          </div>

        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">

  <div>
    <p className="text-xs text-gray-400 mb-1">
      Bắt đầu bán
    </p>

    <input
      type="datetime-local"
      value={
        zone.sale_start?.slice(0,16) || ""
      }
      onChange={(e) =>
        handleZoneChange(
          index,
          "sale_start",
          e.target.value
        )
      }
      className="
        w-full
        px-4 py-3
        rounded-xl
        bg-[#0B1120]
        border border-white/10
      "
    />
  </div>

  <div>
    <p className="text-xs text-gray-400 mb-1">
      Kết thúc bán
    </p>

    <input
      type="datetime-local"
      value={
        zone.sale_end?.slice(0,16) || ""
      }
      onChange={(e) =>
        handleZoneChange(
          index,
          "sale_end",
          e.target.value
        )
      }
      className="
        w-full
        px-4 py-3
        rounded-xl
        bg-[#0B1120]
        border border-white/10
      "
    />
  </div>

</div>

      </div>

    ))}

  </div>

</div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-lg transition"
              >

                {saving ? "Đang lưu..." : "Lưu thay đổi"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>


  );
}