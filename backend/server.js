const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "QuanLyVeXeKhach",
});

// Đăng ký người dùng
app.post("/signup", (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const userData = {
        CCCD: req.body.CCCD,
        HoVaTen: req.body.HoVaTen,
        NgaySinh: req.body.NgaySinh,
        DiaChi: req.body.DiaChi,
        Email: req.body.Email,
        SDT: req.body.SDT,
    };

    // Thêm thông tin người dùng vào bảng NGUOIDUNG
    const userSql = "INSERT INTO NGUOIDUNG SET ?";
    db.query(userSql, userData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error in User Registration" });
        }

        // Tạo tài khoản
        const accountData = {
            MaTK: req.body.MaTK,
            LoaiTK: req.body.LoaiTK,
            UserName: req.body.UserName,
            Password: hashedPassword,
            CCCD: req.body.CCCD,
        };
        
        const accountSql = "INSERT INTO TAIKHOAN SET ?";
        db.query(accountSql, accountData, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error in Account Creation" });
            }
            return res.json("Signup Success");
        });
    });
});

// Đăng nhập cho người dùng
app.post("/login", (req, res) => {
    const sql = "SELECT * FROM TAIKHOAN WHERE UserName = ?";
    db.query(sql, [req.body.UserName], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error during login" });
        }
        if (data.length > 0) {
            const match = bcrypt.compareSync(req.body.Password, data[0].Password);
            if (match) {
                return res.json({ status: "Success", User: data[0] });
            } else {
                return res.json("Invalid credentials");
            }
        } else {
            return res.json("User not found");
        }
    });
});

// CRUD cho KHACHHANG
// Tạo khách hàng
app.post("/khachhang", (req, res) => {
    const khachHangData = {
        MaKH: req.body.MaKH,
        CCCD: req.body.CCCD,
    };
    const sql = "INSERT INTO KHACHHANG SET ?";
    db.query(sql, khachHangData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating customer" });
        }
        return res.json({ message: "Customer created successfully", id: result.insertId });
    });
});

// Đọc danh sách khách hàng
app.get("/khachhang", (req, res) => {
    const sql = "SELECT * FROM KHACHHANG";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching customers" });
        }
        return res.json(results);
    });
});

// Cập nhật khách hàng
app.put("/khachhang/:id", (req, res) => {
    const khachHangData = {
        MaKH: req.body.MaKH,
        CCCD: req.body.CCCD,
    };
    const sql = "UPDATE KHACHHANG SET ? WHERE MaKH = ?";
    db.query(sql, [khachHangData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating customer" });
        }
        return res.json({ message: "Customer updated successfully" });
    });
});

// Xóa khách hàng
app.delete("/khachhang/:id", (req, res) => {
    const sql = "DELETE FROM KHACHHANG WHERE MaKH = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting customer" });
        }
        return res.json({ message: "Customer deleted successfully" });
    });
});

// CRUD cho NHANVIEN
// Tạo nhân viên
app.post("/nhanvien", (req, res) => {
    const nhanVienData = {
        MaNV: req.body.MaNV,
        NgayVaoLam: req.body.NgayVaoLam,
        PhongBan: req.body.PhongBan,
        ChucVu: req.body.ChucVu,
        TruongPhong: req.body.TruongPhong,
        CCCD: req.body.CCCD,
    };
    const sql = "INSERT INTO NHANVIEN SET ?";
    db.query(sql, nhanVienData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating employee" });
        }
        return res.json({ message: "Employee created successfully", id: result.insertId });
    });
});

// Đọc danh sách nhân viên
app.get("/nhanvien", (req, res) => {
    const sql = "SELECT * FROM NHANVIEN";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching employees" });
        }
        return res.json(results);
    });
});

// Cập nhật nhân viên
app.put("/nhanvien/:id", (req, res) => {
    const nhanVienData = {
        MaNV: req.body.MaNV,
        NgayVaoLam: req.body.NgayVaoLam,
        PhongBan: req.body.PhongBan,
        ChucVu: req.body.ChucVu,
        TruongPhong: req.body.TruongPhong,
        CCCD: req.body.CCCD,
    };
    const sql = "UPDATE NHANVIEN SET ? WHERE MaNV = ?";
    db.query(sql, [nhanVienData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating employee" });
        }
        return res.json({ message: "Employee updated successfully" });
    });
});

// Xóa nhân viên
app.delete("/nhanvien/:id", (req, res) => {
    const sql = "DELETE FROM NHANVIEN WHERE MaNV = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting employee" });
        }
        return res.json({ message: "Employee deleted successfully" });
    });
});

// CRUD cho BENXE
// Tạo bến xe
app.post("/benxe", (req, res) => {
    const benXeData = {
        MaBX: req.body.MaBX,
        TenBX: req.body.TenBX,
        DiaChi: req.body.DiaChi,
        TinhThanh: req.body.TinhThanh,
    };
    const sql = "INSERT INTO BENXE SET ?";
    db.query(sql, benXeData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating bus station" });
        }
        return res.json({ message: "Bus station created successfully", id: result.insertId });
    });
});

// Đọc danh sách bến xe
app.get("/benxe", (req, res) => {
    const sql = "SELECT * FROM BENXE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching bus stations" });
        }
        return res.json(results);
    });
});

