import React from 'react';
import { Link } from 'react-router-dom';

const DropDownBus= () => {
    
    return(
        <div className='flex flex-col dropDownBus'>
            <li>
                <Link to="/crudbusstation" className="dropdown-link">
                    Quản lý bến xe
                </Link>
            </li>
            <li>
                <Link to="/crudbus" className="dropdown-link">
                    Quản lý xe
                </Link>
            </li>
                       
        </div>
    )
}
export default DropDownBus