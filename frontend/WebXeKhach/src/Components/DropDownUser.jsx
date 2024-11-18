import React from 'react';
import { useNavigate } from 'react-router-dom';

const DropDownUser= () => {
    const navigate = useNavigate();
    const logout = () => {
       localStorage.clear();
       navigate('/');
    } 
    return(
        <div className='flex flex-col dropDownUser'>
                 <li>Thông tin tài khoản</li>
                 <li>Lịch sử mua vé</li>
                 <li>Địa chỉ của bạn</li>
                 <li>Đặt lại mật khẩu</li>
                 <button onClick={logout}>Đăng xuất</button>        
        </div>
    )
}
export default DropDownUser