// Cập nhật bến xe
app.put("/benxe/:id", (req, res) => {
    const benXeData = {
        TenBX: req.body.TenBX,
        DiaChi: req.body.DiaChi,
        TinhThanh: req.body.TinhThanh,
    };
    const sql = "UPDATE BENXE SET ? WHERE MaBX = ?";
    db.query(sql, [benXeData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bus station" });
        }
        return res.json({ message: "Bus station updated successfully" });
    });
});

// Xóa bến xe
app.delete("/benxe/:id", (req, res) => {
    const sql = "DELETE FROM BENXE WHERE MaBX = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting bus station" });
        }
        return res.json({ message: "Bus station deleted successfully" });
    });
});

// CRUD cho XE
// Tạo xe
app.post("/xe", (req, res) => {
    const xeData = {
        MaXe: req.body.MaXe,
        BienSo: req.body.BienSo,
        SoGhe: req.body.SoGhe,
        LoaiXe: req.body.LoaiXe,
        MaBX: req.body.MaBX,
    };
    const sql = "INSERT INTO XE SET ?";
    db.query(sql, xeData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating vehicle" });
        }
        return res.json({ message: "Vehicle created successfully", id: result.insertId });
    });
});

// Đọc danh sách xe
app.get("/xe", (req, res) => {
    const sql = "SELECT * FROM XE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching vehicles" });
        }
        return res.json(results);
    });
});

// Cập nhật xe
app.put("/xe/:id", (req, res) => {
    const xeData = {
        BienSo: req.body.BienSo,
        SoGhe: req.body.SoGhe,
        LoaiXe: req.body.LoaiXe,
        MaBX: req.body.MaBX,
    };
    const sql = "UPDATE XE SET ? WHERE MaXe = ?";
    db.query(sql, [xeData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating vehicle" });
        }
        return res.json({ message: "Vehicle updated successfully" });
    });
});

// Xóa xe
app.delete("/xe/:id", (req, res) => {
    const sql = "DELETE FROM XE WHERE MaXe = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting vehicle" });
        }
        return res.json({ message: "Vehicle deleted successfully" });
    });
});

// CRUD cho CHUYENXE
// Tạo chuyến xe
app.post("/chuyenxe", (req, res) => {
    const chuyenXeData = {
        MaChuyen: req.body.MaChuyen,
        MaXe: req.body.MaXe,
        ThoiGianDi: req.body.ThoiGianDi,
        ThoiGianDen: req.body.ThoiGianDen,
        DiaDiemDi: req.body.DiaDiemDi,
        DiaDiemDen: req.body.DiaDiemDen,
    };
    const sql = "INSERT INTO CHUYENXE SET ?";
    db.query(sql, chuyenXeData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating trip" });
        }
        return res.json({ message: "Trip created successfully", id: result.insertId });
    });
});

// Đọc danh sách chuyến xe
app.get("/chuyenxe", (req, res) => {
    const sql = "SELECT * FROM CHUYENXE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching trips" });
        }
        return res.json(results);
    });
});

// Cập nhật chuyến xe
app.put("/chuyenxe/:id", (req, res) => {
    const chuyenXeData = {
        MaXe: req.body.MaXe,
        ThoiGianDi: req.body.ThoiGianDi,
        ThoiGianDen: req.body.ThoiGianDen,
        DiaDiemDi: req.body.DiaDiemDi,
        DiaDiemDen: req.body.DiaDiemDen,
    };
    const sql = "UPDATE CHUYENXE SET ? WHERE MaChuyen = ?";
    db.query(sql, [chuyenXeData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating trip" });
        }
        return res.json({ message: "Trip updated successfully" });
    });
});

// Xóa chuyến xe
app.delete("/chuyenxe/:id", (req, res) => {
    const sql = "DELETE FROM CHUYENXE WHERE MaChuyen = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting trip" });
        }
        return res.json({ message: "Trip deleted successfully" });
    });
});

// CRUD cho VE
// Tạo vé
app.post("/ve", (req, res) => {
    const veData = {
        MaVe: req.body.MaVe,
        MaChuyen: req.body.MaChuyen,
        MaKH: req.body.MaKH,
        SoGhe: req.body.SoGhe,
        NgayDat: req.body.NgayDat,
        TinhTrang: req.body.TinhTrang,
    };
    const sql = "INSERT INTO VE SET ?";
    db.query(sql, veData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating ticket" });
        }
        return res.json({ message: "Ticket created successfully", id: result.insertId });
    });
});

// Đọc danh sách vé
app.get("/ve", (req, res) => {
    const sql = "SELECT * FROM VE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching tickets" });
        }
        return res.json(results);
    });
});

// Cập nhật vé
app.put("/ve/:id", (req, res) => {
    const veData = {
        MaChuyen: req.body.MaChuyen,
        MaKH: req.body.MaKH,
        SoGhe: req.body.SoGhe,
        NgayDat: req.body.NgayDat,
        TinhTrang: req.body.TinhTrang,
    };
    const sql = "UPDATE VE SET ? WHERE MaVe = ?";
    db.query(sql, [veData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating ticket" });
        }
        return res.json({ message: "Ticket updated successfully" });
    });
});

// Xóa vé
app.delete("/ve/:id", (req, res) => {
    const sql = "DELETE FROM VE WHERE MaVe = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting ticket" });
        }
        return res.json({ message: "Ticket deleted successfully" });
    });
});

// Chạy ứng dụng trên cổng 3001
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
