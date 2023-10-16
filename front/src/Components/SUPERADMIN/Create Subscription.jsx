import React, { useState, useEffect } from 'react';
import './Create Subscription.css';
import axios from 'axios';

const CreateSubscription = () => {
  // Initialize state to hold form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    position: '',
  });

  const api = "http://localhost:3001";


  // Initialize state to hold form errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    location: '',
    email: '',
    position: '',
  });

  // Initialize state to hold server error message
  const [serverError, setServerError] = useState('');

 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Special case for the selectedInstitution field
    if (name === 'institutionID') {
      setFormData({
        ...formData,
        institutionID: value, // Store the selected institution's ID
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
    }
    

    if (Object.keys(errors).length === 0) {
      // Form is valid, send a POST request using Axios
      try {
        const response = await axios.post(`${api}/createsubscription`, formData);

        if (response.status === 201) {
          // Handle success, e.g., display a success message
          console.log('Subscription created successfully');
          window.location.reload();
          
          // Clear form errors and reset form data
          setFormErrors({
            name: '',
            location: '',
            email: '',
            position: '',
          });
          setServerError('');
  
          
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          if (error.response.data ) {
            // Handle the duplicate email error
            setServerError('Email already exists. Please use a different email.');
          } else {
            // Handle other server errors
            setServerError('Subscription creation failed. Please try again later.');
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
      <div className='create-subscription-container'>
       
        {serverError && <div className='error-message'>{serverError}</div>}
        <form onSubmit={handleSubmit}>
        <h1 className='createsubscriptionh1'>Create Subscription</h1>
          <div className='create-subscription-container-form-container'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
            />
            {formErrors.name && <span className='error-message'>{formErrors.name}</span>}
          </div>
          <div className='create-subscription-container-form-container'>
            <label htmlFor='location'>Location:</label>
            <input
              type='text'
              placeholder='Location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
            />
            {formErrors.location && <span className='error-message'>{formErrors.location}</span>}
          </div>
          <div className='create-subscription-container-form-container'>
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
          <div className='create-subscription-container-form-container'>
            <label htmlFor='position'>Position:</label>
            <select
              name='position'
              className='designselect'
              value={formData.position}
              onChange={handleInputChange}
            >
              <option value=''>Position</option>
              <option value='HR'>HR</option>
              <option value='Admin'>Admin</option>
              <option value='Hiring manager'>Hiring Manager</option>
            </select>
            {formErrors.position && <span className='error-message'>{formErrors.position}</span>}
          </div>
          
          <button type='submit'>Add Subscription</button>
        </form>
      </div>
    </>
  );
};

export default CreateSubscription;
