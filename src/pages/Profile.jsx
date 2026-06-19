import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

export default function Profile() {

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/profile/${currentUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  }, []);

  const handleSave = async () => {

    try {

      setSaving(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
          }),
        }
      );

      const data =
        await res.json();

      alert(
        data.message ||
          "Cập nhật thành công"
      );

      const updatedUser = {
        ...currentUser,
        name: form.name,
        phone: form.phone,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

    } catch (err) {

      console.log(err);

      alert(
        "Có lỗi xảy ra"
      );

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050816]
          text-white
          flex
          items-center
          justify-center
        "
      >
        Đang tải...
      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      <Navbar />

      <div
        className="
          max-w-3xl
          mx-auto
          px-4
          md:px-6
          py-10
        "
      >

        <div
          className="
            bg-[#0B1220]
            border
            border-white/10
            rounded-3xl
            p-6
            md:p-8
          "
        >

          <h1
            className="
              text-3xl
              font-black
              mb-8
            "
          >
            Thông tin cá nhân
          </h1>

          <div className="space-y-6">

            <div>

              <label
                className="
                  block
                  text-gray-400
                  mb-2
                "
              >
                Họ và tên
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  outline-none
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  text-gray-400
                  mb-2
                "
              >
                Email
              </label>

              <input
                value={form.email}
                disabled
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  text-gray-500
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  text-gray-400
                  mb-2
                "
              >
                Số điện thoại
              </label>

              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  outline-none
                "
              />

            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="
                w-full
                py-4
                rounded-2xl
                bg-sky-500
                hover:bg-sky-400
                text-black
                font-bold
                transition
              "
            >
              {saving
                ? "Đang cập nhật..."
                : "Cập nhật thông tin"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}
