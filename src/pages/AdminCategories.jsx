import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

export default function AdminCategories() {

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const fetchCategories = () => {

    fetch(
      `${import.meta.env.VITE_API_URL}/api/categories`
    )
      .then((res) => res.json())
      .then((data) => {

        setCategories(data || []);

      })
      .catch(console.log)
      .finally(() => {

        setLoading(false);

      });

  };

  useEffect(() => {

    fetchCategories();

  }, []);

  const handleCreate = async () => {

    if (!name.trim()) {

      alert("Nhập tên danh mục");

      return;

    }

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      setName("");
      setDescription("");

      fetchCategories();

    } catch (err) {

      console.log(err);

    }

  };

  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa danh mục này?"
      );

    if (!confirmDelete)
      return;

    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchCategories();

    } catch (err) {

      console.log(err);

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

    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        flex
      "
    >

      <AdminSidebar />

      <main
        className="
          flex-1
          lg:ml-72
          p-4
          md:p-10
        "
      >

        <div className="mb-8">

          <h1
            className="
              text-3xl
              font-black
            "
          >
            Quản lý danh mục
          </h1>

          <p className="text-gray-400 mt-2">
            Quản lý các danh mục sự kiện
          </p>

        </div>

        {/* THỐNG KÊ */}

        <div
          className="
            bg-sky-500/10
            border
            border-sky-500/20
            rounded-3xl
            p-6
            mb-8
          "
        >

          <p className="text-gray-400">
            Tổng danh mục
          </p>

          <h2
            className="
              text-4xl
              font-black
              text-sky-400
              mt-2
            "
          >
            {categories.length}
          </h2>

        </div>

        {/* THÊM DANH MỤC */}

        <div
          className="
            bg-[#0B1120]
            border
            border-white/10
            rounded-3xl
            p-6
            mb-8
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-5
            "
          >
            Thêm danh mục
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Tên danh mục"
              className="
                w-full
                bg-black/30
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                outline-none
              "
            />

            <textarea
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Mô tả danh mục"
              className="
                w-full
                bg-black/30
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                outline-none
              "
            />

            <button
              onClick={
                handleCreate
              }
              className="
                bg-sky-500
                hover:bg-sky-400
                text-black
                px-5
                py-3
                rounded-xl
                font-bold
              "
            >
              Thêm danh mục
            </button>

          </div>

        </div>

        {/* DANH SÁCH */}

        <div
          className="
            bg-[#0B1120]
            border
            border-white/10
            rounded-3xl
            overflow-hidden
          "
        >

          <div
            className="
              overflow-x-auto
            "
          >

            <table className="w-full">

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                  "
                >

                  <th className="text-left p-4">
                    ID
                  </th>

                  <th className="text-left p-4">
                    Tên danh mục
                  </th>

                  <th className="text-left p-4">
                    Mô tả
                  </th>

                  <th className="text-left p-4">
                    Ngày tạo
                  </th>

                  <th className="text-left p-4">
                    Hành động
                  </th>

                </tr>

              </thead>

              <tbody>

                {categories.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-white/5
                      "
                    >

                      <td className="p-4">
                        {item.id}
                      </td>

                      <td className="p-4 font-semibold">
                        {item.name}
                      </td>

                      <td className="p-4 text-gray-400">
                        {item.description}
                      </td>

                      <td className="p-4">

                        {new Date(
                          item.created_at
                        ).toLocaleDateString(
                          "vi-VN"
                        )}

                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-red-500
                            hover:bg-red-400
                            text-white
                            text-sm
                            font-bold
                          "
                        >
                          Xóa
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>

  );

}
