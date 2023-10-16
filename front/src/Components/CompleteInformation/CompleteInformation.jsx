import React, { useState } from "react";
import axios from "axios";
import "./CompleteInformation.css"; 
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


function CompleteInformation(){

    const navigate = useNavigate();
  const api = "http://localhost:3001";
  const[profilePicture,setProfile]=useState("");
  const[location,setLocation]=useState("");
  const[bio,setBio]=useState("");
  const [profilePictureError, setProfileError] = useState("");
  const [locationError, setLocationError] = useState("");
  const[bioError,setBioError]= useState("");

  const handleImageChangefunction = (e) => {
    const selectedImage = e.target.files[0];
    setProfile(selectedImage);
  };

  const notify = () => toast.success('Profile Updated Successfully', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
  function handleCompleteInformation(e){

  e.preventDefault();

  setProfileError('');
  setLocationError('');
  setBioError('');

    const token = localStorage.getItem('access_token');
    const userID = localStorage.getItem('userId');

    let isValid=true;

    if (!profilePicture) {
      setProfileError("profile Picture is required.");
        isValid=false;
    }
    if (!location) {
      setLocationError("location is required.");
      isValid = false;
    } 
    if (!bio) {
        setBioError("Bio is required.");
        isValid = false;
      } 

      

    if (isValid) {
        const CompleteInformationData = new FormData();
        CompleteInformationData .append('profilePicture',profilePicture);
        CompleteInformationData .append('location',location);
        CompleteInformationData .append('bio',bio);
    

    axios.put(`${api}/updateProfile/${userID}`,  CompleteInformationData ,
    {
        headers: {
          token: `Bearer ${token}`,
        },
    }
    )
      .then((response) => {
        console.log("Complete Information successful!");
        console.log(response);
        notify();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log("Token is not valid!");
          navigate('/Institutionlogin');
        } else {
          console.error("Error Fetching Data:", error);
        }
      });
    }
}
  

    return(
        <>
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
         <div className="CompleteInformation-admin-parent">
        <div className="CompleteInformation-admin-contentWithform">
        <h1 className="CompleteInformation-admin-headone">Complete Your Information</h1>
           <form className="CompleteInformation-admin-createform" onSubmit={handleCompleteInformation} >
        
            <div className="directiontocolumn">
            <label className="CompleteInformation-admin-label">Profile Picture:</label>
            <input
              type="file"
              className="CompleteInformation-admin-input"
              name="profilePicture"
              id="image"
              accept="image/*"
              placeholder="image"
              onChange={(e) => handleImageChangefunction(e)} 
              />    
            {profilePictureError && (
              <span className="error-image-message">{profilePictureError}</span>
            )}
                   
            
          
            </div>
           <div className="directiontocolumn">
           <label className="CompleteInformation-admin-label">Location:</label>

           <input
              type="text"
              className="CompleteInformation-admin-input"
              name="location"
              id="location"
              placeholder="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
             
            />   
             {locationError && (
              <span className="error-image-message">{locationError}</span>
            )}         
         
           </div>
           <div className="directiontocolumn">
           <label className="CompleteInformation-admin-label">Bio:</label>
           <textarea
              className="CompleteInformation-admin-input"
              name="bio"
              placeholder="Enter your bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
             
            />
            {bioError && (
              <span className="error-image-message">{bioError}</span>
            )}    
          
           
           </div>
         <div className="centerthebutton">
              <button className="createbutton">Submit</button>
         </div>
           
          
          
          
           
           </form>
        </div>
    </div>
        </>
    )
}


export default CompleteInformation;