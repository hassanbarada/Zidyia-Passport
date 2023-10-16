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
  const [firstshowModal, firstsetShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonRequired, setRejectReasonRequired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const[studentIformation, setStudentIformation] = useState(null);
  const api= "http://localhost:3001";


  useEffect(() => {
    const status = props.selectedStatus;

    axios
      .get(`${api}/getCertificateRequestsByStatusAndInstitution/${status}`, {
        headers: {
          token: `Bearer ${token}`,
        },
      })
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

  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  const firstopenModal = () => {
    firstsetShowModal(true);
  };

  // Function to close the modal
  const firstcloseModal = () => {
    firstsetShowModal(false);
  };

  const studentopenModal = () => {
    setStudentModalOpen(true);
  };

  // Function to close the modal
  const studentcloseModal = () => {
    setStudentModalOpen(false);
    setStudentIformation(null);
  };


  const acceptCertificate = async (certificateId) => {
    try {
      // Make a PUT request to update the certificate status
      const response = await axios.put(
        `${api}/updateCertificateStatusToVerified/${certificateId}`,
        {},
        {
          headers: {
            token: `Bearer ${token}`,
          },
      }
      );
      if (response.status === 200) {
        // If the request was successful (status code 200), refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error accepting certificate:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const rejectCertificate = async (certificateId, reason) => {
    try {
      // Make a PUT request to update the certificate status with a reason
      const response = await axios.put(
        `${api}/updateCertificateStatusToRejected/${certificateId}`,
        { reason }, // Pass the reason in the request body
        {
          headers: {
            token: `Bearer ${token}`,
          },
      }
      );
  
      if (response.status === 200) {
        // If the request was successful (status code 200), refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejecting certificate:', error);
      // Handle the error (e.g., show an error message to the user)
    }
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
        <div className="no-requests-message">No requests found.</div>
      ) : (
        <div className="requested-certificate-container">
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
                  <div className='liwithbtnreq'>
                  <strong>StudentID:</strong>
                  <button onClick={() => handleImageClick(`${api}/getUserIDPhoto/${item.studentID._id}`)}
                         className='buttonviewreq'>click here</button>
                  </div>
               
                </li>
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
                <div>
                <button className={`uploaded-first-button ${item.status === 'Approved' || item.status === 'Rejected' ? 'disabled' : ''}`}onClick={() => {
    setSelectedCertificateId(item._id);
    firstopenModal();
  }}
  disabled={item.status === 'Approved' || item.status === 'Rejected'}
  >Approve</button>
  <button className={`uploaded-second-button ${item.status === 'Approved' || item.status === 'Rejected' ? 'disabled' : ''}`}onClick={() => {
    setSelectedCertificateId(item._id);
    openModal();
  }}
  disabled={item.status === 'Approved' || item.status === 'Rejected'}
  >Reject</button>
                </div>
                
                
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

{firstshowModal && (
        <div className="modal">
          <span className="close" title="Close Modal" onClick={firstcloseModal}>
            x
          </span>
          <form className="modal-content">
            <div className="container">
              <h1>Accept Certificate</h1>
              <p>Are you sure you want to accept this certificate?</p>

              <div className="clearfix">
                <button type="button" className="cancelbtn" onClick={firstcloseModal}>
                  Cancel
                </button>
                <button type="button" className="acceptbtn"   onClick={() => {
        if (selectedCertificateId) {
          acceptCertificate(selectedCertificateId);
        }
        firstcloseModal();
      }}>
                  Accept
                </button>
              </div>
            </div>
          </form>
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
      {showModal && (
        <div className="modal">
          <span className="close" title="Close Modal" onClick={closeModal}>
            x
          </span>
          <form className="modal-content">
            <div className="container">
              <h1>Reject Certificate</h1>
              <p>Are you sure you want to reject this certificate?</p>
              <textarea placeholder='reason' className='reject-textarea'  value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}/>
{rejectReasonRequired && (
  <div className="error-message">The reason is required.</div>
)}
              <div className="clearfix">
                <button type="button" className="cancelbtn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="button" className="deletebtn"  onClick={() => {
              if (rejectReason) {
                rejectCertificate(selectedCertificateId, rejectReason);
                closeModal();
              }else {
                // Show the "reason is required" message
                setRejectReasonRequired(true);
              }
             
            }}>
                  Reject
                </button>
              </div>
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
