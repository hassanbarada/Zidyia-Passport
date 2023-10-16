// AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminHome from './AdminHome';
import Header from './Header';
import Sidebar from './Sidebar';
import './AdminHome.css';
import CreateCerticate from './CreateCertificate';
import CustomizableForm from './Customizable Form';
import RequestedCertificate from './RequestedCertificate';
import UploadedCertificate from './UploadedCertificate';

const AdminDashboard = () => {
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

    if (!token || role !== 'admin') {
      navigate('/Institutionlogin');
    }
  }, [navigate]);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} onStatusChange={setSelectedStatus} /> {/* Pass onStatusChange callback */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/createcertificate" element={<CreateCerticate />} />
        <Route path="/CustomizableForm" element={<CustomizableForm />} />
        <Route
          path="/RequestedCertificate"
          element={<RequestedCertificate selectedStatus={selectedStatus} />} 
        />
        <Route path="/UploadedCertificate" element={<UploadedCertificate selectedStatus={selectedStatus} />} />
        {/* Define more routes for admin components here */}
      </Routes>
    </div>
  );
};

export default AdminDashboard;
