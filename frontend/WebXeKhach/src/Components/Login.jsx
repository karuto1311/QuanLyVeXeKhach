import React, { useState } from "react";
import "../assets/Css/Login.css";
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const navigate = useNavigate(); 
 

  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/login', { email, password });
      localStorage.setItem('user',res.data.user);
      navigate('/schedule')
    } 
    catch (err) {
      console.error('Login error:', err.response?.data);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">ĐĂNG NHẬP</h2>
        <div className="form-ticket">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Nhập Email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="input-field"
                placeholder="Mật khẩu"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button className="button-ticket">Đăng nhập</button>
            </div>
            <a href="/forgotpassword" className="forgot-password">Quên mật khẩu?</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
