import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
import axios from 'axios';
import './CertificateUpload.css';
import { ToastContainer, toast } from "react-toastify";
import { useParams,useNavigate } from 'react-router-dom';
const CertificateUpload = () => {
    
        const [selectedFile, setSelectedFile] = useState(null);
        const [preview, setPreview] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [errors, setErrors] = useState({});
        const { institutionID } = useParams();
        const navigate = useNavigate();
        const api= "http://localhost:3001";
        const isblocked=localStorage.getItem('isblocked');


        useEffect(() => {
          // Check for token and role when the component mounts
          const token = localStorage.getItem('access_token');
          const role = localStorage.getItem('role');
      
          if (!token || role !== 'user') {
            navigate('/login');
          }
        }, [navigate]);

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            setSelectedFile(file);
        
            // Clear the validation error for the 'certificateFile' field if a file is selected
            if (file) {
              clearError('certificateFile');
            }
            
            if (file) {
              setSelectedFile(file);
          
              // Check if the selected file is an image or a PDF
              const isImage = file.type.startsWith('image/');
              const isPDF = file.type === 'application/pdf';
              
              // Create a URL for the selected file
              const fileURL = URL.createObjectURL(file);
          
              // Display a smaller preview based on the file type
              if (isImage) {
                // Create a smaller thumbnail by specifying width and height
                setPreview(<img src={fileURL} alt="Certificate Preview" borderRadius="2rem" width="70" height="70"  onClick={() => setShowModal(true)}/>);
              } else if (isPDF) {
                // Display a generic PDF icon as a thumbnail for PDF files
                setPreview(<img src="/pdf-icon.png" alt="PDF Preview" borderRadius="2rem" width="70" height="70"  onClick={() => setShowModal(true)}/>);
              } else {
                // Handle unsupported file types here
                setPreview(null);
              }
            } else {
              setSelectedFile(null);
              setPreview(null);
            }
          };
          
          

       

          
          
          const handleNameChange = (e) => {
            const value = e.target.value;
    setName(value);
    if (value.trim()) {
        clearError('name');
      }
          };
        
          const handleDescriptionChange = (e) => {
            const value = e.target.value;
            setDescription(value);
            if (value.trim()) {
                clearError('description');
          };}
          const clearError = (fieldName) => {
            // Create a copy of the errors state and remove the error for the specified field
            const updatedErrors = { ...errors };
            delete updatedErrors[fieldName];
            setErrors(updatedErrors);
          };

          const validateForm = () => {
            const errors = {};
            if (!name.trim()) {
              errors.name = 'Name is required*';
            }
            if (!description.trim()) {
              errors.description = 'Description is required*';
            }
            if (!selectedFile) {
              errors.certificateFile = 'Certificate file is required*';
            }
            
            setErrors(errors);
            return Object.keys(errors).length === 0;
          };


          const handleSubmit = async (e) => {
            e.preventDefault();
          
            if (validateForm()) {
               if(isblocked === "true"){
                toast.error("Sorry you are blocked", {
                  theme: "dark",
                });
              }
              else {
             
                const formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                formData.append('certificateFile', selectedFile);
          
                console.log('Form Data:', formData); // Log the form data
          
                const token = localStorage.getItem("access_token");
                const role = localStorage.getItem("role");
                console.log('Access Token:', token); // Log the token
          
                try {
                  console.log('Sending request to:', `http://localhost:3001/certificateUploadRoute/${institutionID}`);
          
                  const response = await axios.post(
                    `${api}/certificateUploadRoute/${institutionID}`,
                    formData,
                    {
                      headers: { 
                        token: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log('Response Data:', response.data); // Log the response data
                  console.log('Upload successful:', response.data);
                  window.location.reload();
                } catch (error) {
                  if (error.response && error.response.status === 403) {
                    console.log("Token is not valid!");
                    navigate('/login');
                  } else {
                    console.error("Cart Add failed:", error);
                  }
                }
              }
            }
              
            } 
          
          
          
  return (
    <div className="backgroundCU">
      <ToastContainer />
      <div className="Certificate-upload-form-container">
      
        <h2 className='headerCU'>Certificate Upload Form</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-groupCU">
          <label htmlFor="name"> Certificate name:</label>
          <input type="text" id="name" name="name"  className="inputNameCU"  onChange={handleNameChange}  />
          {errors.name && (
              <span className="error-name-message">{errors.name}</span>)}
              </div>

        <div className="form-groupCU">
          <label htmlFor="description">Description:</label>
          <textarea
          
            id="description"
            name="description"
            className={`inputDescriptionCU ${errors.description ? 'input-error' : ''}`}
            onChange={handleDescriptionChange}
          />
        </div>
        {errors.description && (
              <span className="error-name-message">{errors.description}</span>)}
       
        <div className="form-groupCU">
          
    {errors.institutionID && (
                <span style={{ marginTop:"-1.5rem" }} className="error-name-message">{errors.institutionID}</span>)}

<div className="form-groupCU1 ">
          <label htmlFor="certificateFile" className="custom-file-upload">Certificate File: <span className="choose-file-textCU">{selectedFile ? selectedFile.name : 'Choose a File'}</span>
          </label>
          <input
            type="file"
            id="certificateFile"
            name="certificateFile"
            className={`inputCertificateFileCU ${errors.certificateFile ? 'input-error' : ''}`}
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
          />
        {errors.certificateFile && (
            <span className="error-name-message">{errors.certificateFile}</span>)}
                <div className="certificate-preview">
  {selectedFile ? (
      /* Display the preview here */
      <div className='PreviewCU' onClick={() => setShowModal(true)}>{preview}</div>
      ) : (
          <p style={{ marginTop:"-1rem" }}></p>
          )}
          </div>
</div>

        </div>
<div className='buttonCU'>
        <button type="submit" className="submitButtonCU">
          Upload Certificate
        </button>
        </div>
      </form>
      </div>
            <div>
      {showModal && (
        <div className="image-upload-modal" onClick={() => setShowModal(false)}>
          {/* Add the image to be displayed in the modal */}
          {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Certificate Preview" />}
        </div>
      )}
        </div>

    </div>
  );
};

export default CertificateUpload;
