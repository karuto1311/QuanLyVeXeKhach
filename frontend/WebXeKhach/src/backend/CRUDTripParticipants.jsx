import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ThamGiaChuyenXeManager = () => {
    const [thamGiaChuyenXe, setThamGiaChuyenXe] = useState([]); // Lưu trữ danh sách tham gia chuyến xe
    const [form, setForm] = useState({
        MaCX: '',
        MaNV: '',
        ViTri: '',
        NgayPhanCong: ''
    });
    const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const thamGiaPerPage = 5; // Số tham gia chuyến xe hiển thị trên mỗi trang

    // Lấy dữ liệu tham gia chuyến xe từ server
    const fetchThamGiaChuyenXe = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/thamgiachuyenxe');
            setThamGiaChuyenXe(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tham gia chuyến xe:', error);
            setMessage('Lỗi khi lấy danh sách tham gia chuyến xe.');
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
            if (editing) {
                response = await axios.put(`http://localhost:8081/thamgiachuyenxe/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/thamgiachuyenxe', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Tham gia chuyến xe đã được thêm/cập nhật thành công!');
                setForm({
                    MaCX: '',
                    MaNV: '',
                    ViTri: '',
                    NgayPhanCong: ''
                });
                setEditing(null);
                fetchThamGiaChuyenXe();
            }
        } catch (error) {
            console.error('Lỗi khi gửi form tham gia chuyến xe:', error);
            setMessage('Không thể thêm/cập nhật tham gia chuyến xe. Vui lòng thử lại.');
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
            setMessage('Tham gia chuyến xe đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa tham gia chuyến xe:', error);
            setMessage('Không thể xóa tham gia chuyến xe. Vui lòng thử lại.');
        }
    };

    // Xử lý hủy form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaCX: '',
            MaNV: '',
            ViTri: '',
            NgayPhanCong: ''
        });
    };

    return (
        <div className="thamgiachuyenxe-manager">
            <h2>Quản lý Tham Gia Chuyến Xe</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="MaCX"
                    value={form.MaCX}
                    onChange={handleChange}
                    placeholder="Mã Chuyến Xe"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="MaNV"
                    value={form.MaNV}
                    onChange={handleChange}
                    placeholder="Mã Nhân Viên"
                    required
                />
                <input
                    type="text"
                    name="ViTri"
                    value={form.ViTri}
                    onChange={handleChange}
                    placeholder="Vị Trí"
                    required
                />
                <input
                    type="datetime-local"
                    name="NgayPhanCong"
                    value={form.NgayPhanCong}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} Tham Gia Chuyến Xe</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
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
                    {thamGiaChuyenXe.slice((currentPage - 1) * thamGiaPerPage, currentPage * thamGiaPerPage).map(item => (
                        <tr key={item.MaCX}>
                            <td>{item.MaCX}</td>
                            <td>{item.MaNV}</td>
                            <td>{item.ViTri}</td>
                            <td>{new Date(item.NgayPhanCong).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Sửa</button>
                                <button onClick={() => handleDelete(item.MaCX)}>Xóa</button>
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
                <button disabled={currentPage * thamGiaPerPage >= thamGiaChuyenXe.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default ThamGiaChuyenXeManager;
