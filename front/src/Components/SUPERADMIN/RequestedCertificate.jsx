import React, { useEffect, useState } from 'react';
import './RequestedCertificate.css';
import image from '../../images/image1.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CirclesWithBar } from 'react-loader-spinner';
import { BsThreeDots } from "react-icons/bs";

function RequestedCertificate(props) {
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const[studentIformation, setStudentIformation] = useState(null);
  const api= "http://localhost:3001";


  useEffect(() => {
    const status = props.selectedStatus;

    axios
      .get(`${api}/getCertificateRequestsByStatusForAllInstitutions/${status}`)
      .then((response) => {
        setCertificateRequests(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log('Token is not valid!');
          navigate('/Institutionlogin');
        } else {
          console.error('Error Fetching Data:', error);
        }
      });
  }, [props.selectedStatus]);

  

  const studentopenModal = () => {
    setStudentModalOpen(true);
  };

  // Function to close the modal
  const studentcloseModal = () => {
    setStudentModalOpen(false);
    setStudentIformation(null);
  };


  

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

 

    const fetchStudentInformation = (certificateID, studentID,certificateRequestID) => {
      studentopenModal()
      axios
        .get(`${api}/getFormValuesByStudentID/${studentID}/${certificateID}/${certificateRequestID}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data); // Log the entire response
          if (Array.isArray(response.data.dynamicFields)) {
            setStudentIformation(response.data.dynamicFields);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            console.log('Token is not valid!');
            navigate('/Institutionlogin');
          } else {
            console.error('Error Fetching Data:', error);
          }
        });
  }


  if (isLoading) {
    return (
      <div className='loading'>
        <CirclesWithBar
          height="100"
          width="100"
          color="rgb(70, 241, 207)"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          outerCircleColor=""
          innerCircleColor=""
          barColor=""
          ariaLabel='circles-with-bar-loading'
        />
      </div>
    );
  }

  return (
    <>
      {certificateRequests.length === 0 ? (
        <div className="no-requests-message-super">No requests found.</div>
      ) : (
        <div className="requested-certificate-container-super">
          {certificateRequests.map((item, index) => (
            <div className="requested-ceritificate-card" key={index}>
              <button className='request-more-btn' onClick={() => fetchStudentInformation(item.certificateID._id, item.studentID._id,item._id)}><BsThreeDots /></button>
              <div className="img-box" onClick={() => handleImageClick(`${api}/getCertificatePhoto/${item.certificateID._id}/photo`)}>
                <img src={`http://localhost:3001/getCertificatePhoto/${item.certificateID._id}/photo`} alt={`${item.certificateID.id}`} />
              </div>
              <div className="content">
                <h3>{item.certificateID.name}</h3>
                <div className="list">
                  <li>
                    <strong>_Requested By:</strong> {item.studentID.username}
                  </li>
                  <li>
                    <strong>_Student email:</strong> {item.studentID.email}
                  </li>
                  <li>
                    <strong>_Status:</strong>
                    <span className={getStatusColorClass(item.status)}>{item.status}</span>
                  </li>
                </div>
                <div className='institution-name-superadmin'>Institution Name: {item.institutionID.name}</div>
                
                
              </div>
            </div>
          ))}
        </div>
      )}

{imageModalOpen && (
  <div className="image-modal">
    <span className="close-image-modal" onClick={closeImageModal}>
      x
    </span>
    <img src={selectedImage} alt="Certificate" className="modal-image" />
  </div>
)}



{studentModalOpen && (
  <div className="modal">
    <span className="close" title="Close Modal" onClick={studentcloseModal}>
      x
    </span>
    <form className="modal-content">
      <div className="container">
        <h1 style={{fontFamily:"Core-Bold",color:"#2D3741"}}>This Informations has been obtained from the Request Form</h1>
        {Array.isArray(studentIformation) && (
          studentIformation.map((item, index) => (
            <div key={index} className='user-request-more-information'>
              <div className='user-request-more-information-one'>
                <label htmlFor="">{item.key}:</label>
                <h3>{item.value}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </form>
  </div>
)}
      
    </>
  );

  function getStatusColorClass(status) {
    switch (status) {
      case 'Pending':
        return 'blue-text';
      case 'Rejected':
        return 'red-text';
      case 'Approved':
        return 'green-text';
      default:
        return '';
    }
  }
}

export default RequestedCertificate;
