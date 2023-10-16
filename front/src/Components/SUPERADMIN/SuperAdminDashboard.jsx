// AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminHome from './AdminHome';
import Header from './Header';
import Sidebar from './Sidebar';
import './AdminHome.css';
import RequestedCertificate from './RequestedCertificate';
import UploadedCertificate from './UploadedCertificate';
import CreateInstitutionForm from './Create Institution Form';
import CreateSubscription from './Create Subscription';
import SubscriptionsView from './SubscriptionsView';
import ViewAllUsers from './ViewAllUsers';

const SuperAdminDashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All'); // State to store the selected status

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and role when the component mounts
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'superAdmin') {
      navigate('/Institutionlogin');
    }
  }, [navigate]);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} onStatusChange={setSelectedStatus} /> {/* Pass onStatusChange callback */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/CreateInstitutionForm" element={<CreateInstitutionForm />} />
        <Route path="/CreateSubscription" element={<CreateSubscription />} />
        <Route
          path="/RequestedCertificate"
          element={<RequestedCertificate selectedStatus={selectedStatus} />} 
        />
        <Route path="/UploadedCertificate" element={<UploadedCertificate selectedStatus={selectedStatus} />} />
        <Route path="/ViewAllUsers" element={<ViewAllUsers />} />
        {/* Define more routes for admin components here */}
        <Route path='/SubscriptionsView' element={<SubscriptionsView/>}></Route>
      </Routes>
    </div>
  );
};

export default SuperAdminDashboard;
