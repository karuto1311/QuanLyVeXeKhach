/* import React from "react";
import { Link } from "react-router-dom";
import "../assets/Css/Navbar.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import DropDownUser from "./DropDownUser";
import Person from "../assets/person.png";
import "../assets/Css/DropDownUser.css";
import Arrow from "../assets/downArrow.png"

function Navbar() {
  const [openUser, setOpenUser] = useState(false);
  const [userData, setUserData] = useState({
    matk: '',
    email: '',
    password: '',
    makh: ''
  });
  const user = localStorage.getItem('user');
    try {
      setUserData({
        matk: user.data.matk||'',
        email: user.data.email||'',
        password: user.data.password||'',
        makh: user.data.makh||'',
      })
    }
     catch (err){
      console.log(err);
     }
  
  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="left-section">
          <div className="footer-note">@NamHai2004 - 20NamDongHanh</div>
        </div>
        <div className="logo-container">
          <img src={logo} alt="Xe Dai Nam" className="logo" />
        </div>
        {userData.email.length > 0 ? (
          <div className="loginbtn">
        <li>
          <img src={Person}/>
        </li>
        <li style={{color:'white', fontWeight:'bold'}}>
          {userData.matk}
        </li>
        <li>
          <img src={Arrow} width={25} height={25} onClick={() => setOpenUser((prev)=>!prev)}/>
        </li>   
                   
      </div>
        ) : (
          <div className="loginbtn">
          <li>
            <Link to="/login">
              <button>Đăng Nhập</button>
            </Link>
          </li>
          <li>
            <Link to="/register">
              <button>Đăng Ký</button>
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
          <Link to="/schedule">LỊCH TRÌNH</Link>
        </li>
        <li>
          <Link to="/ticket">TRA CỨU VÉ</Link>
        </li>
        <li>
          <Link to="/news">TIN TỨC</Link>
        </li>
        <li>
          <Link to="/contact">LIÊN HỆ</Link>
        </li>
        <li>
          <a href="/about">VỀ CHÚNG TÔI</a>
        </li>
      </ul>
      {
         openUser && <DropDownUser/>
      } 
    </nav>
  );
}

export default Navbar; */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/Css/Navbar.css";
import logo from "../assets/logo.png";
import DropDownUser from "./DropDownUser";
import Person from "../assets/person.png";
import "../assets/Css/DropDownUser.css";
import Arrow from "../assets/downArrow.png";

function Navbar() {
  const [openUser, setOpenUser] = useState(false);
  const [userData, setUserData] = useState({
    matk: '',
    email: '',
    password: '',
    makh: ''
  });
  
  useEffect(() => {
    
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the stringified user object
        setUserData({
          matk: parsedUser.MaTK || '',
          email: parsedUser.Email || '',
          password: parsedUser.Password || '',
          makh: parsedUser.MaKH || ''
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
        {userData.email.length > 0 ? (
          <div className="loginbtn">
            <li>
              <img src={Person} alt="User" />
            </li>
            <li style={{ color: 'white', fontWeight: 'bold' }}>
              {userData.matk}
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
            <li>
              <Link to="/register">
                <button>Đăng Ký</button>
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
          <Link to="/schedule">LỊCH TRÌNH</Link>
        </li>
        <li>
          <Link to="/ticket">TRA CỨU VÉ</Link>
        </li>
        <li>
          <Link to="/news">TIN TỨC</Link>
        </li>
        <li>
          <Link to="/contact">LIÊN HỆ</Link>
        </li>
        <li>
          <a href="/about">VỀ CHÚNG TÔI</a>
        </li>
      </ul>
      {openUser && <DropDownUser />}
    </nav>
  );
}

export default Navbar;