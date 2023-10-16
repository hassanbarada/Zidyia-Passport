// Header.jsx

import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle,  BsJustify } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

function Header({ OpenSidebar, onStatusChange }) {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const location = useLocation();
  const isRequestedUploadedCertificateRoute = location.pathname === '/superadmin/RequestedCertificate' || location.pathname === '/superadmin/UploadedCertificate';
  const isRequestedRoute = location.pathname  === '/superadmin/RequestedCertificate';
  const iseUploadedRoute = location.pathname === '/superadmin/UploadedCertificate';
  const isSubscriptionRoute = location.pathname === '/superadmin/SubscriptionsView';
  const isUsersRoute = location.pathname === '/superadmin/ViewAllUsers';
  const isHeaderRoute = location.pathname === '/superadmin' || location.pathname === '/superadmin/CreateInstitutionForm' || location.pathname === '/superadmin/CreateSubscription';
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    // Call the callback function to pass the selected status
    onStatusChange(event.target.value);
  };

  return (
    <header className="header-super">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      {isRequestedRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Requested Certificates</h2>)}
      {iseUploadedRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Uploaded Certificates</h2>)}
      {isHeaderRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Super Admin Dashboard</h2>)}
      {isSubscriptionRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Our Subscriptions</h2>)}
      {isUsersRoute && (<h2 style={{color:'white',fontFamily:'Core-Bold'}}>Our Users</h2>)}

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
