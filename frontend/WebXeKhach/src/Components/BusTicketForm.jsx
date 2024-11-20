import React, { useState,useEffect } from "react";
import "../assets/Css/BusTicketForm.css";
import { useNavigate,Link,useLocation } from "react-router-dom";
import { Trip } from "./BusTicketSelection";

const user = JSON.parse(localStorage.getItem('user'));
console.log("User data from localStorage:", user); // Log the whole object

// Access MaKH correctly (case-sensitive)
const maKH = user?.MaKH || null;  // Access MaKH exactly as it's stored in the user object
console.log("Customer ID (MaKH):", maKH);  // This should now correctly output the value or null if not found

if (!maKH) {
  console.error("Customer ID (MaKH) is missing from the user data. Please check the localStorage.");
}






const SEATS = Array.from({ length: 36 }, (_, i) => i + 1); // 1 to 36 seat numbers

// Convert seat number to label (A01 to B18)
const seatNumberToLabel = (number) => {
  if (number >= 1 && number <= 18) {
    return `A${number.toString().padStart(2, "0")}`; // Lower floor seats
  } else if (number >= 19 && number <= 36) {
    return `B${(number - 18).toString().padStart(2, "0")}`; // Upper floor seats
  }
  return null; // Invalid seat number
};

// Convert seat label (A01, B01) back to seat number
const seatLabelToNumber = (label) => {
  if (label.startsWith("A")) {
    return parseInt(label.slice(1), 10); // Lower floor (A01 to A18)
  } else if (label.startsWith("B")) {
    return 18 + parseInt(label.slice(1), 10); // Upper floor (B01 to B18)
  }
  return null; // Invalid seat label
};

const SEAT_PRICE = 140000; // Giá mỗi ghế

const BusTicketForm = ({ dbConnection }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState(new Set()); // Initialize as an empty set
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
  }); // Lưu trữ các lỗi cho từng trường
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate for fallback redirect
  const { start, end, startPoint, endPoint, seatsAvailable, price, trip } = location.state || {};

  // Log for debugging
 // Ensure that makh has the expected value

  if (!location.state) {
    // Optional fallback to redirect if state is undefined
    console.warn("No trip data received, redirecting...");
    navigate("/trip-results");
    return null;
  }

  if (!trip) {
    return <div>No trip selected!</div>; // Handle case when no trip data is available
  }


  const handleSeatSelection = (seatNumber) => {
    if (soldSeats.has(seatNumber)) return; // Don't allow selecting a sold seat

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        // If the seat is already selected, unselect it
        return [];
      } else {
        // Otherwise, select the new seat (only one seat can be selected at a time)
        return [seatNumber];
      }
    });
  };
  useEffect(() => {
    const fetchSoldSeats = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/sold-seats");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, Details: ${errorData.error}`);
        }

        const data = await response.json();
        setSoldSeats(new Set(data)); // Convert the array of sold seats to a Set
      } catch (error) {
        console.error("Error fetching sold seats:", error);
      }
    };
  
    fetchSoldSeats();
  }, []); // Empty dependency array to run once on mount
  const getSeatClass = (seatNumber) => {
    if (soldSeats.has(seatNumber)) return "seat sold";
    if (selectedSeats.includes(seatNumber)) return "seat selected";
    return "seat available";
  };

  // Tính tổng tiền dựa trên số ghế đã chọn
  const totalAmount = selectedSeats.length * SEAT_PRICE;


  const validateName = (value) => {
    const nameRegex =
      /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựíìỉĩịýỳỷỹỵ\s]+$/;
    if (!nameRegex.test(value)) {
      return "Họ và tên chỉ được phép là chữ cái, có dấu và khoảng cách giữa các tên.";
    }
    return "";
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value)) {
      return "Số điện thoại chỉ bao gồm chữ số và phải có 10 hoặc 11 chữ số.";
    }
    return "";
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ. Vui lòng nhập email đúng định dạng.";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "name") {
      error = validateName(value);
    } else if (name === "phone") {
      error = validatePhone(value);
    } else if (name === "email") {
      error = validateEmail(value);
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if terms are accepted
    if (!acceptedTerms) {
      alert("Bạn cần chấp nhận điều khoản đặt vé.");
      return;
    }
  
    // Check if a seat is selected
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế.");
      return;
    }
  
    // Prepare the data to send
    const ticketData = {
      maCX: trip.MaCX, // Ensure this is correctly passed from the trip state
      maKH: maKH, // Ensure user is fetched correctly from localStorage
      viTriGheNgoi: selectedSeats,
      giaVe: totalAmount,
      trangThai: "Sold",
      hinhThucThanhToan: "Momo",
      loaiVe: "Tour Du Lich",
    };
  
    // Send request to API
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
        navigate('/')
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
                  {seatNumberToLabel(seatNumber)} {/* Display seat label */}
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
                  {seatNumberToLabel(seatNumber)} {/* Display seat label */}
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
          <strong>Số ghế:</strong>{" "}
          {selectedSeats.length > 0
          ? selectedSeats.map((seatNumber) => seatNumberToLabel(seatNumber)).join(", ")
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
              onChange={() => setAcceptedTerms(!acceptedTerms)} // This should toggle the value of acceptedTerms
            />
            Chấp nhận điều khoản đặt vé
          </label>
        </div>
      </div>

      <button type="submit" className="submit-button">
        Thanh Toán
      </button>
    </form>
    </div>
  );
};


export default BusTicketForm;
