import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/Css/PaymentBtn.css";

const PaymentBtn = () => {
  const location = useLocation();
  const {
    price,
    start,
    end,
    startPoint,
    endPoint,
    seatsAvailable,
    trip,
    selectedSeats,
    seatPrice,
  } = location.state || {};

  // Lấy thông tin user từ localStorage (chứa MaKH, HoVaTen, Email, SDT, v.v...)
  const localUser = JSON.parse(localStorage.getItem("user"));

  // State để lưu thông tin khách hàng lấy từ API
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState(null);

  // Gọi API /api/users để lấy danh sách khách hàng và lọc ra user hiện tại dựa trên MaKH
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/users");
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const users = await response.json();
        // Ép kiểu MaKH về chuỗi để so sánh
        const currentUser = users.find(
          (user) => String(user.MaKH) === String(localUser.MaKH)
        );
        setUserInfo(currentUser);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [localUser]);

  if (!trip) {
    return (
      <div>Không có dữ liệu chuyến xe. Vui lòng quay lại và chọn chuyến.</div>
    );
  }

  const effectiveSeatPrice = seatPrice || price || 140000;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const totalAmount =
        selectedSeats && selectedSeats.length > 0
          ? selectedSeats.length * effectiveSeatPrice
          : price;

      localStorage.setItem(
        "tripDetails",
        JSON.stringify({
          price,
          start,
          end,
          startPoint,
          endPoint,
          seatsAvailable,
          trip,
          selectedSeats,
          seatPrice: effectiveSeatPrice,
        })
      );

      const response = await axios.post("http://localhost:8081/paymentTest", {
        amount: totalAmount.toString(),
        tripDetails: {
          start,
          end,
          startPoint,
          endPoint,
          seatsAvailable,
          trip,
        },
      });

      const { payUrl } = response.data;
      console.log("Pay URL from backend:", payUrl);
      if (payUrl) {
        setPayUrl(payUrl);
      } else {
        throw new Error("Không nhận được payUrl từ backend");
      }
    } catch (error) {
      console.error(
        "Lỗi:",
        error.response ? error.response.data : error.message
      );
      alert("Không thể tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page" id="paymentPage">
      <h2>Thanh toán chuyến xe</h2>
      <div className="trip-info">
        <p>
          <strong>Điểm đi:</strong> {startPoint}
        </p>
        <p>
          <strong>Điểm đến:</strong> {endPoint}
        </p>
        <p>
          <strong>Thời gian bắt đầu:</strong> {start}
        </p>
        <p>
          <strong>Thời gian kết thúc:</strong> {end}
        </p>
        <p>
          <strong>Biển số xe:</strong>{" "}
          {trip.vehicle_number || "Không có thông tin"}
        </p>
        <p>
          <strong>Số ghế đã chọn:</strong>{" "}
          {selectedSeats && selectedSeats.join(", ")}
        </p>
        <p>
          <strong>Giá vé (mỗi chỗ):</strong> {effectiveSeatPrice}₫
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {(selectedSeats && selectedSeats.length > 0
            ? selectedSeats.length * effectiveSeatPrice
            : price
          ).toLocaleString("vi-VN")}
          ₫
        </p>
      </div>

      <div className="customer-info">
        <h3>Thông tin khách hàng</h3>
        {userInfo ? (
          <>
            {/* <p>
              <strong>Mã khách hàng:</strong> {userInfo.MaKH}
            </p> */}
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
          <p>Đang tải thông tin khách hàng...</p>
        )}
      </div>

      {payUrl ? (
        <a
          href={payUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="payment-btn"
        >
          Thanh toán bằng MoMo
        </a>
      ) : (
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thanh toán bằng MoMo"}
        </button>
      )}
    </div>
  );
};

export default PaymentBtn;
