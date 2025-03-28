import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/Css/Result.css";

const Result = () => {
  const location = useLocation();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Lấy thông tin chuyến xe (ticketDetails) từ localStorage khi component mount
  useEffect(() => {
    const storedDetails = localStorage.getItem("tripDetails");
    if (storedDetails) {
      setTicketDetails(JSON.parse(storedDetails));
      localStorage.removeItem("tripDetails");
    }
  }, []);

  // Nếu thanh toán thành công (resultCode === "0") và có ticketDetails,
  // gọi API để chèn vé vào database
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const resultCode = query.get("resultCode");

    if (resultCode === "0" && ticketDetails) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      const totalAmount =
        ticketDetails.selectedSeats && ticketDetails.selectedSeats.length > 0
          ? ticketDetails.selectedSeats.length * ticketDetails.seatPrice
          : ticketDetails.price;

      const ticketData = {
        maCX: ticketDetails.trip.MaCX,
        maKH: localUser.MaKH,
        viTriGheNgoi: ticketDetails.selectedSeats,
        giaVe: totalAmount,
        trangThai: "Sold",
        hinhThucThanhToan: "Momo",
        loaiVe: "Tour Du Lich", // hoặc loại vé phù hợp
      };

      fetch("http://localhost:8081/api/insert-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Ticket inserted successfully", data);
          } else {
            console.error("Error inserting ticket:", data);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [location, ticketDetails]);

  // Lấy thông tin khách hàng từ API /api/users
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/users");
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const users = await response.json();
        const localUser = JSON.parse(localStorage.getItem("user"));
        const currentUser = users.find(
          (user) => String(user.MaKH) === String(localUser.MaKH)
        );
        setUserInfo(currentUser);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    if (ticketDetails) {
      fetchUserInfo();
    }
  }, [ticketDetails]);

  if (!ticketDetails) {
    return <div>Đang tải kết quả thanh toán...</div>;
  }

  const totalPayment =
    ticketDetails.selectedSeats && ticketDetails.selectedSeats.length > 0
      ? ticketDetails.selectedSeats.length * ticketDetails.seatPrice
      : ticketDetails.price;

  return (
    <div className="result-page" id="resultPage">
      <h2>Kết quả thanh toán</h2>
      <div className="ticket-info">
        <p>
          <strong>Trạng thái:</strong>{" "}
          {location.search.includes("resultCode=0") ? "Thành công" : "Thất bại"}
        </p>
        <p>
          <strong>Tuyến xe:</strong> {ticketDetails.startPoint} -{" "}
          {ticketDetails.endPoint}
        </p>
        <p>
          <strong>Thời gian bắt đầu:</strong> {ticketDetails.start}
        </p>
        <p>
          <strong>Thời gian kết thúc:</strong> {ticketDetails.end}
        </p>
        <p>
          <strong>Biển số xe:</strong>{" "}
          {ticketDetails.trip && ticketDetails.trip.vehicle_number
            ? ticketDetails.trip.vehicle_number
            : "Không có thông tin"}
        </p>
        <p>
          <strong>Số ghế đã chọn:</strong>{" "}
          {ticketDetails.selectedSeats &&
            ticketDetails.selectedSeats.join(", ")}
        </p>
        <p>
          <strong>Giá vé (mỗi chỗ):</strong> {ticketDetails.seatPrice}₫
        </p>
        <p>
          <strong>Tổng tiền:</strong> {totalPayment.toLocaleString("vi-VN")}₫
        </p>
      </div>

      <div className="customer-info">
        <h3>Thông tin khách hàng</h3>
        {loadingUser ? (
          <p>Đang tải thông tin khách hàng...</p>
        ) : userInfo ? (
          <>
            <p>
              <strong>Họ và Tên:</strong> {userInfo.HoVaTen}
            </p>
            <p>
              <strong>Ngày sinh:</strong>{" "}
              {userInfo.NgaySinh
                ? new Date(userInfo.NgaySinh).toLocaleDateString()
                : "Không có thông tin"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {userInfo.DiaChi}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.Email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userInfo.SDT}
            </p>
          </>
        ) : (
          <p>Không có thông tin khách hàng</p>
        )}
      </div>
    </div>
  );
};

export default Result;
