import React from 'react';
import { Link } from 'react-router-dom';

const DropDownTravel = () => {
    
    return(
        <div className='flex flex-col dropDownTravel'>
            <li>
                <Link to="/crudbustrip" className="dropdown-link">
                    Quản lý chuyến xe
                </Link>
            </li>
            <li>
                <Link to="/crudtripparticipants" className="dropdown-link">
                    Phân công nhân viên
                </Link>
            </li>
                   
        </div>
    )
}
export default DropDownTravel