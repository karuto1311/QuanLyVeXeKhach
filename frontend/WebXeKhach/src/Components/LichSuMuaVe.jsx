import React, { useState, useEffect } from "react";
import "../assets/Css/LichSuMuaVe.css";

const LichSuMuaVe = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8081/ve");
        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu vé");
        }
        const data = await response.json();
        // Lọc vé theo mã khách hàng của người dùng đăng nhập
        const userTickets = data.filter((ticket) => ticket.MaKH === user?.MaKH);
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, [user]);

  return (
    <div className="purchase-history" id="purchaseHistoryPage">
      <h2>Lịch Sử Mua Vé</h2>
      {tickets.length === 0 ? (
        <p>Chưa có vé nào được mua.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã Vé</th>
              <th>Chuyến Xe</th>
              <th>Ghế</th>
              <th>Giá Vé</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.MaVe}>
                <td>{ticket.MaVe}</td>
                <td>{ticket.MaCX}</td>
                <td>{ticket.ViTriGheNgoi}</td>
                <td>{parseInt(ticket.GiaVe).toLocaleString("vi-VN")}₫</td>
                <td>{ticket.TrangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LichSuMuaVe;
