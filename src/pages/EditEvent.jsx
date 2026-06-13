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

      setFormData({

        title:
          data.title || "",

        description:
          data.description || "",

        location:
          data.location || "",

        category_id:
          data.category_id || "",

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

            body:
              JSON.stringify(
                formData
              ),

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

            <div>

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