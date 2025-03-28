import React from "react";
import "../assets/Css/ThongTinTaiKhoan.css";

const ThongTinTaiKhoan = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <div>Chưa đăng nhập</div>;

  return (
    <div className="account-page" id="accountPage">
      <h2>Thông Tin Tài Khoản</h2>
      <div className="account-details">
        <p>
          <strong>Họ và Tên:</strong> {user.HoVaTen}
        </p>
        <p>
          <strong>Email:</strong> {user.Email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.SDT}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {user.DiaChi}
        </p>
        <p>
          <strong>Ngày sinh:</strong> {user.NgaySinh}
        </p>
      </div>
    </div>
  );
};

export default ThongTinTaiKhoan;
