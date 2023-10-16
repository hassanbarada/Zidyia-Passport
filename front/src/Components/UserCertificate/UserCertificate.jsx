import React, { useState, useEffect } from 'react';
import axios from "axios";
import './UserCertificate.css';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

function UserCertificate() {
  const [allCertificates, setAllCertificates] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const certificatesPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and role when the component mounts
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate('/login');
    }
  }, [navigate]);

  // Calculate the indexes of the certificates to display on the current page
  const indexOfLastCertificate = currentPage * certificatesPerPage;
  const indexOfFirstCertificate = indexOfLastCertificate - certificatesPerPage;
  const displayedCertificates = allCertificates.slice(
    indexOfFirstCertificate,
    indexOfLastCertificate
  );
  const totalPages = Math.ceil(allCertificates.length / certificatesPerPage);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const api = 'http://localhost:3001';
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchAllCertificates = async () => {
      try {
        const response = await axios.get(`${api}/getcertificaterequestoruploaded`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        // Separate uploaded and requested certificates into two arrays
        const uploadedCertificates = response.data.uploadedCertificates || [];
        const requestedCertificates = response.data.requestedCertificates || [];

        // Combine both uploaded and requested certificates into a single array
        const combinedCertificates = [
          ...uploadedCertificates.map(cert => ({ type: 'uploaded', data: cert })),
          ...requestedCertificates.map(cert => ({ type: 'requested', data: cert })),
        ];
console.log(combinedCertificates);
        setAllCertificates(combinedCertificates);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Token is not valid!");
          navigate('/login');
        } else {
          console.error("Error Fetching Data:", error);
        }
      }
    };

    fetchAllCertificates();
  }, []);

  const deleteCertificate = async () => {
    try {
      if (selectedCertificate !== null) {
        // Delete the certificate based on whether it's an upload or a request
        if (selectedCertificate.type === 'request') {
          await axios.delete(`${api}/deleteCertificateRequest/${selectedCertificate.requestID}`, {
            headers: {
              token: `Bearer ${token}`,
            },
        });
        } else {
          await axios.delete(`${api}/certificateUploadRoute/${selectedCertificate.certificateID}`);
        }

        // Refetch certificates after deletion
        

        // Close the delete modal
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const openDeleteModal = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedCertificate(null);
    setShowDeleteModal(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  return (
    <>
      <div className='bg'>
        <section className='UserCertificate-container'>
          {displayedCertificates.map((certificate, index) => (
            <div className='UserCertificate-card' key={index}>
              <img
                src={certificate.type === 'uploaded' ?
                  `${api}/certificateUploadPhoto/${certificate.data._id}/photo` :
                  `http://localhost:3001/getCertificatePhoto/${certificate.data.certificateID._id}/photo`}
                alt="Certificate"
                className='UserCertificate-card-image'
                onClick={() => handleImageClick(certificate.type === 'uploaded' ?
                  `${api}/certificateUploadPhoto/${certificate.data._id}/photo` :
                  `http://localhost:3001/getCertificatePhoto/${certificate.data.certificateID._id}/photo`)}
              />
              <h2 className='UserCertificate-card-headtwo'>
                {certificate.type === 'uploaded' ? 'Uploaded Certificate' : 'Requested Certificate'}
              </h2>
              <li className='UserCertificate-card-firstp'>
                Institution Name: "{certificate.type === 'uploaded' ?
                  certificate.data.institutionID.name || '' :
                  certificate.data.institutionID.name || ''}"
              </li>
              <li className='UserCertificate-card-firstp'>
                Name: "{certificate.type === 'uploaded' ?
                  certificate.data.name || '' :
                  certificate.data.certificateID.name || ''}"
              </li>
              <li className='UserCertificate-card-firstp'>
                Description: "{certificate.type === 'uploaded' ?
                  certificate.data.description || '' :
                  certificate.data.certificateID.description || ''}" 
              </li>
              <li className='UserCertificate-card-firstp'>
                Status: <span className={`statuscard-${certificate.data.status || ''}`}>
                  "{certificate.data.status || ''}"
                </span>
              </li>
              
  {certificate.data.status === 'Rejected' && (
    <li className='UserCertificate-card-firstp'>
      Reason: "<span className='colorthereason'>{certificate.type === 'uploaded' ?
      certificate.data.reason || '' :
      certificate.data.reason || ''}"</span>
 
</li> )}
              <div className='UserCertificatebtn'>
                <button
                  className={`UserCertificate-cancel ${certificate.data.status === 'Approved' || certificate.data.status === 'Rejected' ? 'disabled' : ''}`}
                  onClick={() => openDeleteModal(certificate.type === 'uploaded' ?
                    { certificateID: certificate.data._id, type: 'upload' } :
                    { requestID: certificate.data._id, type: 'request' })}
                  disabled={certificate.data.status === 'Approved' || certificate.data.status === 'Rejected'}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}


        </section>
        <div className='pagi'>{totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}</div>
        
      </div>
      

      {imageModalOpen && (
        <div className="image-modal">
          <span className="close-image-modal" onClick={closeImageModal}>
            x
          </span>
          <img src={selectedImage} alt="Certificate" className="modal-image" />
        </div>
      )}
      {showDeleteModal && (
        <div className="modal">
          <span className="close" title="Close Modal" onClick={closeDeleteModal}>
            x
          </span>
          <form className="modal-content">
            <div className="container">
              <h1 className="modal-header">Delete Certificate</h1>
              <p>Are you sure you want to delete this certificate?</p>

              <div className="clearfix">
                <button type="button" className="cancelbtn" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button type="button" className="deletebtn" onClick={deleteCertificate}>
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default UserCertificate;
