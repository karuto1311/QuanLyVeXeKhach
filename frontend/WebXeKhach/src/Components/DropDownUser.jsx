import React from "react";
import { useNavigate, Link } from "react-router-dom";

const DropDownUser = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="flex flex-col dropDownUser">
      <Link to="/thong-tin-tai-khoan">Thông tin tài khoản</Link>
      <Link to="/lich-su-mua-ve">Lịch sử mua vé</Link>
      <Link to="/reset-password">Đặt lại mật khẩu</Link>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
};
export default DropDownUser;
