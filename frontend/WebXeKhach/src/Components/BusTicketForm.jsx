import React, { useState, useEffect } from "react";
import "../assets/Css/BusTicketForm.css";
import { useNavigate, Link, useLocation } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));
console.log("User data from localStorage:", user);

const maKH = user?.MaKH || null;
console.log("Customer ID (MaKH):", maKH);

if (!maKH) {
  console.error(
    "Customer ID (MaKH) is missing from the user data. Please check the localStorage."
  );
}

const SEATS = Array.from({ length: 36 }, (_, i) => i + 1);

const seatNumberToLabel = (number) => {
  if (number >= 1 && number <= 18) {
    return `A${number.toString().padStart(2, "0")}`;
  } else if (number >= 19 && number <= 36) {
    return `B${(number - 18).toString().padStart(2, "0")}`;
  }
  return null;
};

const seatLabelToNumber = (label) => {
  if (label.startsWith("A")) {
    return parseInt(label.slice(1), 10);
  } else if (label.startsWith("B")) {
    return 18 + parseInt(label.slice(1), 10);
  }
  return null;
};

const BusTicketForm = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState(new Set());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    start,
    end,
    startPoint,
    endPoint,
    vehicle_number,
    seatsAvailable,
    price,
    trip,
  } = location.state || {};

  console.log("Trip object:", trip);
  const seatPrice = price || 140000;

  if (!location.state) {
    console.warn("No trip data received, redirecting...");
    navigate("/trip-results");
    return null;
  }

  if (!trip) {
    return <div>No trip selected!</div>;
  }

  const handleSeatSelection = (seatNumber) => {
    if (soldSeats.has(seatNumber)) return;
    if (selectedSeats.length >= 10 && !selectedSeats.includes(seatNumber)) {
      alert("Bạn chỉ có thể chọn tối đa 10 ghế.");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  useEffect(() => {
    const fetchSoldSeats = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/sold-seats");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSoldSeats(new Set(data));
      } catch (error) {
        console.error("Error fetching sold seats:", error);
      }
    };
    fetchSoldSeats();
  }, []);

  const getSeatClass = (seatNumber) => {
    if (soldSeats.has(seatNumber)) return "seat sold";
    if (selectedSeats.includes(seatNumber)) return "seat selected";
    return "seat available";
  };

  const totalAmount = selectedSeats.length * seatPrice;

  return (
    <div className="bus-ticket-form">
      <h2>Tuyến xe: TP.HCM - NHA TRANG</h2>
      <p>Ngày đi: 09/10/2024</p>
      <div className="seat-section">
        <h3>Chọn ghế</h3>
        <div className="seat-container">
          {[0, 18].map((offset) => (
            <div className="seat-floor" key={offset}>
              <h4>{offset === 0 ? "Tầng dưới" : "Tầng trên"}</h4>
              <div className="seats">
                {SEATS.slice(offset, offset + 18).map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={getSeatClass(seatNumber)}
                    onClick={() => handleSeatSelection(seatNumber)}
                  >
                    {seatNumberToLabel(seatNumber)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="seat-legend">
            <span className="legend available">Còn trống</span>
            <span className="legend selected">Đang chọn</span>
            <span className="legend sold">Đã bán</span>
          </div>
        </div>
      </div>
      <div className="trip-info">
        <h3>Thông tin lượt đi</h3>
        <p>
          <strong>Tuyến xe:</strong> {startPoint} - {endPoint}
        </p>
        <p>
          <strong>Thời gian xuất bến:</strong>{" "}
          {new Date(start).toLocaleString("vi-VN")}
        </p>
        <p>
          <strong>Thời gian đến:</strong>{" "}
          {new Date(end).toLocaleString("vi-VN")}
        </p>
        <p>
          <strong>Biển số xe:</strong> {vehicle_number || "Không có thông tin"}
        </p>
        <p>
          <strong>Số ghế:</strong>{" "}
          {selectedSeats.map(seatNumberToLabel).join(", ") || "Chưa chọn"}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {totalAmount.toLocaleString("vi-VN")} VND
        </p>
      </div>
      <div className="form-containerBusTicketForm">
        <div className="customer-info">
          <div className="terms-info">
            <h3>Điều khoản và lưu ý</h3>
            <p>
              (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít
              nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán
              vé thành công có chứa mã vé được gửi từ hệ thống Xe Khách Nam Hải
              LINE. Vui lòng liên hệ Trung tâm tổng đài 02843512123 để được hỗ
              trợ.
            </p>
            <p>
              (*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ Tổng
              đài trung chuyển 02843512123 trước khi đặt vé. Chúng tôi không
              đón/trung chuyển tại những điểm xe trung chuyển không thể tới
              được.
            </p>
          </div>
          <label>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            Chấp nhận điều khoản đặt vé
          </label>
        </div>
      </div>
      <Link
        to="/create-payment"
        state={{
          start,
          end,
          startPoint,
          endPoint,
          vehicle_number,
          seatsAvailable,
          trip,
          selectedSeats: selectedSeats.map(seatNumberToLabel),
          seatPrice,
        }}
      >
        <button className="submit-button">Thanh Toán</button>
      </Link>
    </div>
  );
};

export default BusTicketForm;
