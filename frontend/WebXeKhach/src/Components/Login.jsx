// import React, { useState } from "react";
// import "../assets/Css/Login.css";
// import axios from 'axios'
// import { Link, useNavigate } from 'react-router-dom';

// function Login() {
//   const[userData, setUserData] = useState({
//     Email:'',
//     Password:''
//     });
//   const navigate = useNavigate();

//   const handleSubmit= async (e) => {
//     e.preventDefault();
//     try {

//       const res = await axios.post('http://localhost:8081/login', userData);
//       localStorage.setItem('user',res.data.user);
//       if(res.data.user)
//         navigate('/schedule');
//       else
//       console.error(JSON.stringify(res));
//       console.error();
//     }
//     catch (err) {
//       console.error('Login error:', err.response?.data);
//       console.log(err);
//     }
//   };
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">ĐĂNG NHẬP</h2>
//         <div className="form-ticket">
//           <form>
//             <div className="form-group">
//               <input
//                 type="text"
//                 className="input-field"
//                 placeholder="Nhập Email"
//                 onChange={e => setUserData({...userData,Email:e.target.value})}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="password"
//                 className="input-field"
//                 placeholder="Mật khẩu"
//                 onChange={e => setUserData({...userData,Password:e.target.value})}
//               />
//             </div>
//             <div className="form-group">
//               <button className="button-ticket" onClick={handleSubmit}>Đăng nhập</button>
//             </div>
//             <a href="/forgotpassword" className="forgot-password">Quên mật khẩu?</a>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from "react";
import "../assets/Css/Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [userData, setUserData] = useState({
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu đăng nhập đến server
      const res = await axios.post("http://localhost:8081/login", userData);

      if (res.data.status === "Success") {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/schedule"); // Điều hướng đến trang lịch trình
      } else {
        console.error("Login failed:", res.data.message);
        alert("Đăng nhập thất bại, vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      alert("Lỗi đăng nhập. Vui lòng thử lại!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">ĐĂNG NHẬP</h2>
        <div className="form-ticket">
          <form onSubmit={handleSubmit}>
            <div className="form-group-rg">
              <label className="label-field">Email:</label>
              <input
                type="textxt"
                className="input-fieldd"
                placeholder="Nhập Email"
                value={userData.Email}
                onChange={(e) =>
                  setUserData({ ...userData, Email: e.target.value })
                }
              />
            </div>

            <div className="form-group-rg">
              <label className="label-field">Mật khẩu:</label>
              <input
                type="password"
                className="input-fieldd"
                placeholder="Mật khẩu"
                value={userData.Password}
                onChange={(e) =>
                  setUserData({ ...userData, Password: e.target.value })
                }
              />
            </div>

            <div className="form-group-rg">
              <button className="button-ticket" type="submitit">
                Đăng nhập
              </button>
            </div>

            <div className="form-group-rg">
              <a href="/forgotpassword" className="forgot-passwordj">
                Quên mật khẩu?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
