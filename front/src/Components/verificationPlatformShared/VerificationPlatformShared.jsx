import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './VerificationPlatformShared.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerificationPlatformShared = () => {
  const[sharedCertificates, setSharedCertificates] = useState([]);
  const [filterInput, setFilterInput] = useState('');


  const [scanResult, setScanResult] = useState(null);
  const [manualSerialNumber, setManualSerialNumber] = useState('');
  const [subscribtion, setSubscribtion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);

  const navigate = useNavigate();

  const api = 'http://localhost:3001'

  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Check for token and role when the component mounts
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'subscriber') {
      navigate('/SubscriptionLogin');
    }
  }, [navigate]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const config = {
      headers: {
        token: `Bearer ${token}`,
      },
    };

    axios.get(`${api}/getSubscriptionById`, config)
      .then(response => {
        setSubscribtion(response.data.subscription);
        console.log(response.data.subscription);
        if (!response.data.subscription.notified) {
          openModal(); 
        }
        if(response.data.subscription.role !== role){
          navigate('/SubscriptionLogin');
        }
      })
      .catch(error => {
        console.error('Error fetching Subscription data:', error);
      });
  }, []);

  const updatePassword = async ( password) => {
    try {
      // Make a PUT request to update the certificate status with a reason
      const response = await axios.put(
        `${api}/updateSubscriptionPassword`,
        { password }, 
        {
          headers: {
            token: `Bearer ${token}`,
          },
      }
      );
  
      if (response.status === 200) {
        closeModal();
      }
    } catch (error) {
      console.error('Error Updatine Password:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    let isScanning = true;

    scanner.render(success, error);

    function success(result) {
      if (isScanning) {
        scanner.clear();
        setScanResult(result);
        isScanning = false; // Set isScanning to false to stop further scanning
      }
    }

    function error(err) {
      console.warn(err);
    }
  }, []);

  function handleManualSerialNumberChange(event) {
    setManualSerialNumber(event.target.value);
  }



  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
const subscriberID = localStorage.getItem("userId");
console.log(subscriberID);


  useEffect(() => {

    axios
    .get(`${api}/getSharedCertificateBySubscriber/${subscriberID}`,{
      headers: {
        token: `Bearer ${token}`,
      },
    
    })
    
    .then((response) => {
      // Update the institutions state with the fetched data
      setSharedCertificates(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        console.log('Token is not valid!');
        navigate('/Institutionlogin');
      } else {
        console.error('Error Fetching Data:', error);
      }
      setSharedCertificates([]);
    });
    
    }, []);  
  


    
  return (
    <>
    <div className='BackgroundVP'>
      <div className='AboveTableHolder'>
          <div className='TitlesWithSearch'>
              <div className='TitlesWrapper'>
                    <h2>Verified Certificates</h2>
                    <input className='inputSS'
            type='text'
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder='Search for verifications...'
            />
              </div>
          </div>
     </div>
     
   

      <div className='TableSection'>
      <div className="QrScannerVP">
      <h1>QR Scanning Code</h1>
      {scanResult ? (
        <div>
          <p>Success: <a href={scanResult}>{scanResult}</a></p>
          <p>Serial Number: {scanResult.slice(-16)}</p>
        </div>
      ) : (
        <div>
          <div id="reader"></div>
          {/* <p className="center-text">Or enter the serial number manually:</p>
          <div className="center-input">
            <input
              type="text"
              value={manualSerialNumber}
              onChange={handleManualSerialNumberChange}
            />
            {manualSerialNumber && (
              <p>Serial Number: {manualSerialNumber.slice(-16)}</p>
            )}
          </div> */}
        </div>
      )}
        </div>
      <div className='StudentNameSectionHolder'>
        {/* Students */}
         <div className='StudentNameSection'>
         {sharedCertificates
      .filter((sharedCertificate) => {
        // Filter by student name, certificate name, and date
        const studentName =
          sharedCertificate.certificateUploadID?.studentID?.username ||
          sharedCertificate.certificateRequestID?.studentID?.username;
        const certificateName =
          sharedCertificate.certificateUploadID?.certificateID?.name ||
          sharedCertificate.certificateRequestID?.certificateID?.name;
          const institutionName =
                  sharedCertificate.certificateUploadID?.institutionID?.name ||
                  sharedCertificate.certificateRequestID?.institutionID?.name;
        const formattedDate = formatDate(sharedCertificate.createdAt);

                return (
                  (filterInput.trim() === '' ||
        studentName?.toLowerCase().includes(filterInput.toLowerCase()) ||
        certificateName?.toLowerCase().includes(filterInput.toLowerCase()) ||
        institutionName?.toLowerCase().includes(filterInput.toLowerCase()) ||
        formattedDate.toLowerCase().includes(filterInput.toLowerCase()))
    );
  }).map((sharedCertificate) => (
            <div key={sharedCertificate._id}>
              {(sharedCertificate.certificateUploadID || sharedCertificate.certificateRequestID) && (
                <div className='MainHolderVP'>
                  <div className='NameSectionWrapperVP'>
                    <h2 className='StudentNameVP'>
                      {sharedCertificate.certificateUploadID?.studentID?.username || sharedCertificate.certificateRequestID?.studentID?.username}
                      </h2>
                    <div className='SectionsWrapperVP'>
                      <div className='InfoDivsVP'>
                    <p style={{ color:"#5DD3B3" }}> Certified in </p>
                      {sharedCertificate.certificateUploadID?.name || sharedCertificate.certificateRequestID?.certificateID?.name}
                      </div>
                      <div className='InfoDivsVP'>

                      <p style={{ color:"#5DD3B3" }}> Verified by </p>
                      {sharedCertificate.certificateUploadID?.institutionID?.name || sharedCertificate.certificateRequestID?.institutionID?.name}
                      </div>
                      <div className='InfoDivsVP'>

                      <p style={{ color:"#5DD3B3" }}> Shared on </p>
                      {formatDate(sharedCertificate.createdAt)}
                      </div>
                      <div className='InfoDivsVPQR'>
                      {sharedCertificate.certificateUploadID ? (
                        
                        <img className='ImgStylingCU2' src={`http://localhost:3001/photo/${sharedCertificate._id}`} alt="Certificate Upload" />
                      ) : sharedCertificate.certificateRequestID ? (
                        <img className='ImgStylingCU2' src={`http://localhost:3001/photo/${sharedCertificate._id}`} alt="Certificate Request" />
                      ) : null} 
                        <a
        href={sharedCertificate.qrUrl}
        download 
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className='dwnldQrBtn'>Download qr file</button>
      </a>
                      {/* {formatDate(sharedCertificate.createdAt)} */}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
         </div>
     </div>
     </div>
     
    </div>


    {showModal && (
        <div className="modal">
          
          <form className="modal-content">
            <div className="container">
              <h1 style={{color:'black'}}> Create New Password</h1>
              
              <input placeholder='newPassword' className='new-password-input'  value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}/>
{newPasswordRequired && (
  <div className="error-message">The New Password is required.</div>
)}
              <div className="clearfix">
                
                <button type="button" className="deletebtn"  onClick={() => {
              if (newPassword) {
                updatePassword(newPassword);
              }else {
                // Show the "reason is required" message
                setNewPasswordRequired(true);
              }
             
            }}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default VerificationPlatformShared