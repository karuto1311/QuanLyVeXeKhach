import React, { useState, useEffect } from "react";
import "../assets/Css/Payment.css";
import zalo_pay from "../assets/zalo_pay.png";
import shopee_pay from "../assets/shopee_pay.png";
import momo from "../assets/QRmomo.png";
import vnpay from "../assets/vnpay.png";
import viettel_money from "../assets/viettel_money.png";
import vietQR from "../assets/vietQR.png";
import atm from "../assets/atm.png";
import visa from "../assets/visa.png";
import momoQR from "../assets/QRmomo.png";
import { Link } from "react-router-dom";

const Payment = () => {
  const [timeLeft, setTimeLeft] = useState(900); // 900 seconds = 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Clear timer on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      alert("Bạn đã hết thời gian thanh toán");
    }
  }, [timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const [selectedMethod, setSelectedMethod] = useState("");

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-methods">
          <h3>Chọn phương thức thanh toán</h3>
          <ul>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="ZaloPay"
                checked={selectedMethod === "ZaloPay"}
                onChange={() => handleMethodChange("ZaloPay")}
              />
              <img src={zalo_pay} alt="ZaloPay" /> ZaloPay
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="ShopeePay"
                checked={selectedMethod === "ShopeePay"}
                onChange={() => handleMethodChange("ShopeePay")}
              />
              <img src={shopee_pay} alt="ShopeePay" /> ShopeePay
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="Momo"
                checked={selectedMethod === "Momo"}
                onChange={() => handleMethodChange("Momo")}
              />
              <img src={momo} alt="Momo" /> Momo
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="VNPay"
                checked={selectedMethod === "VNPay"}
                onChange={() => handleMethodChange("VNPay")}
              />
              <img src={vnpay} alt="VNPay" /> VNPay
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="ViettelMoney"
                checked={selectedMethod === "ViettelMoney"}
                onChange={() => handleMethodChange("ViettelMoney")}
              />
              <img src={viettel_money} alt="Viettel Money" /> Viettel Money
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="VietQR"
                checked={selectedMethod === "VietQR"}
                onChange={() => handleMethodChange("VietQR")}
              />
              <img src={vietQR} alt="Viet QR" /> Viet QR
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="ATM"
                checked={selectedMethod === "ATM"}
                onChange={() => handleMethodChange("ATM")}
              />
              <img src={atm} alt="Thẻ ATM nội địa" /> Thẻ ATM nội địa
            </li>
            <li>
              <input
                type="radio"
                name="paymentMethod"
                value="VISA"
                checked={selectedMethod === "VISA"}
                onChange={() => handleMethodChange("VISA")}
              />
              <img src={visa} alt="Thẻ VISA/Master/JCB" /> Thẻ VISA/Master/JCB
            </li>
          </ul>
        </div>

        {/* Payment Summary and QR Code */}
        <div className="payment-summary">
          <h3>Tổng thanh toán</h3>
          <p className="total-amount">140.000Đ</p>

          {/* QR Code Payment Section */}
          <div className="qr-section">
            <p>Thời gian giữ chỗ còn lại: {formatTime(timeLeft)}</p>
            <div className="qr-code">
              <img src={momoQR} alt="Mã QR Momo" className="qr-image" />
            </div>
          </div>

          {/* Payment Instructions */}
          <h4>Hướng dẫn thanh toán bằng Momo:</h4>
          <ol>
            <li>Mở ứng dụng Momo trên điện thoại</li>
            <li>Chọn biểu tượng quét mã QR</li>
            <li>Quét mã ở trang này và thanh toán</li>
          </ol>
        </div>

        {/* Grouping Customer and Trip Information */}
        <div className="info-column-pm">
          <div className="customer-info-payment">
            <h3>Thông tin hành khách</h3>
            <p>Họ và tên: Nguyễn Gia Bảo</p>
            <p>Số điện thoại: 0982848114</p>
            <p>Email: danhtrancong956@gmail.com</p>
          </div>

          <div className="trip-info-payment">
            <h3>Thông tin lượt đi</h3>
            <p>Tuyến xe: TP.HCM - Nha Trang</p>
            <p>Thời gian xuất bến: 06:00 09/10/2004</p>
            <p>Số lượng ghế: 1 Ghế</p>
            <p>Số ghế: A01</p>
            <p>Điểm trả khách: ...</p>
            <p>Tổng tiền lượt đi: 140.000 VNĐ</p>
          </div>

          <div className="price-details-payment">
            <h3>Chi tiết giá</h3>
            <p>Giá vé lượt đi: 140.000 VNĐ</p>
            <p>Phí thanh toán: 0 VNĐ</p>
            <p>Tổng tiền: 140.000 VNĐ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
