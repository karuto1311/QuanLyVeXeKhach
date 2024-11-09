import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ChuyenXeManager = () => {
    const [chuyenxes, setChuyenxes] = useState([]); // Lưu trữ danh sách chuyến xe
    const [xes, setXes] = useState([]); // Lưu trữ danh sách biển số xe
    const [form, setForm] = useState({
        MaCX: '',
        ThoiGianDi: '',
        ThoiGianVe: '',
        DiemDi: '',
        DiemDen: '',
        GiaVe: '',
        LoaiHinhChuyenDi: '',
        BienSoXe: ''
    });
    const [editing, setEditing] = useState(null); // Theo dõi chuyến xe đang được chỉnh sửa
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại cho phân trang
    const chuyenxesPerPage = 5; // Số chuyến xe hiển thị mỗi trang

    // Fetch chuyến xe từ server
    const fetchChuyenxes = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/chuyenxe');
            setChuyenxes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu chuyến xe:', error);
            setMessage('Không thể lấy dữ liệu chuyến xe.');
        }
    }, []);

    // Fetch danh sách biển số xe từ server
    const fetchXes = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/xe'); // Thay đổi API nếu cần
            setXes(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu biển số xe:', error);
            setMessage('Không thể lấy dữ liệu biển số xe.');
        }
    }, []);

    useEffect(() => {
        fetchChuyenxes();
        fetchXes();
    }, [fetchChuyenxes, fetchXes]);

    // Xử lý thay đổi dữ liệu nhập vào
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý gửi form thêm/sửa chuyến xe
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editing) {
                response = await axios.put(`http://localhost:8081/chuyenxe/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/chuyenxe', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Chuyến xe đã được thêm/cập nhật thành công!');
                setForm({
                    MaCX: '',
                    ThoiGianDi: '',
                    ThoiGianVe: '',
                    DiemDi: '',
                    DiemDen: '',
                    GiaVe: '',
                    LoaiHinhChuyenDi: '',
                    BienSoXe: ''
                });
                setEditing(null);
                fetchChuyenxes();
            }
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật chuyến xe:', error);
            setMessage('Không thể thêm/cập nhật chuyến xe. Vui lòng thử lại.');
        }
    };

    // Xử lý chỉnh sửa chuyến xe
    const handleEdit = (chuyenxe) => {
        setForm(chuyenxe);
        setEditing(chuyenxe.MaCX);
    };

    // Xử lý xóa chuyến xe
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/chuyenxe/${id}`);
            fetchChuyenxes();
            setMessage('Chuyến xe đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa chuyến xe:', error);
            setMessage('Không thể xóa chuyến xe. Vui lòng thử lại.');
        }
    };

    // Xử lý hủy form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaCX: '',
            ThoiGianDi: '',
            ThoiGianVe: '',
            DiemDi: '',
            DiemDen: '',
            GiaVe: '',
            LoaiHinhChuyenDi: '',
            BienSoXe: ''
        });
    };

    return (
        <div className="chuyenxe-manager">
            <h2>Quản lý chuyến xe</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="MaCX" value={form.MaCX} onChange={handleChange} placeholder="Mã chuyến xe" required disabled={!!editing} />
                <input type="datetime-local" name="ThoiGianDi" value={form.ThoiGianDi} onChange={handleChange} required />
                <input type="datetime-local" name="ThoiGianVe" value={form.ThoiGianVe} onChange={handleChange} required />
                <input type="text" name="DiemDi" value={form.DiemDi} onChange={handleChange} placeholder="Điểm đi" required />
                <input type="text" name="DiemDen" value={form.DiemDen} onChange={handleChange} placeholder="Điểm đến" required />
                <input type="number" name="GiaVe" value={form.GiaVe} onChange={handleChange} placeholder="Giá vé" required />
                <input type="text" name="LoaiHinhChuyenDi" value={form.LoaiHinhChuyenDi} onChange={handleChange} placeholder="Loại hình chuyến đi" required />
                
                {/* Dropdown cho Biển số xe */}
                <select name="BienSoXe" value={form.BienSoXe} onChange={handleChange} required>
                    <option value="">Chọn biển số xe</option>
                    {xes.map(xe => (
                        <option key={xe.BienSoXe} value={xe.BienSoXe}>{xe.BienSoXe}</option>
                    ))}
                </select>

                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} chuyến xe</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
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
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {chuyenxes.slice((currentPage - 1) * chuyenxesPerPage, currentPage * chuyenxesPerPage).map(chuyenxe => (
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
                                <button onClick={() => handleEdit(chuyenxe)}>Sửa</button>
                                <button onClick={() => handleDelete(chuyenxe.MaCX)}>Xóa</button>
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
                <button disabled={currentPage * chuyenxesPerPage >= chuyenxes.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default ChuyenXeManager;
