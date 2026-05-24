import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [formData, setFormData] = useState({

    title: "",
    description: "",
    location: "",
    image_url: "",
    start_date: "",
    end_date: "",

  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // CREATE EVENT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const res = await fetch(

        `${import.meta.env.VITE_API_URL}/api/events`,

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            organizer_id: user.id,

            ...formData,

          }),

        }

      );

      const data =
        await res.json();

      if (!res.ok) {

        setMessage(
          data.message ||
          "Tạo sự kiện thất bại"
        );

        setLoading(false);

        return;

      }

      setMessage(
        "Tạo sự kiện thành công"
      );

      setTimeout(() => {

        navigate(
          "/organizer/dashboard"
        );

      }, 1500);

    } catch (err) {

      console.log(err);

      setMessage(
        "Không thể kết nối server"
      );

    }

    setLoading(false);

  };

  return (

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        px-6
        py-10
      "
    >

      <div
        className="
          max-w-3xl
          mx-auto
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          p-8
        "
      >

        {/* TITLE */}
        <div className="mb-8">

          <h1
            className="
              text-4xl
              font-black
              text-sky-400
            "
          >
            Tạo sự kiện mới
          </h1>

          <p className="text-gray-400 mt-2">
            Tạo sự kiện và bắt đầu bán vé
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}
          <div>

            <label className="text-gray-400 text-sm block mb-2">
              Tên sự kiện
            </label>

            <input
              type="text"
              name="title"
              placeholder="Nhập tên sự kiện"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="text-gray-400 text-sm block mb-2">
              Mô tả sự kiện
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Nhập mô tả"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

          </div>

          {/* LOCATION */}
          <div>

            <label className="text-gray-400 text-sm block mb-2">
              Địa điểm
            </label>

            <input
              type="text"
              name="location"
              placeholder="Nhập địa điểm"
              value={formData.location}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
              required
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="text-gray-400 text-sm block mb-2">
              Link ảnh banner
            </label>

            <input
              type="text"
              name="image_url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
            />

          </div>

          {/* DATE */}
          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="text-gray-400 text-sm block mb-2">
                Ngày bắt đầu
              </label>

              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  focus:outline-none
                  focus:border-sky-400
                "
                required
              />

            </div>

            <div>

              <label className="text-gray-400 text-sm block mb-2">
                Ngày kết thúc
              </label>

              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  focus:outline-none
                  focus:border-sky-400
                "
                required
              />

            </div>

          </div>

          {/* MESSAGE */}
          {message && (

            <div
              className="
                bg-sky-500/10
                border
                border-sky-500/30
                text-sky-400
                px-4
                py-3
                rounded-2xl
              "
            >
              {message}
            </div>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              bg-sky-500
              hover:bg-sky-400
              text-black
              font-bold
              text-lg
              transition
            "
          >

            {loading
              ? "Đang tạo..."
              : "Tạo sự kiện"}

          </button>

        </form>

      </div>

    </div>

  );

}