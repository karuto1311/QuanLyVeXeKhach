import React from 'react';
import { Link } from 'react-router-dom';

const DropDownAcc= () => {
    return (
        <div className='flex flex-col dropDownAcc'>
            <li>
                <Link to="/crudcustomer" className="dropdown-link">
                    Quản lý khách hàng
                </Link>
            </li>
            <li>
                <Link to="/crudemployee" className="dropdown-link">
                    Quản lý nhân viên
                </Link>
            </li>
            <li>
                <Link to="/crudaccount" className="dropdown-link">
                    Quản lý tài khoản
                </Link>
            </li>
        </div>
    );
};

export default DropDownAcc;