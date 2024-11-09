import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BusStationManager = () => {
    const [stations, setStations] = useState([]); // Lưu trữ danh sách bến xe
    const [form, setForm] = useState({
        MaBX: '',
        TenBX: '',
        DiaChi: '',
        TinhThanh: ''
    });
    const [editing, setEditing] = useState(null); // Theo dõi việc chỉnh sửa bến xe
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const stationsPerPage = 5; // Số bến xe hiển thị trên mỗi trang

    // Lấy dữ liệu các bến xe từ server
    const fetchStations = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/benxe');
            setStations(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bến xe:', error);
            setMessage('Lỗi khi lấy danh sách bến xe.');
        }
    }, []);

    useEffect(() => {
        fetchStations();
    }, [fetchStations]);

    // Xử lý thay đổi giá trị nhập vào form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý gửi form thêm/cập nhật bến xe
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editing) {
                response = await axios.put(`http://localhost:8081/benxe/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/benxe', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Bến xe đã được thêm/cập nhật thành công!');
                setForm({
                    MaBX: '',
                    TenBX: '',
                    DiaChi: '',
                    TinhThanh: ''
                });
                setEditing(null);
                fetchStations();
            }
        } catch (error) {
            console.error('Lỗi khi gửi form bến xe:', error);
            setMessage('Không thể thêm/cập nhật bến xe. Vui lòng thử lại.');
        }
    };

    // Xử lý chỉnh sửa bến xe
    const handleEdit = (station) => {
        setForm(station);
        setEditing(station.MaBX);
    };

    // Xử lý xóa bến xe
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/benxe/${id}`);
            fetchStations();
            setMessage('Bến xe đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa bến xe:', error);
            setMessage('Không thể xóa bến xe. Vui lòng thử lại.');
        }
    };

    // Xử lý hủy form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaBX: '',
            TenBX: '',
            DiaChi: '',
            TinhThanh: ''
        });
    };

    return (
        <div className="bus-station-manager">
            <h2>Quản lý Bến Xe</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="MaBX"
                    value={form.MaBX}
                    onChange={handleChange}
                    placeholder="Mã Bến Xe"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="TenBX"
                    value={form.TenBX}
                    onChange={handleChange}
                    placeholder="Tên Bến Xe"
                    required
                />
                <input
                    type="text"
                    name="DiaChi"
                    value={form.DiaChi}
                    onChange={handleChange}
                    placeholder="Địa Chỉ"
                    required
                />
                <input
                    type="text"
                    name="TinhThanh"
                    value={form.TinhThanh}
                    onChange={handleChange}
                    placeholder="Tỉnh Thành"
                    required
                />
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} Bến Xe</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
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
                    {stations.slice((currentPage - 1) * stationsPerPage, currentPage * stationsPerPage).map(station => (
                        <tr key={station.MaBX}>
                            <td>{station.MaBX}</td>
                            <td>{station.TenBX}</td>
                            <td>{station.DiaChi}</td>
                            <td>{station.TinhThanh}</td>
                            <td>
                                <button onClick={() => handleEdit(station)}>Chỉnh sửa</button>
                                <button onClick={() => handleDelete(station.MaBX)}>Xóa</button>
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
                <button disabled={currentPage * stationsPerPage >= stations.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default BusStationManager;
