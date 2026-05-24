import { useState } from "react";
import {
  ImagePlus,
  ChevronRight,
} from "lucide-react";

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
    event_type: "",
    image_url: "",

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

      // SUCCESS
      navigate(
        `/organizer/event/${data.event_id}/setup`
      );

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
          max-w-4xl
          mx-auto
          bg-[#0B1120]
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            px-8
            py-7
            border-b
            border-white/10
            bg-[#081120]
          "
        >

          <p className="text-sky-400 font-semibold mb-2">
            BƯỚC 1 / 4
          </p>

          <h1
            className="
              text-4xl
              font-black
            "
          >
            Tạo sự kiện
          </h1>

          <p className="text-gray-400 mt-2">
            Nhập thông tin cơ bản cho sự kiện
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* EVENT NAME */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Tên sự kiện *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-4
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

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Mô tả sự kiện
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Nhập mô tả sự kiện..."
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-4
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
                resize-none
              "
            />

          </div>

          {/* LOCATION */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Địa chỉ chi tiết *
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-4
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

          {/* EVENT TYPE */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Loại sự kiện *
            </label>

            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-4
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
              required
            >

              <option value="">
                Chọn loại sự kiện
              </option>

              <option value="Concert">
                Concert
              </option>

              <option value="Festival">
                Festival
              </option>

              <option value="Workshop">
                Workshop
              </option>

              <option value="Talkshow">
                Talkshow
              </option>

              <option value="Fan Meeting">
                Fan Meeting
              </option>

              <option value="Sports">
                Thể thao
              </option>

            </select>

          </div>

          {/* IMAGE */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Banner sự kiện
            </label>

            <input
              type="text"
              name="image_url"
              placeholder="Dán link hình ảnh..."
              value={formData.image_url}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-4
                rounded-2xl
                bg-[#111827]
                border
                border-white/10
                focus:outline-none
                focus:border-sky-400
              "
            />

            {/* PREVIEW */}
            {formData.image_url && (

              <div
                className="
                  mt-4
                  rounded-2xl
                  overflow-hidden
                  border
                  border-white/10
                "
              >

                <img
                  src={formData.image_url}
                  alt="preview"
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />

              </div>

            )}

            {!formData.image_url && (

              <div
                className="
                  mt-4
                  h-52
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-gray-500
                "
              >

                <ImagePlus size={40} />

                <p className="mt-3">
                  Preview banner sự kiện
                </p>

              </div>

            )}

          </div>

          {/* MESSAGE */}
          {message && (

            <div
              className="
                bg-red-500/10
                border
                border-red-500/20
                text-red-400
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
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {loading
              ? "Đang tạo..."
              : "Tiếp tục thiết lập vé"}

            {!loading && (
              <ChevronRight size={22} />
            )}

          </button>

        </form>

      </div>

    </div>

  );

}