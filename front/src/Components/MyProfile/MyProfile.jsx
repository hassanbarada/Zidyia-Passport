import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './MyProfile.css';
import profilepic from  "../../images/peopleprofile.jpg";
import {PiCertificate} from "react-icons/pi";
import {LiaCertificateSolid} from "react-icons/lia";
import {FaShareFromSquare} from "react-icons/fa6";
import defaultImage from "../../images/download.png";

function MyProfile(){
    const navigate=useNavigate();
    const api = 'http://localhost:3001';
    const token = localStorage.getItem('access_token');
    const userID = localStorage.getItem('userId');

    const [userData, setUserData] = useState({
        username: '',
        bio: '',
        email: '',
        profilePicture:''
      });
      const [certificateCounts, setCertificateCounts] = useState({
        uploadedCertificatesCount: 0,
        requestedCertificatesCount: 0,
        sharedCertificatesCount: 0
      });

      
  useEffect(() => {
    // Check for token and role when the component mounts
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate('/login');
    }
  }, [navigate]);
    
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`${api}/user/find/${userID}`,
            {
                headers: {
                  token: `Bearer ${token}`,
                },
              }); 
            const { username, bio, email,profilePicture } = response.data;
            console.log(response.data)
            setUserData({ username, bio, email,profilePicture });
          } catch (error) {
            if (error.response && error.response.status === 403) {
              console.log("Token is not valid!");
              navigate('/login');
            } else {
              console.error("Error Fetching Data:", error);
            }
          }
        };

        const fetchCertificateCounts = async () => {
            try {
              // Make an Axios request to get certificate counts (replace with your API endpoint)
              const response = await axios.get(`${api}/getUserCertificateCounts/${userID}`,  {
                headers: {
                  token: `Bearer ${token}`,
                },
              }); 
              setCertificateCounts(response.data);
            } catch (error) {
              console.error('Error fetching certificate counts:', error);
            }
          };
      
          fetchUserData();
          fetchCertificateCounts();
        }, []);

        const profilenavigate=() =>{            
            navigate("/CompleteInformation");
        }
      

    return(
        <>
        <div className='MyProfile-parent'>
            <div className='MyProfile-container'>
                <div className='MyProfile-image'>
                {userData.profilePicture ? (
                    <img src={`${api}/getUserPhoto/${userID}/photo`} alt="pic" className='circle-pic' />
                ):( <img src={defaultImage} alt="pic" className='circle-pic' />)}
                 
                </div>
                <div className='MyProfile-headers'>
                   <h2 className='responsivefontsize'><span className='colorspan'>Name:</span>  {userData.username}</h2>
                   <h2 className='responsivefontsize'><span className='colorspan'>Bio:</span>  {userData.bio}</h2>
                   <h3 className='responsivefontsize'><span className='colorspan'>Email:</span> {userData.email}</h3>
                </div>
                <div className='certificatestatistic-content'>
                    <div className='firstcertificatestatistic'>
                        <h3 className='responsivefontsizecard'>Uploaded Certificate:</h3>    
                        <div className='iconwithnumber'>
                            <PiCertificate className='myprofileicon'/> 
                            <span> {certificateCounts.uploadedCertificatesCount}</span>
                        </div>                    
                      
                    </div>
                    <div className='secondcertificatestatistic'>
                        <h3  className='responsivefontsizecard'>Requested Certificate:</h3> 
                        <div className='iconwithnumber'>
                           <LiaCertificateSolid  className='myprofileicon'/>
                           <span> {certificateCounts.requestedCertificatesCount}</span>
                        </div>
                    </div>
                    <div className='thirdcertificatestatistic'>
                        <h3  className='responsivefontsizecard'>Shared   Certificate:</h3> 
                        <div className='iconwithnumber'>
                          <FaShareFromSquare  className='myprofileicon'/> 
                          <span> {certificateCounts.sharedCertificatesCount}</span>
                          </div>
                    </div>
                </div>
                <botton className="MyProfile-edit" onClick={profilenavigate}>Edit Profile</botton>
                
            </div>
        </div>
        </>
    )
}

export default MyProfile;