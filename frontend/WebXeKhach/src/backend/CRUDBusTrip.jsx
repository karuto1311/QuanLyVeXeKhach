import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../assets/Css/CRUDBusTrip.css";

const ChuyenXeManager = () => {
  const [chuyenxes, setChuyenxes] = useState([]);
  const [xes, setXes] = useState([]);
  const [form, setForm] = useState({
    MaCX: "",
    ThoiGianDi: "",
    ThoiGianVe: "",
    DiemDi: "",
    DiemDen: "",
    GiaVe: "",
    LoaiHinhChuyenDi: "",
    BienSoXe: "",
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chuyenxesPerPage = 5;

  const fetchChuyenxes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/chuyenxe");
      setChuyenxes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chuyến xe:", error);
      setMessage("Không thể lấy dữ liệu chuyến xe.");
    }
  }, []);

  const fetchXes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/xe");
      setXes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu biển số xe:", error);
      setMessage("Không thể lấy dữ liệu biển số xe.");
    }
  }, []);

  useEffect(() => {
    fetchChuyenxes();
    fetchXes();
  }, [fetchChuyenxes, fetchXes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `http://localhost:8081/chuyenxe/${editing}`,
          form
        );
      } else {
        response = await axios.post("http://localhost:8081/chuyenxe", form);
      }
      if (response.status === 200 || response.status === 201) {
        setMessage("Chuyến xe đã được thêm/cập nhật thành công!");
        setForm({
          MaCX: "",
          ThoiGianDi: "",
          ThoiGianVe: "",
          DiemDi: "",
          DiemDen: "",
          GiaVe: "",
          LoaiHinhChuyenDi: "",
          BienSoXe: "",
        });
        setEditing(null);
        fetchChuyenxes();
      }
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật chuyến xe:", error);
      setMessage("Không thể thêm/cập nhật chuyến xe. Vui lòng thử lại.");
    }
  };

  const handleEdit = (chuyenxe) => {
    setForm(chuyenxe);
    setEditing(chuyenxe.MaCX);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/chuyenxe/${id}`);
      fetchChuyenxes();
      setMessage("Chuyến xe đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa chuyến xe:", error);
      setMessage("Không thể xóa chuyến xe. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      MaCX: "",
      ThoiGianDi: "",
      ThoiGianVe: "",
      DiemDi: "",
      DiemDen: "",
      GiaVe: "",
      LoaiHinhChuyenDi: "",
      BienSoXe: "",
    });
  };

  return (
    <div className="CRUD-container-BusStation">
      <h2>Quản lý chuyến xe</h2>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Mã Bến Xe:</label>
            <input
              type="text"
              name="MaCX"
              value={form.MaCX}
              onChange={handleChange}
              placeholder="Mã chuyến xe"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="MaBX">Giá Vé:</label>
            <input
              type="number"
              name="GiaVe"
              value={form.GiaVe}
              onChange={handleChange}
              placeholder="Giá vé"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Thời Gian Đi:</label>
            <input
              type="datetime-local"
              name="ThoiGianDi"
              value={form.ThoiGianDi}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-crud">
            <label htmlFor="MaBX">Thời Gian Về:</label>
            <input
              type="datetime-local"
              name="ThoiGianVe"
              value={form.ThoiGianVe}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Điểm Đi:</label>
            <input
              type="text"
              name="DiemDi"
              value={form.DiemDi}
              onChange={handleChange}
              placeholder="Điểm đi"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="MaBX">Điểm Đến:</label>
            <input
              type="text"
              name="DiemDen"
              value={form.DiemDen}
              onChange={handleChange}
              placeholder="Điểm đến"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Loại Hình Chuyến Đi:</label>
            <input
              type="text"
              name="LoaiHinhChuyenDi"
              value={form.LoaiHinhChuyenDi}
              onChange={handleChange}
              placeholder="Loại hình chuyến đi"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="MaBX">Biển Số Xe:</label>
            <select
              name="BienSoXe"
              value={form.BienSoXe}
              onChange={handleChange}
              required
            >
              <option value="">Chọn biển số xe</option>
              {xes.map((xe) => (
                <option key={xe.BienSoXe} value={xe.BienSoXe}>
                  {xe.BienSoXe}
                </option>
              ))}
            </select>
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

      {/* Bảng danh sách chuyến xe */}
      <table className="station-table">
        <thead>
          <tr>
            <th>Mã chuyến xe</th>
            <th>Thời gian đi</th>
            <th>Thời gian về</th>
            <th>Điểm đi</th>
            <th>Điểm đến</th>
            <th>Giá vé</th>
            <th>Loại hình chuyến đi</th>
            <th>Biển số xe</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {chuyenxes
            .slice(
              (currentPage - 1) * chuyenxesPerPage,
              currentPage * chuyenxesPerPage
            )
            .map((chuyenxe) => (
              <tr key={chuyenxe.MaCX}>
                <td>{chuyenxe.MaCX}</td>
                <td>{new Date(chuyenxe.ThoiGianDi).toLocaleString()}</td>
                <td>{new Date(chuyenxe.ThoiGianVe).toLocaleString()}</td>
                <td>{chuyenxe.DiemDi}</td>
                <td>{chuyenxe.DiemDen}</td>
                <td>{chuyenxe.GiaVe}</td>
                <td>{chuyenxe.LoaiHinhChuyenDi}</td>
                <td>{chuyenxe.BienSoXe}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(chuyenxe)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(chuyenxe.MaCX)}
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
          Trang {currentPage} / {Math.ceil(chuyenxes.length / chuyenxesPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * chuyenxesPerPage >= chuyenxes.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default ChuyenXeManager;
