import React from 'react';
import { Navigate } from 'react-router-dom';

const DropDownUser= () => {
    const logout = () => {
       localStorage.clear();
       
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