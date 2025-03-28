import React, { useState, useEffect } from "react";
import "../assets/Css/BusTicketForm.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Trip } from "./BusTicketSelection";

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

const BusTicketForm = ({ dbConnection }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState(new Set());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const {
    start,
    end,
    startPoint,
    endPoint,
    vehicle_number, // nhận thông tin từ state
    seatsAvailable,
    price,
    trip,
  } = location.state || {};
  console.log("Trip object:", trip);

  // Lấy giá vé từ database, nếu không có fallback 140000
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
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatNumber) ? [] : [seatNumber]
    );
  };

  useEffect(() => {
    const fetchSoldSeats = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/sold-seats");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, Details: ${errorData.error}`
          );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Bạn cần chấp nhận điều khoản đặt vé.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    const ticketData = {
      maCX: trip.MaCX,
      maKH: maKH,
      viTriGheNgoi: selectedSeats,
      giaVe: totalAmount,
      trangThai: "Sold",
      hinhThucThanhToan: "Momo",
      loaiVe: "Tour Du Lich",
    };

    try {
      const response = await fetch("http://localhost:8081/api/insert-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Ticket inserted successfully!");
        navigate("/");
      } else {
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <div className="bus-ticket-form">
      <h2>Tuyến xe: TP.HCM - NHA TRANG</h2>
      <p>Ngày đi: 09/10/2024</p>
      <div className="seat-section">
        <h3>Chọn ghế</h3>
        <div className="seat-container">
          <div className="seat-floor">
            <h4>Tầng dưới</h4>
            <div className="seats">
              {SEATS.slice(0, 18).map((seatNumber) => (
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
          <div className="seat-floor">
            <h4>Tầng trên</h4>
            <div className="seats">
              {SEATS.slice(18).map((seatNumber) => (
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
          <strong>Thời gian xuất bến:</strong> {start}
        </p>
        <p>
          <strong>Thời gian đến:</strong> {end}
        </p>
        <p>
          <strong>Biển số xe:</strong> {vehicle_number || "Không có thông tin"}
        </p>
        <p>
          <strong>Số ghế:</strong>{" "}
          {selectedSeats.length > 0
            ? selectedSeats
                .map((seatNumber) => seatNumberToLabel(seatNumber))
                .join(", ")
            : "Chưa chọn"}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {totalAmount.toLocaleString("vi-VN")} VND
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-containerBusTicketForm">
          <div className="customer-info">
            <div className="terms-info">
              <h3>Điều khoản và lưu ý</h3>
              <p>
                (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít
                nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán
                vé thành công có chứa mã vé được gửi từ hệ thống Xe Khách Nam
                Hải LINE. Vui lòng liên hệ Trung tâm tổng đài 02843512123 để
                được hỗ trợ.
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
            customerName: user?.HoVaTen,
            customerEmail: user?.Email,
            customerPhone: user?.SDT,
            selectedSeats:
              selectedSeats.length > 0
                ? selectedSeats.map((seat) => seatNumberToLabel(seat))
                : [],
            seatPrice: seatPrice,
          }}
        >
          <button type="submit" className="submit-button">
            Thanh Toán
          </button>
        </Link>
      </form>
    </div>
  );
};

export default BusTicketForm;
