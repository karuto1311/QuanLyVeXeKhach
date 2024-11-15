import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Customer = () => {
    const [customers, setCustomers] = useState([]); // Lưu trữ danh sách khách hàng
    const [form, setForm] = useState({
        MaKH: '',
        HoVaTen: '',
        NgaySinh: '',
        DiaChi: '',
        Email: '',
        SDT: ''
    });
    const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa khách hàng
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const customersPerPage = 5; // Số khách hàng hiển thị trên mỗi trang

    // Lấy dữ liệu các khách hàng từ server
    const fetchCustomers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/khachhang');
            setCustomers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
            setMessage('Lỗi khi lấy danh sách khách hàng.');
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
                response = await axios.put(`http://localhost:8081/khachhang/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/khachhang', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Khách hàng đã được thêm/cập nhật thành công!');
                setForm({
                    MaKH: '',
                    HoVaTen: '',
                    NgaySinh: '',
                    DiaChi: '',
                    Email: '',
                    SDT: ''
                });
                setEditing(null);
                fetchCustomers();
            }
        } catch (error) {
            console.error('Lỗi khi gửi form khách hàng:', error);
            setMessage('Không thể thêm/cập nhật khách hàng. Vui lòng thử lại.');
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
            setMessage('Khách hàng đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa khách hàng:', error);
            setMessage('Không thể xóa khách hàng. Vui lòng thử lại.');
        }
    };

    // Xử lý hủy form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaKH: '',
            HoVaTen: '',
            NgaySinh: '',
            DiaChi: '',
            Email: '',
            SDT: ''
        });
    };

    return (
        <div className="customer-manager">
            <h2>Quản lý Khách Hàng</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="MaKH"
                    value={form.MaKH}
                    onChange={handleChange}
                    placeholder="Mã Khách Hàng"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="HoVaTen"
                    value={form.HoVaTen}
                    onChange={handleChange}
                    placeholder="Họ và Tên"
                    required
                />
                <input
                    type="date"
                    name="NgaySinh"
                    value={form.NgaySinh}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="DiaChi"
                    value={form.DiaChi}
                    onChange={handleChange}
                    placeholder="Địa Chỉ"
                />
                <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="SDT"
                    value={form.SDT}
                    onChange={handleChange}
                    placeholder="Số Điện Thoại"
                    required
                />
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} Khách Hàng</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
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
                    {customers.slice((currentPage - 1) * customersPerPage, currentPage * customersPerPage).map(customer => (
                        <tr key={customer.MaKH}>
                            <td>{customer.MaKH}</td>
                            <td>{customer.HoVaTen}</td>
                            <td>{customer.NgaySinh}</td>
                            <td>{customer.DiaChi}</td>
                            <td>{customer.Email}</td>
                            <td>{customer.SDT}</td>
                            <td>
                                <button onClick={() => handleEdit(customer)}>Chỉnh sửa</button>
                                <button onClick={() => handleDelete(customer.MaKH)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Trước
                </button>
                <span>Trang {currentPage}</span>
                <button disabled={currentPage * customersPerPage >= customers.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default Customer;
