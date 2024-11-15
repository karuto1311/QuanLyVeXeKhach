import React from 'react';
import { Navigate } from 'react-router-dom';

const DropDownAcc= () => {
    
    return(
        <div className='flex flex-col dropDownAcc'>
                 <li>Quản lý khách hàng</li>
                 <li>Quản lý nhân viên</li>
                 <li>Quản lý tài khoản</li>       
        </div>
    )
}
export default DropDownAcc