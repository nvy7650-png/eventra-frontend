import { useEffect, useState } from "react";
import OrganizerSidebar from "../components/OrganizerSidebar";

export default function OrganizerRevenue() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [revenues, setRevenues] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/revenue/organizer/${user.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRevenues(
          Array.isArray(data)
            ? data
            : []
        );
      })
      .catch((err) => {
        console.log(err);
        setRevenues([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalRevenue =
    revenues.reduce(
      (sum, item) =>
        sum +
        Number(
          item.revenue || 0
        ),
      0
    );

  const totalSold =
    revenues.reduce(
      (sum, item) =>
        sum +
        Number(
          item.sold_tickets || 0
        ),
      0
    );

  const totalCheckin =
    revenues.reduce(
      (sum, item) =>
        sum +
        Number(
          item.checked_in || 0
        ),
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <OrganizerSidebar />

        <div
          className="
            ml-80
            min-h-screen
            flex
            items-center
            justify-center
          "
        >
          Đang tải doanh thu...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <OrganizerSidebar />

      <div className="ml-80 p-10">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-black">
            Doanh thu
          </h1>

          <p className="text-gray-400 mt-2">
            Thống kê doanh thu các sự kiện
          </p>
        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            className="
              bg-[#0B1120]
              border
              border-white/10
              rounded-3xl
              p-6
            "
          >
            <p className="text-gray-400">
              Tổng doanh thu
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-green-400
                mt-3
              "
            >
              {Number(
                totalRevenue
              ).toLocaleString(
                "vi-VN"
              )}
              đ
            </h2>
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
            <p className="text-gray-400">
              Vé đã bán
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-sky-400
                mt-3
              "
            >
              {totalSold}
            </h2>
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
            <p className="text-gray-400">
              Đã check-in
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-yellow-400
                mt-3
              "
            >
              {totalCheckin}
            </h2>
          </div>

        </div>

        {/* EVENT LIST */}

        <div className="space-y-6">

          {revenues.map((item) => {

            const percent =
              item.sold_tickets &&
              item.total_tickets
                ? Math.round(
                    (item.sold_tickets /
                      item.total_tickets) *
                      100
                  )
                : 0;

            return (
              <div
                key={item.id}
                className="
                  bg-[#0B1120]
                  border
                  border-white/10
                  rounded-3xl
                  p-7
                "
              >
                <div className="flex justify-between items-center mb-6">

                  <h2 className="text-2xl font-bold">
                    {item.title}
                  </h2>

                  <div
                    className="
                      text-green-400
                      font-bold
                      text-2xl
                    "
                  >
                    {Number(
                      item.revenue
                    ).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>

                </div>

                <div className="grid md:grid-cols-4 gap-6">

                  <div>
                    <p className="text-gray-400 text-sm">
                      Vé bán
                    </p>

                    <p className="text-3xl font-bold text-sky-400">
                      {item.sold_tickets}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Check-in
                    </p>

                    <p className="text-3xl font-bold text-yellow-400">
                      {item.checked_in}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Tỷ lệ bán
                    </p>

                    <p className="text-3xl font-bold text-pink-400">
                      {percent}%
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Doanh thu
                    </p>

                    <p className="text-3xl font-bold text-green-400">
                      {Number(
                        item.revenue
                      ).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </p>
                  </div>

                </div>

                <div className="mt-6">
                  <div
                    className="
                      h-3
                      rounded-full
                      bg-white/10
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        h-full
                        bg-sky-500
                      "
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {revenues.length === 0 && (
            <div
              className="
                bg-[#0B1120]
                border
                border-white/10
                rounded-3xl
                p-16
                text-center
              "
            >
              <h2 className="text-3xl font-black mb-3">
                Chưa có doanh thu
              </h2>

              <p className="text-gray-400">
                Các sự kiện bán được vé sẽ xuất hiện tại đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}