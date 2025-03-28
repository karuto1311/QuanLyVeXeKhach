import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ThongTinTaiKhoan from "./Components/ThongTinTaiKhoan";

function ThongTinTaiKhoanPage() {
  return (
    <div className="ThongTinTaiKhoan">
      <Navbar />
      <ThongTinTaiKhoan />
      <Footer />
    </div>
  );
}

export default ThongTinTaiKhoanPage;
