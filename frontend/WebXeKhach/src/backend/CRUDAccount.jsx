import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]); // Store list of accounts
  const [form, setForm] = useState({
    MaTK: "",
    Email: "",
    Password: "",
    MaKH: "",
  });
  const [editing, setEditing] = useState(null); // Track editing account
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const accountsPerPage = 5; // Number of accounts displayed per page

  // Fetch accounts from the server
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/taikhoan");
      setAccounts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
      setMessage("Không thể lấy dữ liệu tài khoản.");
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit for adding/updating account
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(
          `http://localhost:8081/taikhoan/${editing}`,
          form
        );
      } else {
        response = await axios.post("http://localhost:8081/taikhoan", form);
      }
      if (response.status === 200 || response.status === 201) {
        setMessage("Tài khoản đã được thêm/cập nhật thành công!");
        setForm({
          MaTK: "",
          Email: "",
          Password: "",
          MaKH: "",
        });
        setEditing(null);
        fetchAccounts();
      }
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật tài khoản:", error);
      setMessage("Không thể thêm/cập nhật tài khoản. Vui lòng thử lại.");
    }
  };

  // Handle editing account
  const handleEdit = (account) => {
    setForm(account);
    setEditing(account.MaTK);
  };

  // Handle deleting account
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/taikhoan/${id}`);
      fetchAccounts();
      setMessage("Tài khoản đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      setMessage("Không thể xóa tài khoản. Vui lòng thử lại.");
    }
  };

  // Handle canceling the form
  const handleCancel = () => {
    setEditing(null);
    setForm({
      MaTK: "",
      Email: "",
      Password: "",
      MaKH: "",
    });
  };

  return (
    <div className="CRUD-container">
      <h1>QUẢN LÝ TÀI KHOẢN</h1>
      {message && <p className="message">{message}</p>}
      <form className="form-container-CRUDBusStation" onSubmit={handleSubmit}>
        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Mã Tài Khoản:</label>
            <input
              type="text"
              name="MaTK"
              value={form.MaTK}
              onChange={handleChange}
              placeholder="Mã tài khoản"
              required
              disabled={!!editing}
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Mã Khách Hàng:</label>
            <input
              type="text"
              name="MaKH"
              value={form.MaKH}
              onChange={handleChange}
              placeholder="Mã khách hàng"
            />
          </div>
        </div>

        <div className="input-row-crud">
          <div className="input-group-crud">
            <label htmlFor="MaBX">Email:</label>
            <input
              type="emaill"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group-crud">
            <label htmlFor="TenBX">Mật Khẩu:</label>
            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              placeholder="Mật khẩu"
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
            <th>Mã tài khoản</th>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Mã khách hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts
            .slice(
              (currentPage - 1) * accountsPerPage,
              currentPage * accountsPerPage
            )
            .map((account) => (
              <tr key={account.MaTK}>
                <td>{account.MaTK}</td>
                <td>{account.Email}</td>
                <td>{account.Password}</td>
                <td>{account.MaKH}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() => handleEdit(account)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(account.MaTK)}
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
          Trang {currentPage} / {Math.ceil(accounts.length / accountsPerPage)}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage * accountsPerPage >= accounts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default AccountManager;
