const handleSubmit =
  async () => {

    // ============================
    // VALIDATE
    // ============================

    const now =
      new Date();

    for (
      let i = 0;
      i < showtimes.length;
      i++
    ) {

      const showtime =
        showtimes[i];

      const startTime =
        new Date(
          showtime.start_time
        );

      const endTime =
        new Date(
          showtime.end_time
        );

      // EMPTY
      if (

        !showtime.start_time ||

        !showtime.end_time

      ) {

        alert(

          `Suất diễn #${i + 1}: Vui lòng nhập đầy đủ thời gian`

        );

        return;

      }

      // EVENT START > NOW
      if (
        startTime <= now
      ) {

        alert(

          `Suất diễn #${i + 1}: Thời gian bắt đầu sự kiện phải sau thời gian hiện tại`

        );

        return;

      }

      // EVENT END > START
      if (
        endTime <= startTime
      ) {

        alert(

          `Suất diễn #${i + 1}: Thời gian kết thúc phải sau thời gian bắt đầu`

        );

        return;

      }

      // NO TICKET
      if (
        showtime.tickets
          .length === 0
      ) {

        alert(

          `Suất diễn #${i + 1}: Phải có ít nhất 1 loại vé`

        );

        return;

      }

      // ============================
      // TICKETS
      // ============================

      for (
        let j = 0;
        j <
        showtime.tickets
          .length;
        j++
      ) {

        const ticket =
          showtime.tickets[j];

        const saleStart =
          new Date(
            ticket.sale_start
          );

        const saleEnd =
          new Date(
            ticket.sale_end
          );

        // EMPTY
        if (

          !ticket.name ||

          !ticket.price ||

          !ticket.quantity ||

          !ticket.sale_start ||

          !ticket.sale_end

        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Vui lòng nhập đầy đủ thông tin`

          );

          return;

        }

        // PRICE
        if (
          Number(
            ticket.price
          ) <= 0
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Giá vé phải lớn hơn 0`

          );

          return;

        }

        // QUANTITY
        if (
          Number(
            ticket.quantity
          ) <= 0
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Số lượng vé phải lớn hơn 0`

          );

          return;

        }

        // SALE START > NOW
        if (
          saleStart <= now
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Thời gian bắt đầu bán vé phải sau thời gian hiện tại`

          );

          return;

        }

        // SALE END > SALE START
        if (
          saleEnd <= saleStart
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Thời gian kết thúc bán vé phải sau thời gian bắt đầu bán vé`

          );

          return;

        }

        // SALE END < EVENT START
        if (
          saleEnd >= startTime
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Hạn cuối bán vé phải trước thời gian bắt đầu sự kiện`

          );

          return;

        }

        // SALE START < EVENT START
        if (
          saleStart >= startTime
        ) {

          alert(

            `Loại vé #${j + 1} - Suất diễn #${i + 1}: Thời gian bắt đầu bán vé phải trước thời gian bắt đầu sự kiện`

          );

          return;

        }

      }

    }

    setLoading(true);

    try {

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/api/events/${id}/tickets`,

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              showtimes,

            }),

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(

          data.message ||
          "Lỗi setup vé"

        );

        setLoading(false);

        return;

      }

      alert(
        "Setup vé thành công"
      );

      // STEP 3
      navigate(

        `/organizer/event/${id}/payment`

      );

    } catch (err) {

      console.log(err);

      alert(
        "Lỗi server"
      );

    }

    setLoading(false);

  };