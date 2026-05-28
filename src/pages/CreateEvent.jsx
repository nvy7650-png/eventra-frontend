import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  ImagePlus,
  ChevronRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function CreateEvent() {

  const navigate = useNavigate();

  const fileInputRef =
    useRef(null);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // REQUIRED SIZE
  const REQUIRED_WIDTH =
    1600;

  const REQUIRED_HEIGHT =
    900;

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

      image_file: null,

      image_preview: "",

    });

  const [loading,
    setLoading] =
    useState(false);

  const [message,
    setMessage] =
    useState("");

  // ============================
  // GET CATEGORIES
  // ============================
  useEffect(() => {

    fetch(

      `${import.meta.env.VITE_API_URL}/api/categories`

    )

      .then((res) => res.json())

      .then((data) => {

        setCategories(data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // ============================
  // HANDLE CHANGE
  // ============================
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // ============================
  // HANDLE IMAGE
  // ============================
  const handleImageChange = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    // LIMIT SIZE
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setMessage(
        "Ảnh tối đa 5MB"
      );

      fileInputRef.current.value =
        "";

      return;

    }

    const image =
      new Image();

    image.src =
      URL.createObjectURL(file);

    image.onload = () => {

      // CHECK SIZE
      if (

        image.width !==
          REQUIRED_WIDTH ||

        image.height !==
          REQUIRED_HEIGHT

      ) {

        setMessage(

          `Banner phải đúng ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`

        );

        fileInputRef.current.value =
          "";

        return;

      }

      setMessage("");

      setFormData({

        ...formData,

        image_file: file,

        image_preview:
          URL.createObjectURL(file),

      });

    };

  };

  // ============================
  // CREATE EVENT
  // ============================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setMessage("");

      // REQUIRE IMAGE
      if (
        !formData.image_file
      ) {

        setMessage(
          "Banner sự kiện là bắt buộc"
        );

        return;

      }

      setLoading(true);

      try {

        const submitData =
          new FormData();

        submitData.append(
          "organizer_id",
          user.id
        );

        submitData.append(
          "category_id",
          formData.category_id
        );

        submitData.append(
          "title",
          formData.title
        );

        submitData.append(
          "description",
          formData.description
        );

        submitData.append(
          "location",
          formData.location
        );

        submitData.append(
          "seat_mode",
          "MANUAL"
        );

        // IMAGE
        submitData.append(
          "image",
          formData.image_file
        );

        const res =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/events`,

            {

              method: "POST",

              body: submitData,

            }

          );

        const data =
          await res.json();

        // FAIL
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

          `/organizer/event/${data.event_id}/tickets`

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

          {/* STEP */}
          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <div>

              <p
                className="
                  text-sky-400
                  font-semibold
                "
              >
                BƯỚC 1 / 3
              </p>

              <h1
                className="
                  text-4xl
                  font-black
                  mt-2
                "
              >
                Thông tin sự kiện
              </h1>

            </div>

          </div>

          {/* PROGRESS */}
          <div
            className="
              w-full
              h-2
              bg-white/10
              rounded-full
              overflow-hidden
            "
          >

            <div
              className="
                h-full
                w-1/3
                bg-sky-400
              "
            />

          </div>

          <p className="text-gray-400 mt-4">
            Thiết lập thông tin cơ bản cho sự kiện
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* TITLE */}
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
              value={
                formData.description
              }
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
              value={
                formData.location
              }
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

          {/* CATEGORY */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Danh mục *
            </label>

            <select
              name="category_id"
              value={
                formData.category_id
              }
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
                Chọn danh mục
              </option>

              {categories.map(
                (category) => (

                  <option
                    key={category.id}
                    value={category.id}
                  >

                    {category.name}

                  </option>

                )
              )}

            </select>

          </div>

          {/* BANNER */}
          <div>

            <label
              className="
                text-sm
                text-gray-400
                block
                mb-2
              "
            >
              Banner sự kiện *
            </label>

            <label
              className="
                w-full
                aspect-video
                rounded-3xl
                border-2
                border-dashed
                border-white/10
                hover:border-sky-400
                transition
                flex
                flex-col
                items-center
                justify-center
                cursor-pointer
                overflow-hidden
                relative
                bg-[#111827]
              "
            >

              {/* PREVIEW */}
              {formData.image_preview ? (

                <img
                  src={
                    formData.image_preview
                  }
                  alt="preview"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <>

                  <ImagePlus
                    size={52}
                    className="
                      text-gray-500
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-gray-300
                      font-medium
                    "
                  >
                    Upload banner
                  </p>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                  >
                    Bắt buộc:
                    1600x900px
                  </p>

                </>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={
                  handleImageChange
                }
              />

            </label>

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
              : "Tiếp tục setup vé"}

            {!loading && (
              <ChevronRight size={22} />
            )}

          </button>

        </form>

      </div>

    </div>

  );

}