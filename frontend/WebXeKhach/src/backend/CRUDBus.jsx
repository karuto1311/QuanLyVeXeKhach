import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const VehicleManager = () => {
    const [vehicles, setVehicles] = useState([]);
    const [stations, setStations] = useState([]);
    const [form, setForm] = useState({
        BienSoXe: '',
        LoaiXe: '',
        SoChoNgoi: '',
        HangSanXuat: '',
        NamSanXuat: '',
        MaBX: ''
    });
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState('');

    const fetchVehicles = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/xe');
            setVehicles(response.data);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu xe:', error);
            setMessage('Không thể lấy dữ liệu xe.');
        }
    }, []);

    const fetchStations = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/benxe');
            if (response.data.length === 0) {
                setMessage('Không có bến xe nào.');
            } else {
                setStations(response.data);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu bến xe:', error);
            setMessage('Không thể lấy dữ liệu bến xe.');
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
            setMessage('Vui lòng chọn Mã Bến Xe hợp lệ.');
            return;
        }
        try {
            let response;
            if (editing) {
                // Cập nhật xe
                response = await axios.put(`http://localhost:8081/xe/${editing}`, form);
            } else {
                // Thêm xe mới
                response = await axios.post('http://localhost:8081/xe', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Thêm/Cập nhật xe thành công!');
                setForm({
                    BienSoXe: '',
                    LoaiXe: '',
                    SoChoNgoi: '',
                    HangSanXuat: '',
                    NamSanXuat: '',
                    MaBX: ''
                });
                setEditing(null);
                fetchVehicles();
            }
        } catch (error) {
            console.error('Lỗi khi gửi biểu mẫu xe:', error);
            setMessage('Không thể thêm/cập nhật xe. Vui lòng thử lại.');
        }
    };

    const handleEdit = (vehicle) => {
        setForm(vehicle);
        setEditing(vehicle.BienSoXe);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa xe này không?');
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:8081/xe/${id}`);
            if (response.status === 200) {
                fetchVehicles();
                setMessage('Xóa xe thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa xe:', error);
            setMessage('Không thể xóa xe. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({
            BienSoXe: '',
            LoaiXe: '',
            SoChoNgoi: '',
            HangSanXuat: '',
            NamSanXuat: '',
            MaBX: ''
        });
    };

    return (
        <div className="vehicle-manager">
            <h2>Quản lý xe</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="BienSoXe"
                    value={form.BienSoXe}
                    onChange={handleChange}
                    placeholder="Biển số xe"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="LoaiXe"
                    value={form.LoaiXe}
                    onChange={handleChange}
                    placeholder="Loại xe"
                    required
                />
                <input
                    type="number"
                    name="SoChoNgoi"
                    value={form.SoChoNgoi}
                    onChange={handleChange}
                    placeholder="Số chỗ ngồi"
                    required
                />
                <input
                    type="text"
                    name="HangSanXuat"
                    value={form.HangSanXuat}
                    onChange={handleChange}
                    placeholder="Hãng sản xuất"
                    required
                />
                <input
                    type="number"
                    name="NamSanXuat"
                    value={form.NamSanXuat}
                    onChange={handleChange}
                    placeholder="Năm sản xuất"
                    required
                />
                <select name="MaBX" value={form.MaBX} onChange={handleChange} required>
                    <option value="">Chọn Mã Bến Xe</option>
                    {stations.map((station) => (
                        <option key={station.MaBX} value={station.MaBX}>
                            {station.MaBX} - {station.TenBX}
                        </option>
                    ))}
                </select>
                <button type="submit">{editing ? 'Cập nhật' : 'Thêm'} Xe</button>
                {editing && <button onClick={handleCancel}>Hủy</button>}
            </form>

            <table>
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
                    {vehicles.map(vehicle => (
                        <tr key={vehicle.BienSoXe}>
                            <td>{vehicle.BienSoXe}</td>
                            <td>{vehicle.LoaiXe}</td>
                            <td>{vehicle.SoChoNgoi}</td>
                            <td>{vehicle.HangSanXuat}</td>
                            <td>{vehicle.NamSanXuat}</td>
                            <td>{vehicle.MaBX}</td>
                            <td>
                                <button onClick={() => handleEdit(vehicle)}>Sửa</button>
                                <button onClick={() => handleDelete(vehicle.BienSoXe)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleManager;
