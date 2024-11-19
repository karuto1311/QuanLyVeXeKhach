import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../assets/Css/CRUDTripParticipants.css";

const ThamGiaChuyenXeManager = () => {
  const [thamGiaChuyenXe, setThamGiaChuyenXe] = useState([]); // Lưu trữ danh sách tham gia chuyến xe
  const [form, setForm] = useState({
    MaCX: "",
    MaNV: "",
    ViTri: "",
    NgayPhanCong: "",
  });
  const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const thamGiaPerPage = 5; // Số tham gia chuyến xe hiển thị trên mỗi trang

  // Lấy dữ liệu tham gia chuyến xe từ server
  const fetchThamGiaChuyenXe = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/thamgiachuyenxe");
      setThamGiaChuyenXe(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tham gia chuyến xe:", error);
      setMessage("Lỗi khi lấy danh sách tham gia chuyến xe.");
    }
  }, []);

  useEffect(() => {
    fetchThamGiaChuyenXe();
  }, [fetchThamGiaChuyenXe]);

  // Xử lý thay đổi giá trị nhập vào form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý gửi form thêm/cập nhật tham gia chuyến xe
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      // if (editing) {
      //     response = await axios.put(`http://localhost:8081/thamgiachuyenxe/${editing}`, form);
      // } else {
      response = await axios.post(
        "http://localhost:8081/thamgiachuyenxe",
        form
      );
      // }
      if (response.status === 200 || response.status === 201) {
        setMessage("Tham gia chuyến xe đã được thêm/cập nhật thành công!");
        setForm({
          MaCX: "",
          MaNV: "",
          ViTri: "",
          NgayPhanCong: "",
        });
        setEditing(null);
        fetchThamGiaChuyenXe();
      }
    } catch (error) {
      console.error("Lỗi khi gửi form tham gia chuyến xe:", error);
      setMessage(
        "Không thể thêm/cập nhật tham gia chuyến xe. Vui lòng thử lại."
      );
      console.error(form);
    }
  };

  // Xử lý chỉnh sửa tham gia chuyến xe
  const handleEdit = (item) => {
    setForm(item);
    setEditing(item.MaCX); // Gán MaCX vào để theo dõi việc chỉnh sửa
  };

  // Xử lý xóa tham gia chuyến xe
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/thamgiachuyenxe/${id}`);
      fetchThamGiaChuyenXe();
      setMessage("Tham gia chuyến xe đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa tham gia chuyến xe:", error);
      setMessage("Không thể xóa tham gia chuyến xe. Vui lòng thử lại.");
    }
  };

  // Xử lý hủy form
  const handleCancel = () => {
    setEditing(null);
    setForm({
      MaCX: "",
      MaNV: "",
      ViTri: "",
      NgayPhanCong: "",
    });
  };

  return (
    <div className="CRUD-container">
      <h1>QUẢN LÝ THAM GIA CHUYẾN XE</h1>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Mã Chuyến Xe:</label>
            <input
              type="text"
              name="MaCX"
              value={form.MaCX}
              onChange={handleChange}
              placeholder="Mã Chuyến Xe"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Mã Nhân Viên:</label>
            <input
              type="text"
              name="MaNV"
              value={form.MaNV}
              onChange={handleChange}
              placeholder="Mã Nhân Viên"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Vị Trí:</label>
            <input
              type="text"
              name="ViTri"
              value={form.ViTri}
              onChange={handleChange}
              placeholder="Vị Trí"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Ngày Phân Công:</label>
            <input
              style={{ marginTop: "5px" }} //Điều chỉnh CSS để cách đều với đề mục input
              className="input-datetime"
              type="datetime-local"
              name="NgayPhanCong"
              value={form.NgayPhanCong}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-buttons-CRUDBusStation">
          <button type="submit" className="action-button-CRUDBusStation">
            {editing ? "Cập nhật" : "Thêm mới"}
          </button>
          {editing && (
            <button
              type="button"
              className="cancel-button-CRUDBusStation"
              onClick={handleCancel}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <table className="station-table">
        <thead>
          <tr>
            <th>Mã Chuyến Xe</th>
            <th>Mã Nhân Viên</th>
            <th>Vị Trí</th>
            <th>Ngày Phân Công</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {thamGiaChuyenXe
            .slice(
              (currentPage - 1) * thamGiaPerPage,
              currentPage * thamGiaPerPage
            )
            .map((item) => (
              <tr key={item.MaCX}>
                <td>{item.MaCX}</td>
                <td>{item.MaNV}</td>
                <td>{item.ViTri}</td>
                <td>{new Date(item.NgayPhanCong).toLocaleString()}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(item)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.MaCX)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} /{" "}
          {Math.ceil(thamGiaChuyenXe.length / thamGiaPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * thamGiaPerPage >= thamGiaChuyenXe.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default ThamGiaChuyenXeManager;
