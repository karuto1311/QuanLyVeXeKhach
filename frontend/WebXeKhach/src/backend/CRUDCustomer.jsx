import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]); // Lưu trữ danh sách khách hàng
  const [form, setForm] = useState({
    MaKH: "",
    HoVaTen: "",
    NgaySinh: "",
    DiaChi: "",
    Email: "",
    SDT: "",
  });
  const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa khách hàng
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const customersPerPage = 5; // Số khách hàng hiển thị trên mỗi trang

  // Lấy dữ liệu các khách hàng từ server
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/khachhang");
      setCustomers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      setMessage("Lỗi khi lấy danh sách khách hàng.");
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Xử lý thay đổi giá trị nhập vào form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý gửi form thêm/cập nhật khách hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `http://localhost:8081/khachhang/${editing}`,
          form
        );
      } else {
        response = await axios.post("http://localhost:8081/khachhang", form);
      }
      if (response.status === 200 || response.status === 201) {
        setMessage("Khách hàng đã được thêm/cập nhật thành công!");
        setForm({
          MaKH: "",
          HoVaTen: "",
          NgaySinh: "",
          DiaChi: "",
          Email: "",
          SDT: "",
        });
        setEditing(null);
        fetchCustomers();
      }
    } catch (error) {
      console.error("Lỗi khi gửi form khách hàng:", error);
      setMessage("Không thể thêm/cập nhật khách hàng. Vui lòng thử lại.");
    }
  };

  // Xử lý chỉnh sửa khách hàng
  const handleEdit = (customer) => {
    setForm(customer);
    setEditing(customer.MaKH);
  };

  // Xử lý xóa khách hàng
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/khachhang/${id}`);
      fetchCustomers();
      setMessage("Khách hàng đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      setMessage("Không thể xóa khách hàng. Vui lòng thử lại.");
    }
  };

  // Xử lý hủy form
  const handleCancel = () => {
    setEditing(null);
    setForm({
      MaKH: "",
      HoVaTen: "",
      NgaySinh: "",
      DiaChi: "",
      Email: "",
      SDT: "",
    });
  };

  return (
    <div
      className="Container-CRUD-CSS"
      style={{ padding: "20px", margin: "20px auto" }}
    >
      <h1>QUẢN LÝ KHÁCH HÀNG</h1>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Mã Khách Hàng:</label>
            <input
              type="text"
              name="MaKH"
              value={form.MaKH}
              onChange={handleChange}
              placeholder="Mã Khách Hàng"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Họ Và Tên:</label>
            <input
              type="text"
              name="HoVaTen"
              value={form.HoVaTen}
              onChange={handleChange}
              placeholder="Họ và Tên"
              required
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Ngày Sinh:</label>
            <input
              type="date"
              name="NgaySinh"
              value={form.NgaySinh}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Địa chỉ:</label>
            <input
              type="text"
              name="DiaChi"
              value={form.DiaChi}
              onChange={handleChange}
              placeholder="Địa Chỉ"
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Email:</label>
            <input
              type="emailll"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Số Điện Thoại:</label>{" "}
            <input
              type="text"
              name="SDT"
              value={form.SDT}
              onChange={handleChange}
              placeholder="Số Điện Thoại"
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
            <th>Mã Khách Hàng</th>
            <th>Họ và Tên</th>
            <th>Ngày Sinh</th>
            <th>Địa Chỉ</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {customers
            .slice(
              (currentPage - 1) * customersPerPage,
              currentPage * customersPerPage
            )
            .map((customer) => (
              <tr key={customer.MaKH}>
                <td>{customer.MaKH}</td>
                <td>{customer.HoVaTen}</td>
                <td>{customer.NgaySinh}</td>
                <td>{customer.DiaChi}</td>
                <td>{customer.Email}</td>
                <td>{customer.SDT}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(customer)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(customer.MaKH)}
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
          {" "}
          Trang {currentPage} / {Math.ceil(customers.length / customersPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * customersPerPage >= customers.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Customer;
