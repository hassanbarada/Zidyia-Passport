import axios from 'axios';
import './StudentViewSubs.css'
import { useState, useEffect } from "react";
import Tooltip from '../tooltip/tooltip';
import Modal from '../Modal/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// import {  ReactComponent as SvgUpload } from "../../images/icons"
const SvgUpload = require("../../images/icons/upload_1.svg").ReactComponent
const SvgEmail = require("../../images/icons/Email.svg").ReactComponent
const SvgLocation = require("../../images/icons/location.svg").ReactComponent


const StudentViewSubs = () => {
const [organizations, setOrganizations]= useState([]);
const navigate = useNavigate();

const [currentPosition, setCurrentPosition] = useState(0);
const [isHovered, setIsHovered] = useState(false);
const [filterInput, setFilterInput] = useState('');
const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);

const api = "http://localhost:3001";



const toggleModal = (organizationId) => {
    setSelectedOrganizationId(organizationId);
    setIsModalVisible(!isModalVisible);
  };

const closeModal = () => {
  setIsModalVisible(false);
};  

//  const sortName = () => {
//     setContacts(
//       data.sort((a, b) => {
//         return a.first_name.toLowerCase() < a.first_name.toLowerCase()
//           ? -1
//           : a.first_name.toLowerCase() > a.first_name.toLowerCase()
//           ? 1
//           : 0;
//       })
//     );
//   };
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");
// console.log('Access Token:', token); 


useEffect(() => {
      
  
  if (!token || role !== 'user') {
    navigate('/login');
  }
}, [navigate]);

    useEffect(() => {
        axios
          .get(`${api}/getAllSubscriptions`)
          .then((response) => {
            // Update the institutions state with the fetched data
            setOrganizations(response.data.subscriptions);
            console.log(response.data.subscriptions);
          })
          .catch((error) => {
            console.error("Error fetching organizations:", error);
            // Handle the error, e.g., set institutions to an empty array
            setOrganizations([]);
          });
         }, []);

      useEffect(() => {
        if (!isHovered) {
          // Resume scrolling when not hovered
          const interval = setInterval(() => {
            setCurrentPosition((prevPosition) =>
              prevPosition < organizations.length - 1 ? prevPosition + 1 : 0
            );
          }, 3000); // Adjust the interval duration as needed (e.g., 3000ms for 3 seconds)
    
          return () => {
            clearInterval(interval); // Cleanup the interval when component unmounts
          };
        }
      }, [organizations, isHovered]);
    
      const handleCardHover = () => {
        setIsHovered(true);
      };
    
      const handleCardLeave = () => {
        setIsHovered(false);
      };
  return (
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
    <div className="backgroundSS">
              {/* <h2 className='testSV'>
                Share your certificate
              </h2> */}
        <form className='formSS'>
          <div className='my-3'>
            {/* onChange for search */}
            
            <input className='inputSS'
            type='text'
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder='Search for an organization...'
            />
          </div>
        </form>
      <div className="scrollable-containerSS">
<div className='gridSS'>
{organizations
              .filter((organization) => {
                // Filter by name and location
                return (
                  (filterInput.trim() === '' ||
                    organization.name.toLowerCase().includes(filterInput.toLowerCase()) ||
                    organization.location.toLowerCase().includes(filterInput.toLowerCase()))
                );
              })
.map((organization, index) => (
<div   key={organization.id}
              className={`cardSS ${index === currentPosition ? 'active' : ''}`}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}>
<div className='orgNameRow'>{organization.name}</div>
<div className='orgLocRow'> <SvgLocation/> {organization.location}</div>
<div className='orgEmailRow'>
  <div>
  <SvgEmail/>

  </div>
  <div className='OrgPosEmail'>
  {organization.position} : {organization.email}</div>

  </div>
<div className='buttonRowSS'>

<Tooltip  text="Share your QR code">
<div className='buttonRowSS'><SvgUpload  onClick={() => toggleModal(organization._id)} /></div>
</Tooltip>
</div>
</div>
))}
</div>
{isModalVisible && <Modal onClose={closeModal}
              organizationId={selectedOrganizationId}  />}

    </div>
    </div>
</>
  )
}

export default StudentViewSubs