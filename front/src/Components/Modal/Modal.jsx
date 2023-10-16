import React, { useEffect, useState } from 'react'
import './Modal.css';
import axios from 'axios';
import { ReactComponent as SvgBackIcon } from '../../images/icons/Arrow.svg';
import { FaShare } from 'react-icons/fa'; 
import QRCode from 'qrcode';
import { ToastContainer, toast } from 'react-toastify';
import Sound from "../../mp3/Send.wav"

import { useNavigate } from 'react-router-dom';

const Modal = ({onClose, onSave,organizationId}) => {
    const [certificateUploads, setCertificateUploads]= useState([]);
    const [certificateRequests, setCertificateRequests]= useState([]);

    const api = "http://localhost:3001";
    const isblocked=localStorage.getItem('isblocked');

    const navigate = useNavigate();

    const notify = () => toast.success('Certificate Shared Successfully', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });



    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    useEffect(() => {
      
  
      if (!token || role !== 'user') {
        navigate('/login');
      }
    }, [navigate]);

    useEffect(() => {

        axios
        .get(`${api}/certificates/verified`,{
          headers: {
            token: `Bearer ${token}`,
          },
        
        })
        
        .then((response) => {
          // Update the institutions state with the fetched data
          setCertificateUploads(response.data.certificateUploads);
          setCertificateRequests(response.data.certificateRequests);
          console.log(response.data.certificateUploads);
          console.log(response.data.certificateRequests);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            console.log("Token is not valid!");
            navigate('/login');
          } else {
            console.error("Error Fetching Data:", error);
          }
          // Handle the error, e.g., set institutions to an empty array
          setCertificateUploads([]);
          setCertificateRequests([]);
        });
        
        }, []);  

        const handleShareUploaded = async (certificateUploadID) => {
          if(isblocked==="true"){
            toast.error("Sorry you are blocked",{
              theme: "dark",
            })            
          }
          else{
          try {
            const formData = new FormData();
        
           
        
            formData.append('certificateUploadID', certificateUploadID);
        
            const response = await axios.post(`${api}/create/${organizationId}`, formData,{
              headers: {
                token: `Bearer ${token}`,
              },
            });
        
            if (response.status === 200) {

              console.log('POST request response:', response.data.sharedCertificate._id);

              const qrcodeDataUrl = await QRCode.toDataURL(`/CredentialUrl/${response.data.sharedCertificate._id}`);
              const qrcodeBlob = await (await fetch(qrcodeDataUrl)).blob();
              // Log the QR code URL
              console.log('QR code URL:', qrcodeDataUrl);
              
              const putFormData = new FormData();

               putFormData.append('qrcode', qrcodeBlob); 
               putFormData.append('qrUrl', qrcodeDataUrl); 
      
            const putResponse = await axios.put(`http://localhost:3001/updateQrcode/${response.data.sharedCertificate._id}`, putFormData);
        
              if (putResponse.status === 200) {
                // Call the notify function here or resolve a promise to notify externally
                notify();
                audio.play();
              }else {
                console.error('Error sharing certificate:', putResponse);

              }
            }       
          } catch (error) {
            if (error.response && error.response.status === 400) {
              toast.error("Cannot share the same certificate to the same organization.",{
                theme:"dark"
              });
            } else {
              console.error('Error sharing certificate:', error);
            }
          }
        }
      };




        const handleShareRequested = async (certificateRequestID) => {
          if(isblocked==="true"){
            toast.error("Sorry you are blocked",{
              theme: "dark",
            })            
          } else{

          
          try {
            const formData = new FormData();
        
            // Append certificateRequestID as a field
            formData.append('certificateRequestID', certificateRequestID);
        
            // Do not append qrcode and qrUrl, leave them undefined
        
            const response = await axios.post(`${api}/create/${organizationId}`, formData, {
              headers: {
                token: `Bearer ${token}`,
              },
            });


            if (response.status === 200) {

              console.log('POST request response:', response.data.sharedCertificate._id);

              const qrcodeDataUrl = await QRCode.toDataURL(`/CredentialUrl/${response.data.sharedCertificate._id}`);
              const qrcodeBlob = await (await fetch(qrcodeDataUrl)).blob();
              // Log the QR code URL
              console.log('QR code URL:', qrcodeDataUrl);
              
              const putFormData = new FormData();

               putFormData.append('qrcode', qrcodeBlob); 
               putFormData.append('qrUrl', qrcodeDataUrl); 
      
            const putResponse = await axios.put(`http://localhost:3001/updateQrcode/${response.data.sharedCertificate._id}`, putFormData);
        
              if (putResponse.status === 200) {
                // Call the notify function here or resolve a promise to notify externally
                notify();
                audio.play();
              }else {
                console.error('Error sharing certificate:', putResponse);

              }
            }
          } catch (error) {
            if (error.response && error.response.status === 400) {
              toast.error("Cannot share the same certificate to the same organization.",{
                theme:"dark"
              });
            } else {
              console.error('Error sharing certificate:', error);
            }
          }
        }
      };
        
        const audio = new Audio(Sound);

  return (
    <>
    
    <div className='ModalOverlaySS'>
      
        <div className='ModalContentSS'>
            <div className='ModalWrapperSS'>
                <div className='CloseIconSS'>
<SvgBackIcon style={{ cursor:'pointer' }} onClick={onClose} />
                </div>
                <div  className='ModalFlexBodySS'>
                    <div className='TitleRowSS'>
                        <div>
                            select
                        </div>
                        <div className='ColoredTextSS'>
                        Certificates
                    </div>
                    </div>

{certificateUploads.length > 0 || certificateRequests.length > 0 ? (
  <>
{certificateUploads.map((certificateUpload) => (

  <div key={certificateUpload.id} className='CertificatesHolderSS'>
<img
  className='ImageModalSS'
  src={`http://localhost:3001/certificateUploadPhoto/${certificateUpload._id}/photo`}
  alt={`${certificateUpload.id}`}
/>
<div>
{certificateUpload.name}: {certificateUpload.description} 
</div>
<button onClick={() => {
  handleShareUploaded(certificateUpload._id);
}}>
  <FaShare />
</button>

</div>

))}
  
 {certificateRequests.map((certificateRequest) => (

  <div key={certificateRequest.id} className='CertificatesHolderSS'>
<img
  className='ImageModalSS'
  src={`http://localhost:3001/getCertificatePhoto/${certificateRequest.certificateID._id}/photo`}
  alt={`${certificateRequest.certificateID.id}`}
/>
<div>
{certificateRequest.certificateID.name}
 {/* {certificateRequest.certificateID.description}  */}
</div>
<button onClick={() => {
  handleShareRequested(certificateRequest._id);
}}>
  <FaShare />
</button>
</div>

  ))}
  </>
  ) : (
    <div className="NoCertificatesText">No Verified Certificates</div>
  )}
  

                </div>

            </div>
        </div>
    </div>
    </>
  )
}

export default Modal