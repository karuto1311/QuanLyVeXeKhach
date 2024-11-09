import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const VeManager = () => {
    const [ve, setVe] = useState([]); // Lưu trữ danh sách vé
    const [chuyenXe, setChuyenXe] = useState([]); // Lưu trữ danh sách chuyến xe
    const [khachHang, setKhachHang] = useState([]); // Lưu trữ danh sách khách hàng
    const [form, setForm] = useState({
        MaVe: '',
        LoaiVe: '',
        ViTriGheNgoi: '',
        GiaVe: '',
        TrangThai: '',
        HinhThucThanhToan: '',
        MaCX: '',
        MaKH: ''
    });
    const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa vé
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const vePerPage = 5; // Số vé hiển thị trên mỗi trang

    // Lấy dữ liệu vé từ server
    const fetchVe = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/ve');
            setVe(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách vé:', error);
            setMessage('Lỗi khi lấy danh sách vé.');
        }
    }, []);

    // Lấy dữ liệu chuyến xe và khách hàng
    const fetchChuyenXe = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/chuyenxe');
            setChuyenXe(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chuyến xe:', error);
            setMessage('Lỗi khi lấy danh sách chuyến xe.');
        }
    }, []);

    const fetchKhachHang = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/khachhang');
            console.log('Khách hàng:', response.data); // Đảm bảo dữ liệu trả về chính xác
            setKhachHang(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
            setMessage('Lỗi khi lấy danh sách khách hàng.');
        }
    }, []);

    useEffect(() => {
        fetchVe();
        fetchChuyenXe();
        fetchKhachHang();
    }, [fetchVe, fetchChuyenXe, fetchKhachHang]);

    // Xử lý thay đổi giá trị nhập vào form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý gửi form thêm/cập nhật vé
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editing) {
                response = await axios.put(`http://localhost:8081/ve/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/ve', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Vé đã được thêm/cập nhật thành công!');
                setForm({
                    MaVe: '',
                    LoaiVe: '',
                    ViTriGheNgoi: '',
                    GiaVe: '',
                    TrangThai: '',
                    HinhThucThanhToan: '',
                    MaCX: '',
                    MaKH: ''
                });
                setEditing(null);
                fetchVe();
            }
        } catch (error) {
            console.error('Lỗi khi gửi form vé:', error);
            setMessage('Không thể thêm/cập nhật vé. Vui lòng thử lại.');
        }
    };

    // Xử lý chỉnh sửa vé
    const handleEdit = (item) => {
        setForm(item);
        setEditing(item.MaVe); // Gán MaVe vào để theo dõi việc chỉnh sửa
    };

    // Xử lý xóa vé
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/ve/${id}`);
            fetchVe();
            setMessage('Vé đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa vé:', error);
            setMessage('Không thể xóa vé. Vui lòng thử lại.');
        }
    };

    // Xử lý hủy form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaVe: '',
            LoaiVe: '',
            ViTriGheNgoi: '',
            GiaVe: '',
            TrangThai: '',
            HinhThucThanhToan: '',
            MaCX: '',
            MaKH: ''
        });
    };

    return (
        <div className="ve-manager">
            <h2>Quản lý Vé</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="MaVe"
                    value={form.MaVe}
                    onChange={handleChange}
                    placeholder="Mã Vé"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="LoaiVe"
                    value={form.LoaiVe}
                    onChange={handleChange}
                    placeholder="Loại Vé"
                    required
                />
                <input
                    type="number"
                    name="ViTriGheNgoi"
                    value={form.ViTriGheNgoi}
                    onChange={handleChange}
                    placeholder="Vị Trí Ghế Ngồi"
                    required
                />
                <input
                    type="number"
                    name="GiaVe"
                    value={form.GiaVe}
                    onChange={handleChange}
                    placeholder="Giá Vé"
                    required
                />
                <input
                    type="text"
                    name="TrangThai"
                    value={form.TrangThai}
                    onChange={handleChange}
                    placeholder="Trạng Thái"
                    required
                />
                <input
                    type="text"
                    name="HinhThucThanhToan"
                    value={form.HinhThucThanhToan}
                    onChange={handleChange}
                    placeholder="Hình Thức Thanh Toán"
                    required
                />
                <select
                    name="MaCX"
                    value={form.MaCX}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn Chuyến Xe</option>
                    {chuyenXe.map(item => (
                        <option key={item.MaCX} value={item.MaCX}>
                            {item.TenChuyenXe}
                        </option>
                    ))}
                </select>

                <select
                    name="MaKH"
                    value={form.MaKH}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn Khách Hàng</option>
                    {khachHang.length > 0 ? (
                        khachHang.map(item => (
                            <option key={item.MaKH} value={item.MaKH}>
                                {item.TenKhachHang}
                            </option>
                        ))
                    ) : (
                        <option>Đang tải dữ liệu...</option>
                    )}
                </select>

                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} Vé</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Mã Vé</th>
                        <th>Loại Vé</th>
                        <th>Vị Trí Ghế Ngồi</th>
                        <th>Giá Vé</th>
                        <th>Trạng Thái</th>
                        <th>Hình Thức Thanh Toán</th>
                        <th>Mã Chuyến Xe</th>
                        <th>Mã Khách Hàng</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {ve.slice((currentPage - 1) * vePerPage, currentPage * vePerPage).map(item => (
                        <tr key={item.MaVe}>
                            <td>{item.MaVe}</td>
                            <td>{item.LoaiVe}</td>
                            <td>{item.ViTriGheNgoi}</td>
                            <td>{item.GiaVe}</td>
                            <td>{item.TrangThai}</td>
                            <td>{item.HinhThucThanhToan}</td>
                            <td>{item.MaCX}</td>
                            <td>{item.MaKH}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Sửa</button>
                                <button onClick={() => handleDelete(item.MaVe)}>Xóa</button>
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
                <button disabled={currentPage * vePerPage >= ve.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default VeManager;
