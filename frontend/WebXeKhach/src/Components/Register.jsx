// import React, { useState } from "react";
// import "../assets/Css/Register.css";
// import { Link, Navigate } from "react-router-dom";
// import axios from "axios";

// function Register() {
//   const [userData,setUserData]=useState({
//     HoVaTen: '',
//     NgaySinh: '',
//     DiaChi: '',
//     Email: '',
//     SDT: '',
//     Password:''
//   });
//   const [rePassword,setRePassword]=useState('');
//   const handleSubmit= async (e) => {
//     e.preventDefault();
//     try{
//       if (rePassword!==userData.Password)
//       {
//         alert("Nhập lại mật khẩu không khớp");
//         console.log(rePassword);
//         console.log(userData.Password);
//       }
//       else{
//       const res = await axios.post('http://localhost:8081/signup', userData);
//       alert("thành công");
//       Navigate('/schedule');
//     }}
//     catch(err){
//       console.log(err);
//     }
//   }
//   return (
//     <div className="rg-container">
//       <div className="rg-box">
//         <h2 className="rg-title">ĐĂNG KÝ TÀI KHOẢN</h2>
//         <div className="form-ticket-register">
//           <form>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="name">
//                 Họ và tên:
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 className="input-field"
//                 placeholder="Nhập họ và tên"
//                 onChange={e => setUserData({...userData, HoVaTen:e.target.value})}
//               />
//             </div>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="dob">
//                 Ngày sinh:
//               </label>
//               <input
//                 type="date"
//                 id="dob"
//                 className="input-field"
//                 placeholder="Ngày sinh"
//                 onChange={e => setUserData({...userData, NgaySinh:e.target.value})}
//               />
//             </div>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="email">
//                 Email:
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="input-field"
//                 placeholder="Nhập email"
//                 onChange={e => setUserData({...userData, Email:e.target.value})}
//               />
//             </div>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="phone">
//                 Số điện thoại:
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 className="input-field"
//                 placeholder="Nhập số điện thoại"
//                 onChange={e => setUserData({...userData, SDT:e.target.value})}
//               />
//             </div>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="password">
//                 Mật khẩu:
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="input-field"
//                 placeholder="Nhập mật khẩu"
//                 onChange={e => setUserData({...userData, Password:e.target.value})}
//               />
//             </div>
//             <div className="form-group-rg">
//               <label className="input-text" htmlFor="confirmPassword">
//                 Nhập lại mật khẩu:
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 className="input-field"
//                 placeholder="Nhập lại mật khẩu"
//                 onChange={e => setRePassword(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <button className="button-ticket" onClick={handleSubmit}>Đăng ký</button>
//             </div>
//             <Link to="/login" className="forgot-password">
//               Bạn đã có tài khoản? Đăng nhập
//             </Link>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import "../assets/Css/Register.css";
import { Link, useNavigate } from "react-router-dom"; // useNavigate instead of Navigate
import axios from "axios";

function Register() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [userData, setUserData] = useState({
    HoVaTen: "",
    NgaySinh: "",
    DiaChi: "",
    Email: "",
    SDT: "",
    Password: "",
  });
  const [rePassword, setRePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to handle errors

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !userData.HoVaTen ||
      !userData.Email ||
      !userData.SDT ||
      !userData.Password ||
      !rePassword
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (rePassword !== userData.Password) {
      setErrorMessage("Nhập lại mật khẩu không khớp");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/signup", userData);
      console.log(res); // Log the response to see if the server returns anything
      if (res.status === 200) {
        alert("Đăng ký thành công!");
        navigate("/schedule");
      }
    } catch (err) {
      console.log(err.response); // Log the detailed error response
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="rg-container">
      <div className="rg-box">
        <h2 className="rg-title">ĐĂNG KÝ TÀI KHOẢN</h2>
        <div className="form-ticket-register">
          <form>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="HoVaTen">
                Họ và tên:
              </label>
              <input
                type="textxt"
                id="HoVaTen"
                className="input-field"
                placeholder="Nhập họ và tên"
                onChange={handleInputChange}
                value={userData.HoVaTen}
              />
            </div>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="NgaySinh">
                Ngày sinh:
              </label>
              <input
                type="date"
                id="NgaySinh"
                className="input-field"
                onChange={handleInputChange}
                value={userData.NgaySinh}
              />
            </div>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="Email">
                Email:
              </label>
              <input
                type="emaill"
                id="Email"
                className="input-field"
                placeholder="Nhập email"
                onChange={handleInputChange}
                value={userData.Email}
              />
            </div>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="SDT">
                Số điện thoại:
              </label>
              <input
                type="tell"
                id="SDT"
                className="input-field"
                placeholder="Nhập số điện thoại"
                onChange={handleInputChange}
                value={userData.SDT}
              />
            </div>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="Password">
                Mật khẩu:
              </label>
              <input
                type="password"
                id="Password"
                className="input-field"
                placeholder="Nhập mật khẩu"
                onChange={handleInputChange}
                value={userData.Password}
              />
            </div>
            <div className="form-group-rg">
              <label className="input-text" htmlFor="rePassword">
                Nhập lại mật khẩu:
              </label>
              <input
                type="password"
                id="rePassword"
                className="input-field"
                placeholder="Nhập lại mật khẩu"
                onChange={(e) => setRePassword(e.target.value)}
                value={rePassword}
              />
            </div>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}{" "}
            {/* Display error message */}
            <div className="form-group-rg">
              <button className="button-ticket" onClick={handleSubmit}>
                Đăng ký
              </button>
            </div>
            <div className="form-link">
              <Link to="/login" className="forgot-password">
                Bạn đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
