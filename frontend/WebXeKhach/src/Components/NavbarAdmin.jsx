import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/Css/Navbar.css";
import logo from "../assets/logo.png";
import DropDownUser from "./DropDownUser";
import DropDownAcc from "./DropDownAcc";
import DropDownBus from "./DropDownBus";
import DropDownTravel from "./DropDownTravel";
import Person from "../assets/person.png";
import "../assets/Css/DropDownUser.css";
import "../assets/Css/DropDownAcc.css";
import "../assets/Css/dropDownBus.css";
import "../assets/Css/DropDownTravel.css";
import Arrow from "../assets/downArrow.png";

function Navbar() {
  const [openUser, setOpenUser] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const [openBus, setOpenBus] = useState(false);
  const [openTravel, setOpenTravel] = useState(false);
  const [staffData, setStaffData] = useState({
    Email:'',
    Password:'',
    HoVaTen:'',
    MaNV:''
  })
  
  useEffect(() => {
    
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the stringified user object
        setStaffData({
          HoVaTen: parsedUser.HoVaTen || '',
          Email: parsedUser.Email || '',
          Password: parsedUser.Password || '',
          MaNV: parsedUser.MaNV || ''
        });
      } catch (err) {
        console.error('Error parsing user data from localStorage:', err);
      }
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="left-section">
          <div className="footer-note">@NamHai2004 - 20NamDongHanh</div>
        </div>
        <div className="logo-container">
          <img src={logo} alt="Xe Dai Nam" className="logo" />
        </div>
        {staffData.Email.length > 0 ? (
          <div className="loginbtn">
            <li>
              <img src={Person} alt="User" />
            </li>
            <li style={{ color: 'white', fontWeight: 'bold' }}>
              {staffData.HoVaTen}
            </li>
            <li>
              <img
                src={Arrow}
                width={25}
                height={25}
                alt="Arrow"
                onClick={() => setOpenUser((prev) => !prev)}
              />
            </li>
          </div>
        ) : (
          <div className="loginbtn">
            <li>
              <Link to="/login">
                <button>Đăng Nhập</button>
              </Link>
            </li>
            
          </div>
        )}
      </div>
      <ul className="navbar-bottom">
        <li>
          <Link to="/">TRANG CHỦ</Link>
        </li>
        <li>
          <Link onClick={() => setOpenAcc((prev) => !prev)}>QUẢN LÝ NGƯỜI DÙNG</Link>
        </li>
        <li>
          <Link onClick={() => setOpenBus((prev) => !prev)}>QUẢN LÝ BẾN</Link>
        </li>
        <li>
          <Link onClick={() => setOpenTravel((prev) => !prev)}>QUẢN LÝ CHUYẾN XE</Link>
        </li>
        <li>
          <Link to="/crudticket">QUẢN LÝ VÉ</Link>
        </li>
        
      </ul>
      {openUser && <DropDownUser />}
      {openAcc && <DropDownAcc />}
      {openBus && <DropDownBus />}
      {openTravel && <DropDownTravel />}
    </nav>
  );
}

export default Navbar;