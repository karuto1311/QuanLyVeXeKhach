import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../assets/Css/CRUDBus.css";

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    BienSoXe: "",
    LoaiXe: "",
    SoChoNgoi: "",
    HangSanXuat: "",
    NamSanXuat: "",
    MaBX: "",
  });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/xe");
      setVehicles(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu xe:", error);
      setMessage("Không thể lấy dữ liệu xe.");
    }
  }, []);

  const fetchStations = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/benxe");
      if (response.data.length === 0) {
        setMessage("Không có bến xe nào.");
      } else {
        setStations(response.data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu bến xe:", error);
      setMessage("Không thể lấy dữ liệu bến xe.");
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchStations();
  }, [fetchVehicles, fetchStations]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.MaBX) {
      setMessage("Vui lòng chọn Mã Bến Xe hợp lệ.");
      return;
    }
    try {
      let response;
      if (editing) {
        // Cập nhật xe
        response = await axios.put(`http://localhost:8081/xe/${editing}`, form);
      } else {
        // Thêm xe mới
        response = await axios.post("http://localhost:8081/xe", form);
      }
      if (response.status === 200 || response.status === 201) {
        setMessage("Thêm/Cập nhật xe thành công!");
        setForm({
          BienSoXe: "",
          LoaiXe: "",
          SoChoNgoi: "",
          HangSanXuat: "",
          NamSanXuat: "",
          MaBX: "",
        });
        setEditing(null);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu xe:", error);
      setMessage("Không thể thêm/cập nhật xe. Vui lòng thử lại.");
      console.error(form);
    }
  };

  const handleEdit = (vehicle) => {
    setForm(vehicle);
    setEditing(vehicle.BienSoXe);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa xe này không?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:8081/xe/${id}`);
      if (response.status === 200) {
        fetchVehicles();
        setMessage("Xóa xe thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa xe:", error);
      setMessage("Không thể xóa xe. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({
      BienSoXe: "",
      LoaiXe: "",
      SoChoNgoi: "",
      HangSanXuat: "",
      NamSanXuat: "",
      MaBX: "",
    });
  };

  return (
    <div className="CRUD-container">
      <h1>QUẢN LÝ XE</h1>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Biển Số Xe:</label>
            <input
              type="text"
              name="BienSoXe"
              value={form.BienSoXe}
              onChange={handleChange}
              placeholder="Biển số xe"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Loại Xe:</label>
            <input
              type="text"
              name="LoaiXe"
              value={form.LoaiXe}
              onChange={handleChange}
              placeholder="Loại xe"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Số Chỗ Ngồi:</label>
            <input
              type="number"
              name="SoChoNgoi"
              value={form.SoChoNgoi}
              onChange={handleChange}
              placeholder="Số chỗ ngồi"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Hãng Sản Xuất:</label>
            <input
              type="text"
              name="HangSanXuat"
              value={form.HangSanXuat}
              onChange={handleChange}
              placeholder="Hãng sản xuất"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Năm Sản Xuất:</label>
            <input
              type="number"
              name="NamSanXuat"
              value={form.NamSanXuat}
              onChange={handleChange}
              placeholder="Năm sản xuất"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Mã Bến Xe:</label>
            <select
              name="MaBX"
              value={form.MaBX}
              onChange={handleChange}
              required
            >
              <option value="">Chọn Mã Bến Xe</option>
              {stations.map((station) => (
                <option key={station.MaBX} value={station.MaBX}>
                  {station.MaBX}
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

      <table className="station-table">
        <thead>
          <tr>
            <th>Biển số xe</th>
            <th>Loại xe</th>
            <th>Số chỗ ngồi</th>
            <th>Hãng sản xuất</th>
            <th>Năm sản xuất</th>
            <th>Mã bến xe</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vehicles
            .slice(
              (currentPage - 1) * vehiclesPerPage,
              currentPage * vehiclesPerPage
            )
            .map((vehicle) => (
              <tr key={vehicle.BienSoXe}>
                <td>{vehicle.BienSoXe}</td>
                <td>{vehicle.LoaiXe}</td>
                <td>{vehicle.SoChoNgoi}</td>
                <td>{vehicle.HangSanXuat}</td>
                <td>{vehicle.NamSanXuat}</td>
                <td>{vehicle.MaBX}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(vehicle)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(vehicle.BienSoXe)}
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
          Trang {currentPage} / {Math.ceil(vehicles.length / vehiclesPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * vehiclesPerPage >= vehicles.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default VehicleManager;
