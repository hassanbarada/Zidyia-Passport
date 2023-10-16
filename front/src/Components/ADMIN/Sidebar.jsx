import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BsGrid1X2Fill,
  BsFillPlusSquareFill,
  BsFileEarmarkPlusFill,
  BsFileEarmarkText,
  BsFileEarmarkCheck,
  BsBoxArrowLeft,
} from 'react-icons/bs';
import logo from '../../images/logo1.png';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../tooltip/tooltip';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const closeSidebar = () => {
    if (openSidebarToggle) {
      OpenSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    navigate('/');

  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <img src={logo} alt="" /> Zidyia
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
      <NavLink to="/admin" onClick={closeSidebar}>
        <li className='sidebar-list-item'>
          <Tooltip  margin={15} text="Dashboard">
            <BsGrid1X2Fill id='first-svg' className='icon' /> <span>Dashboard</span>
          </Tooltip>
        </li>
        </NavLink>
        <NavLink to="/admin/createcertificate" onClick={closeSidebar}>
        <li className='sidebar-list-item'>
          <Tooltip  margin={15} text="Certificate">
            <BsFillPlusSquareFill className='icon' /> <span>Add Certificate</span>
          </Tooltip>
        </li>
        </NavLink>
        <NavLink to="/admin/CustomizableForm" onClick={closeSidebar}>
        <li className='sidebar-list-item'>
          <Tooltip  margin={15} text="Form">
            <BsFileEarmarkPlusFill className='icon' /> <span>Create Form</span>
          </Tooltip>
        </li>
        </NavLink>
        <NavLink to="/admin/RequestedCertificate" onClick={closeSidebar}>
        <li className='sidebar-list-item'>
        <Tooltip  margin={15} text="Requested">
            <BsFileEarmarkText className='icon' /> <span>Requested</span>
            </Tooltip>
        </li>
        </NavLink>
        <NavLink to="/admin/UploadedCertificate" onClick={closeSidebar}>
        <li className='sidebar-list-item'>
        <Tooltip  margin={15} text="Uploaded">
            <BsFileEarmarkCheck className='icon' /> <span>Uploaded</span>
          </Tooltip>
        </li>
        </NavLink>
        
        <li className='sidebar-list-item' onClick={handleLogout}>
          <a href="" onClick={closeSidebar}>
          <Tooltip  margin={15} text="Logout">
            <BsBoxArrowLeft className='icon' /> <span>Logout</span>
            </Tooltip>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
