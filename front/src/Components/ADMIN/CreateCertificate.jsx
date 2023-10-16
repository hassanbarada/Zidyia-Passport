import React, { useState } from "react";
import axios from "axios";
import "./CreateCertificate.css"; 
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


function CreateCertificate() {
  const navigate = useNavigate();
  const api = "http://localhost:3001";
  const[name,setName]=useState("");
  const[description,setDescription]=useState("");
  const[image,setImage]=useState("");
  const [nameError, setnameError] = useState("");
  const [descriptionError, setdescriptionError] = useState("");
  const[imageError,setimageError]= useState("");

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

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };
  
  



  function CreateCertificatefromadmin(e) {
    e.preventDefault();

    setnameError('');
    setdescriptionError('');
    setimageError('');

    const token = localStorage.getItem('access_token');

    let isValid=true;

    if (!name) {
      toast.error("Certificate name is required.");
        isValid=false;
    }
    if (!description) {
      toast.error("Description is required.");
      isValid = false;
    } 
    if (!image) {
        toast.error("Image is required.");
        isValid = false;
      } 

      

    if (isValid) {
        const createcertificateData = new FormData();
        createcertificateData.append('name',name);
        createcertificateData.append('description',description);
        createcertificateData.append('image',image);

    axios.post(`${api}/createCertificate`, createcertificateData,
    {
        headers: {
          token: `Bearer ${token}`,
        },
    }
    )
      .then((response) => {
        console.log("Create Certificate successful!");
        console.log(response);
        notify();
        setName('');
        setDescription('');
        setImage('');
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

  return (
    <>
        
    <div className="createcertificate-admin-parent">

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
theme="dark"
/>
        <div className="createcertificate-admin-contentWithform">
        <h1 className="createcertificate-admin-headone">Create Certificate</h1>
           <form className="createcertificate-admin-createform" onSubmit={CreateCertificatefromadmin}>
        
            <div className="directiontocolumn">
            <label className="createcertificate-admin-label">Name:</label>
            <input
              type="text"
              className="createcertificate-admin-input"
              name="name"
              placeholder="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <span className="error-name-message">{nameError}</span>
            )}
            </div>
           <div className="directiontocolumn">
           <label className="createcertificate-admin-label">Description:</label>

           <input
              type="text"
              className="createcertificate-admin-input"
              name="description"
              id="description"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />            
            {descriptionError && (
              <span className="error-description-message">{descriptionError}</span>
            )}
           </div>
           <div className="directiontocolumn">
           <label className="createcertificate-admin-label">Image:</label>

           <input
              type="file"
              className="createcertificate-admin-input"
              name="image"
              id="image"
              accept="image/*"
              placeholder="image"
              onChange={(e) => handleImageChange(e)}            />    
            {imageError && (
              <span className="error-image-message">{imageError}</span>
            )}
           </div>
         <div className="centerthebutton">
              <button className="createbutton">Create</button>
         </div>
           
          
          
          
           
           </form>
        </div>
    </div>
  
   </> 
  );
}

export default CreateCertificate;
