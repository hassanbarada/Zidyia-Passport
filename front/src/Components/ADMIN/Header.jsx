// Header.jsx

import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle,  BsJustify } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

function Header({ OpenSidebar, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const location = useLocation();
  const isRequestedUploadedCertificateRoute = location.pathname === '/admin/RequestedCertificate' || location.pathname === '/admin/UploadedCertificate';
  const isRequestedRoute = location.pathname  === '/admin/RequestedCertificate';
  const iseUploadedRoute = location.pathname === '/admin/UploadedCertificate';
  const isHeaderRoute = location.pathname === '/admin' || location.pathname === '/admin/createcertificate' || location.pathname === '/admin/CustomizableForm';
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    // Call the callback function to pass the selected status
    onStatusChange(event.target.value);
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      {isRequestedRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Requested Certificate</h2>)}
      {iseUploadedRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Uploaded Certificate</h2>)}
      {isHeaderRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Dashboard</h2>)}

      <div className="header-left">
        {isRequestedUploadedCertificateRoute && (
          <>
              <select name="" id="" value={selectedStatus} onChange={handleStatusChange}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              
            
          </>
        )}
      </div>
      
    </header>
  );
}

export default Header;
