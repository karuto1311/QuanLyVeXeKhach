const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const { randomInt } = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "quanlyvexekhach",
   
});

// Hàm kiểm tra sự tồn tại của MaKH
const checkUniqueMaKH = (maKH) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM KHACHHANG WHERE MaKH = ?";
        db.query(sql, [maKH], (err, data) => {
            if (err) {
                return reject(err);
            }
            if (data.length > 0) {
                resolve(false); // Mã KH đã tồn tại
            } else {
                resolve(true); // Mã KH chưa tồn tại
            }
        });
    });
};

// Đăng ký người dùng
app.post("/signup", async (req, res) => {
    try {
        // Mã hóa mật khẩu
        const hashedPassword = bcrypt.hashSync(req.body.Password, 10);

        // Tạo mã khách hàng ngẫu nhiên
        let MaKH = randomInt(100000, 999999); // Tạo mã khách hàng từ 100000 đến 999999
        let isUnique = await checkUniqueMaKH(MaKH);

        // Kiểm tra mã khách hàng duy nhất
        while (!isUnique) {
            MaKH = randomInt(100000, 999999); // Tạo lại mã nếu trùng
            isUnique = await checkUniqueMaKH(MaKH);
        }
        let MaTK = randomInt(100000, 999999); // Tạo mã khách hàng từ 100000 đến 999999
        let isUnique2 = await checkUniqueMaKH(MaTK);
        while (!isUnique2) {
            MaTK = randomInt(100000, 999999); // Tạo lại mã nếu trùng
            isUnique = await checkUniqueMaKH(MaTK);
        }
        // Lưu thông tin khách hàng vào cơ sở dữ liệu
        const userData = {
            MaKH: MaKH,
            HoVaTen: req.body.HoVaTen,
            NgaySinh: req.body.NgaySinh,
            DiaChi: req.body.DiaChi,
            Email: req.body.Email,
            SDT: req.body.SDT,
        };

        const userSql = "INSERT INTO KHACHHANG SET ?";
        db.query(userSql, userData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error in Customer Registration" });
            }

            // Tạo tài khoản
            const accountData = {
                MaTK: MaTK,
                Email: req.body.Email,
                Password: hashedPassword,
                MaKH: MaKH,
            };

            const accountSql = "INSERT INTO TAIKHOAN SET ?";
            db.query(accountSql, accountData, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error in Account Creation" });
                }
                return res.json("Signup Success");
            });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Đăng nhập cho người dùng
app.post("/login", (req, res) => {
    const { Email, Password } = req.body; // Sử dụng req.body để lấy email và password

    const sql = "SELECT * FROM TAIKHOAN WHERE Email = ?";
    db.query(sql, [Email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error during login" });
        }

        if (data.length > 0) {
            const match = bcrypt.compareSync(Password, data[0].Password);
            if (match) {
                return res.json({ status: "Success", user: data[0] });
            } else {
                return res.status(400).json({ message: "Invalid credentials" });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    });
});

// CRUD cho KHACHHANG
// Tạo khách hàng
app.post("/khachhang", (req, res) => {
    const khachHangData = {
        MaKH: req.body.MaKH,
        HoVaTen: req.body.HoVaTen,
        NgaySinh: req.body.NgaySinh,
        DiaChi: req.body.DiaChi,
        Email: req.body.Email,
        SDT: req.body.SDT,
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
        HoVaTen: req.body.HoVaTen,
        NgaySinh: req.body.NgaySinh,
        DiaChi: req.body.DiaChi,
        Email: req.body.Email,
        SDT: req.body.SDT,
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
        HoVaTen: req.body.HoVaTen,
        NgaySinh: req.body.NgaySinh,
        DiaChi: req.body.DiaChi,
        Email: req.body.Email,
        SDT: req.body.SDT,
        NgayVaoLam: req.body.NgayVaoLam,
        PhongBan: req.body.PhongBan,
        ChucVu: req.body.ChucVu,
        UserName: req.body.UserName,
        Password: bcrypt.hashSync(req.body.Password, 10),
        Permission: req.body.Permission,
        Role: req.body.Role,
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
        HoVaTen: req.body.HoVaTen,
        NgaySinh: req.body.NgaySinh,
        DiaChi: req.body.DiaChi,
        Email: req.body.Email,
        SDT: req.body.SDT,
        NgayVaoLam: req.body.NgayVaoLam,
        PhongBan: req.body.PhongBan,
        ChucVu: req.body.ChucVu,
        UserName: req.body.UserName,
        Password: bcrypt.hashSync(req.body.Password, 10),
        Permission: req.body.Permission,
        Role: req.body.Role,
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
        LoaiXe: req.body.LoaiXe,
        SoGhe: req.body.SoGhe,
    };
    const sql = "INSERT INTO XE SET ?";
    db.query(sql, xeData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error creating bus" });
        }
        return res.json({ message: "Bus created successfully", id: result.insertId });
    });
});

// Đọc danh sách xe
app.get("/xe", (req, res) => {
    const sql = "SELECT * FROM XE";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching buses" });
        }
        return res.json(results);
    });
});

// Cập nhật xe
app.put("/xe/:id", (req, res) => {
    const xeData = {
        BienSo: req.body.BienSo,
        LoaiXe: req.body.LoaiXe,
        SoGhe: req.body.SoGhe,
    };
    const sql = "UPDATE XE SET ? WHERE MaXe = ?";
    db.query(sql, [xeData, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bus" });
        }
        return res.json({ message: "Bus updated successfully" });
    });
});

// Xóa xe
app.delete("/xe/:id", (req, res) => {
    const sql = "DELETE FROM XE WHERE MaXe = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting bus" });
        }
        return res.json({ message: "Bus deleted successfully" });
    });
});

// CRUD cho CHUYENXE
// Tạo chuyến xe
app.post("/chuyenxe", (req, res) => {
    const chuyenXeData = {
        MaChuyen: req.body.MaChuyen,
        MaXe: req.body.MaXe,
        MaBXDi: req.body.MaBXDi,
        MaBXDen: req.body.MaBXDen,
        NgayDi: req.body.NgayDi,
        GioDi: req.body.GioDi,
        SoLuongVe: req.body.SoLuongVe,
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
        MaBXDi: req.body.MaBXDi,
        MaBXDen: req.body.MaBXDen,
        NgayDi: req.body.NgayDi,
        GioDi: req.body.GioDi,
        SoLuongVe: req.body.SoLuongVe,
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
        MaKH: req.body.MaKH,
        MaChuyen: req.body.MaChuyen,
        NgayDat: req.body.NgayDat,
        GiaVe: req.body.GiaVe,
        SoGhe: req.body.SoGhe,
        TinhTrang: req.body.TinhTrang,  // Tình trạng vé (đã thanh toán, chưa thanh toán)
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
        MaKH: req.body.MaKH,
        MaChuyen: req.body.MaChuyen,
        NgayDat: req.body.NgayDat,
        GiaVe: req.body.GiaVe,
        SoGhe: req.body.SoGhe,
        TinhTrang: req.body.TinhTrang,  // Cập nhật tình trạng vé
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




const port = 8081;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
