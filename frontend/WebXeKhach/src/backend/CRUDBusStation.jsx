import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../assets/Css/CRUDBusStation.css";

const BusStationManager = () => {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    MaBX: "",
    TenBX: "",
    DiaChi: "",
    TinhThanh: "",
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stationsPerPage = 5;

  const fetchStations = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/benxe");
      setStations(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bến xe:", error);
      setMessage("Lỗi khi lấy danh sách bến xe.");
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `http://localhost:8081/benxe/${editing}`,
          form
        );
      } else {
        response = await axios.post("http://localhost:8081/benxe", form);
      }
      if (response.status === 200 || response.status === 201) {
        setMessage("Bến xe đã được thêm/cập nhật thành công!");
        setForm({ MaBX: "", TenBX: "", DiaChi: "", TinhThanh: "" });
        setEditing(null);
        fetchStations();
      }
    } catch (error) {
      console.error("Lỗi khi gửi form bến xe:", error);
      setMessage("Không thể thêm/cập nhật bến xe. Vui lòng thử lại.");
    }
  };

  const handleEdit = (station) => {
    setForm(station);
    setEditing(station.MaBX);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/benxe/${id}`);
      fetchStations();
      setMessage("Bến xe đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bến xe:", error);
      setMessage("Không thể xóa bến xe. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ MaBX: "", TenBX: "", DiaChi: "", TinhThanh: "" });
  };

  return (
    <div className="CRUD-container">
      <h1>QUẢN LÝ BẾN XE</h1>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Mã Bến Xe:</label>
            <input
              id="MaBX"
              type="text"
              name="MaBX"
              value={form.MaBX}
              onChange={handleChange}
              placeholder="Nhập mã bến xe"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Tên Bến Xe:</label>
            <input
              id="TenBX"
              type="text"
              name="TenBX"
              value={form.TenBX}
              onChange={handleChange}
              placeholder="Nhập tên bến xe"
              required
            />
          </div>
        </div>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="DiaChi">Địa Chỉ:</label>
            <input
              id="DiaChi"
              type="text"
              name="DiaChi"
              value={form.DiaChi}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TinhThanh">Tỉnh Thành:</label>
            <input
              id="TinhThanh"
              type="text"
              name="TinhThanh"
              value={form.TinhThanh}
              onChange={handleChange}
              placeholder="Nhập tỉnh thành"
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
            <th>Mã Bến Xe</th>
            <th>Tên Bến Xe</th>
            <th>Địa Chỉ</th>
            <th>Tỉnh Thành</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {stations
            .slice(
              (currentPage - 1) * stationsPerPage,
              currentPage * stationsPerPage
            )
            .map((station) => (
              <tr key={station.MaBX}>
                <td>{station.MaBX}</td>
                <td>{station.TenBX}</td>
                <td>{station.DiaChi}</td>
                <td>{station.TinhThanh}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(station)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(station.MaBX)}
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
          Trang {currentPage} / {Math.ceil(stations.length / stationsPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * stationsPerPage >= stations.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default BusStationManager;
