import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]); // Store list of employees
    const [form, setForm] = useState({
        MaNV: '',
        HoVaTen: '',
        NgaySinh: '',
        DiaChi: '',
        Email: '',
        SDT: '',
        NgayVaoLam: '',
        PhongBan: '',
        ChucVu: '',
        UserName: '',
        Password: '',
        Permission: '',
        Role: ''
    });
    const [editing, setEditing] = useState(null); // Track editing employee
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const employeesPerPage = 5; // Number of employees displayed per page

    // Fetch employees from the server
    const fetchEmployees = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/nhanvien');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setMessage('Không thể lấy dữ liệu nhân viên.');
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit for adding/updating employee
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editing) {
                response = await axios.put(`http://localhost:8081/nhanvien/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/nhanvien', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Nhân viên đã được thêm/cập nhật thành công!');
                setForm({
                    MaNV: '',
                    HoVaTen: '',
                    NgaySinh: '',
                    DiaChi: '',
                    Email: '',
                    SDT: '',
                    NgayVaoLam: '',
                    PhongBan: '',
                    ChucVu: '',
                    UserName: '',
                    Password: '',
                    Permission: '',
                    Role: ''
                });
                setEditing(null);
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error submitting employee form:', error);
            setMessage('Không thể thêm/cập nhật nhân viên. Vui lòng thử lại.');
        }
    };

    // Handle editing employee
    const handleEdit = (employee) => {
        setForm(employee);
        setEditing(employee.MaNV);
    };

    // Handle deleting employee
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/nhanvien/${id}`);
            fetchEmployees();
            setMessage('Nhân viên đã được xóa thành công!');
        } catch (error) {
            console.error('Error deleting employee:', error);
            setMessage('Không thể xóa nhân viên. Vui lòng thử lại.');
        }
    };

    // Handle canceling the form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaNV: '',
            HoVaTen: '',
            NgaySinh: '',
            DiaChi: '',
            Email: '',
            SDT: '',
            NgayVaoLam: '',
            PhongBan: '',
            ChucVu: '',
            UserName: '',
            Password: '',
            Permission: '',
            Role: ''
        });
    };

    return (
        <div className="employee-manager">
            <h2>Quản lý nhân viên</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="MaNV" value={form.MaNV} onChange={handleChange} placeholder="Mã nhân viên" required disabled={!!editing} />
                <input type="text" name="HoVaTen" value={form.HoVaTen} onChange={handleChange} placeholder="Họ và tên" required />
                <input type="date" name="NgaySinh" value={form.NgaySinh} onChange={handleChange} required />
                <input type="text" name="DiaChi" value={form.DiaChi} onChange={handleChange} placeholder="Địa chỉ" />
                <input type="email" name="Email" value={form.Email} onChange={handleChange} placeholder="Email" required />
                <input type="text" name="SDT" value={form.SDT} onChange={handleChange} placeholder="Số điện thoại" required />
                <input type="date" name="NgayVaoLam" value={form.NgayVaoLam} onChange={handleChange} required placeholder="Ngày vào làm" />
                <input type="text" name="PhongBan" value={form.PhongBan} onChange={handleChange} placeholder="Phòng ban" required />
                <input type="text" name="ChucVu" value={form.ChucVu} onChange={handleChange} placeholder="Chức vụ" required />
                <input type="text" name="UserName" value={form.UserName} onChange={handleChange} placeholder="Tên đăng nhập" required />
                <input type="password" name="Password" value={form.Password} onChange={handleChange} placeholder="Mật khẩu" required />
                <input type="text" name="Permission" value={form.Permission} onChange={handleChange} placeholder="Quyền truy cập" required />
                <input type="text" name="Role" value={form.Role} onChange={handleChange} placeholder="Vai trò" required />
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} nhân viên</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Họ và tên</th>
                        <th>Ngày sinh</th>
                        <th>Địa chỉ</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Ngày vào làm</th>
                        <th>Phòng ban</th>
                        <th>Chức vụ</th>
                        <th>Tên đăng nhập</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.slice((currentPage - 1) * employeesPerPage, currentPage * employeesPerPage).map(employee => (
                        <tr key={employee.MaNV}>
                            <td>{employee.MaNV}</td>
                            <td>{employee.HoVaTen}</td>
                            <td>{employee.NgaySinh}</td>
                            <td>{employee.DiaChi}</td>
                            <td>{employee.Email}</td>
                            <td>{employee.SDT}</td>
                            <td>{employee.NgayVaoLam}</td>
                            <td>{employee.PhongBan}</td>
                            <td>{employee.ChucVu}</td>
                            <td>{employee.UserName}</td>
                            <td>
                                <button onClick={() => handleEdit(employee)}>Sửa</button>
                                <button onClick={() => handleDelete(employee.MaNV)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Trang trước
                </button>
                <span>Trang {currentPage}</span>
                <button disabled={currentPage * employeesPerPage >= employees.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default EmployeeManager;
