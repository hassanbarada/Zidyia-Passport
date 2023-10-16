import React, { useState } from 'react';
import './Create Institution Form.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const CreateInstitutionForm = () => {
  // Initialize state to hold form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
  });

  const api = "http://localhost:3001";

  const notify = () => toast.success('Certificate Added Successfully', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });


  // Initialize state to hold form errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    location: '',
    email: '',
  });

  // Initialize state to hold server error message
  const [serverError, setServerError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous server error messages
    setServerError('');

    // Validate the form
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }

    if (Object.keys(errors).length === 0) {
      // Form is valid, send a POST request using Axios
      try {
        const response = await axios.post(`${api}/createInstitution`, formData);

        if (response.status === 201) {
          // Handle success, e.g., display a success message
          console.log('Institution created successfully');
          notify();
          
           // Clear form errors and reset form data
        setFormErrors({
            name: '',
            location: '',
            email: '',
          });
          setServerError('');
  
          // Optionally, redirect or perform other actions on success

        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          if (error.response.data ) {
            // Handle the duplicate email error
            setServerError('Email already exists. Please use a different email.');
          } else {
            // Handle other server errors
            setServerError('Institution creation failed. Please try again later.');
          }
        } else {
          // Handle network or other errors
          setServerError('An error occurred. Please check your internet connection and try again.');
        }
      }
    } else {
      // Set form errors
      setFormErrors(errors);
    }
  };

  return (
    <>
      <div className='create-institution-container'>
      <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={true}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
       
        {serverError && <div className='error-message'>{serverError}</div>}
        <form onSubmit={handleSubmit}>
        <h1 className='createinstitutionh1'>Create Institution</h1>
          <div className='create-institution-container-form-container'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              placeholder='Name'
              value={formData.name}
              onChange={handleInputChange}
            />
            {formErrors.name && <span className='error-message'>{formErrors.name}</span>}
          </div>
          <div className='create-institution-container-form-container'>
            <label htmlFor='location'>Location:</label>
            <input
              type='text'
              name='location'
              placeholder='Location'
              value={formData.location}
              onChange={handleInputChange}
            />
            {formErrors.location && <span className='error-message'>{formErrors.location}</span>}
          </div>
          <div className='create-institution-container-form-container'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              placeholder='Email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
            />
            {formErrors.email && <span className='error-message'>{formErrors.email}</span>}
          </div>
          <button type='submit'>Add Institution</button>
        </form>
      </div>
    </>
  );
};

export default CreateInstitutionForm;
