import React ,{ useState,useEffect } from 'react'
import axios from "axios"
import './UploadedCertificate.css'


function UploadedCertificate(props) {
  const [certificates, setCertificates] = useState([]);
 
  const [selectedImage, setSelectedImage] = useState(null);
const [imageModalOpen, setImageModalOpen] = useState(false);


  const api= "http://localhost:3001";
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const status = props.selectedStatus;

    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${api}/getUploadRequestsByStatusForAllInstitutions/${status}`); 
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [props.selectedStatus]); // Empty dependency array to run the effect only once

  

 

  

  

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };
  

  return (
    <>
        <div className='uploaded-certificate-container-super'>
          {certificates.map((certificate) => (
            <div className="uploaded-ceritificate-card" key={certificate._id}>
              <div className="uploadedimg-box" onClick={() => handleImageClick(`${api}/certificateUploadPhoto/${certificate._id}/photo`)}>
  <img src={`${api}/certificateUploadPhoto/${certificate._id}/photo`} alt="Certificate" />
</div>
              <div className="uploaded-content">
                <h3>{certificate.name}</h3>
                <div className="uploaded-list">
                  <li>
                    <strong>Requested By:</strong> {certificate.studentID.firstname}
                  </li>
                  <li>
                    <strong>Student email:</strong> {certificate.studentID.email}
                  </li>
                  <li>
                    <strong>Status:</strong> <span className={`status-${certificate.status}`}>{certificate.status}</span>
                  </li>
                </div>
                <div className='institution-name-superadmin'>Institution Name: {certificate.institutionID.name}</div>

                
                
              </div>
            </div>
          ))}
        </div>
        {imageModalOpen && (
  <div className="image-modal">
    <span className="close-image-modal" onClick={closeImageModal}>
      x
    </span>
    <img src={selectedImage} alt="Certificate" className="modal-image" />
  </div>
)}

      
    </>
  );
}

export default UploadedCertificate