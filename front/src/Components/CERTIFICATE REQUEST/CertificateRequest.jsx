import React, { useState, useEffect } from 'react';
import './CertificateRequest.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

function CertificateRequest() {
  const [fetchedFormData, setFetchedFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State to hold error message
  const [formID, setFormID] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [selectedCertificateID, setSelectedCertificateID] = useState('');
  const [inputFieldValues, setInputFieldValues] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const isblocked=localStorage.getItem('isblocked');
  const navigate = useNavigate();
  const params = useParams();
  const institutionID = params.institutionID;

  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userId');

  const api= "http://localhost:3001";


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${api}/getCustomizableFormByInstitution/${institutionID}`
        );

        if (response.status === 200) {
          setFetchedFormData(response.data.customizableForm.fields);
          setFormID(response.data.customizableForm._id);
        } else if (response.status === 404) {
          toast.error('There is no form for this institution');
        } else {
          console.error('Error fetching form data:', response.status);
          setErrorMessage('There is no form for this institution');
        }
      } catch (error) {
        console.error('Error Fetching Data:', error);
        toast.error('There is no form for this institution');
      }
    };

    fetchFormData();
  }, [institutionID]);

  useEffect(() => {
    const fetchCertificatesByInstitution = async () => {
      try {
        const response = await axios.get(
          `${api}/getCertificatesbyInstitution/${institutionID}`
        );

        if (response.status === 200) {
          setCertificate(response.data.certificates);
        } else if (response.status === 404) {
          console.log('No certificates found for this institution');
        } else {
          console.error('Error fetching certificates:', response.status);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificatesByInstitution();
  }, [institutionID]);

  const handleCertificateChange = async (event) => {
    const selectedCertificateId = event.target.value;
  
    // Fetch the certificate photo URL
    if (selectedCertificateId) {
      
  
       
          setSelectedCertificateID(selectedCertificateId);
  
          // Open the image modal and display the certificate photo
          setSelectedImage(selectedCertificateId);
          setImageModalOpen(true);
        
    } else {
      // If no certificate is selected, close the image modal
      setSelectedImage(null);
      setImageModalOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputFieldValues({
      ...inputFieldValues,
      [name]: value,
    });
  };



  const closeImageModal = () => {
    setImageModalOpen(false);
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token');
  
    if (!selectedCertificateID) {
      toast.error('Please select a certificate.');
      return;
    }
  
    const requiredFields = fetchedFormData.filter((field) => field.isRequired);
    const missingFields = requiredFields.filter(
      (field) => !inputFieldValues[field.fieldName]
    );
  
    if (missingFields.length > 0) {
      toast.error('Please fill out all required fields.');
      return;
    }
    if(isblocked === "true"){
      toast.error("Sorry you are blocked", {
        theme: "dark",
      });
    }
    
    else{
  
    try {
      // Create the certificate request
      const certificateRequestResponse = await axios.post(
        `${api}/createCertificateRequest/${institutionID}/${formID}/${selectedCertificateID}`,
        {},
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
  
      if (certificateRequestResponse.status === 201) {
       
        console.log('Captured certificateRequestID:', certificateRequestResponse.data._id);
        console.log('Certificate Request Response:', certificateRequestResponse);
        const certificateRequestID = certificateRequestResponse.data._id;

        // Make sure certificateRequestID is not undefined or empty
        if (!certificateRequestResponse.data._id) {
          console.error('Error: certificateRequestID is missing or empty.');
          return;
        }
  
       
  
        // Save form values along with the certificateRequestID
        const formValuesResponse = await axios.post(
          `${api}/store-values/${formID}/${selectedCertificateID}/${certificateRequestID}`,
          inputFieldValues,
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
  
        if (formValuesResponse.status === 201) {
          console.log('Input field values stored successfully');
          window.location.reload();
        } else {
          console.error('Error storing input field values:', formValuesResponse.status);
          setErrorMessage('Error storing input field values.');
        }
      } else {
        console.error('Error creating certificate request:', certificateRequestResponse.status);
        setErrorMessage('Error creating certificate request.');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("Token is not valid!");
        navigate('/login');
      } else {
        console.error("Certificate request failed:", error);
      }
    }
  }
};

  return (
    <>
    <div className="certificate-request-form-container">
      <ToastContainer />
      <div className="Certificate-request-form-container">
        <h2>Certificate Request Form</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {fetchedFormData ? (
          <form onSubmit={handleSubmit}>
            {fetchedFormData.map((field, index) => (
              <div key={index} className="form-group">
                <label htmlFor={field.fieldName}>
                  {field.isRequired && <span className="required-span">*</span>}
                  {field.fieldName}
                </label>
                <input
                  id={field.fieldName}
                  name={field.fieldName}
                  placeholder={field.fieldName}
                  type={field.fieldType}
                  className="inputDescriptionCU"
                  onChange={handleInputChange}
                />
              </div>
            ))}
            {certificate && certificate.length > 0 ? (
  <div className="custom-select">
    <select
      name="certificateID"
      value={selectedCertificateID}
      onChange={handleCertificateChange}
    >
      <option value="">Select a Certificate</option>
      {certificate.map((item) => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
) : (
  <p>No certificates available for this institution.</p>
)}
            <div className="buttonCU">
              <button type="submit" className="submitButtonCU">
                Request Certificate
              </button>
            </div>
          </form>
        ) : (
          <p>No form available for this institution.</p>
        )}
      </div>
    </div>

    {imageModalOpen && (
  <div className="image-modal">
    <span className="close-image-modal" onClick={closeImageModal}>
      x
    </span>
    <img src={`${api}/getCertificatePhoto/${selectedImage}/photo`} alt={selectedImage} className="modal-image" />
  </div>
)}
  </>
  );
}

export default CertificateRequest;
