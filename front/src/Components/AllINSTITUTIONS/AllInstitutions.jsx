import React, { useState, useEffect } from "react";
import './AllInstitutions.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload, FaRegHandPointer,FaSearch,FaUniversity,FaUserGraduate,FaCertificate      } from "react-icons/fa";
import { Link } from "react-router-dom";
import image from '../../images/building2.jpg'
import { motion } from "framer-motion";





function AllInstitutions() {
    const [institutions, setInstitutions] = useState([]); 
    const [searchInput, setSearchInput] = useState("");
    const [filteredInstitutions, setFilteredInstitutions] = useState([]);
    const [studentCount, setStudentCount] = useState(null);
    const [institutionCount, setInstitutionCount] = useState(null);
    const [certificateData3, setCertificateData3] = useState(0);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("All"); 

    const api = 'http://localhost:3001'
    
    const navigate = useNavigate();

    useEffect(() => {
        axios
          .get(`${api}/getAllInstitutions`)
          .then((response) => {
            // Update the institutions state with the fetched data
            setInstitutions(response.data.institutions);
            console.log(response.data.institutions);
          })
          .catch((error) => {
            console.error("Error fetching institutions:", error);
            // Handle the error, e.g., set institutions to an empty array
            setInstitutions([]);
          });
      }, []);
      const handleUploadButtonClick = (institutionID) => {
        navigate(`/CertificateUpload/${institutionID}`);
      };

      useEffect(() => {
        // Filter the institutions based on the search input
        const filtered = institutions.filter((institution) =>
          institution.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          institution.email.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredInstitutions(filtered);
      }, [searchInput, institutions]);

      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      useEffect(() => {
  
        axios
          .get(`${api}/getTotalUserCount`, )
          .then((response) => {
            setStudentCount(response.data.totalUsers);
            console.log(response.data.totalUsers);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              console.log('Token is not valid!');
              navigate('/Institutionlogin');
            } else {
              console.error('Error Fetching Data:', error);
            }
          });
      }, []);

      useEffect(() => {
  
        axios
          .get(`${api}/getTotalInstitutions`, )
          .then((response) => {
            setInstitutionCount(response.data.total);
            console.log(response.data.total);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              console.log('Token is not valid!');
              navigate('/Institutionlogin');
            } else {
              console.error('Error Fetching Data:', error);
            }
          });
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${api}/countTotalCertificatesForAllInstitutions`);
            
            setCertificateData3(response.data);
            console.log(response.data); // Move the log here
          } catch (error) {
            if (error.response && error.response.status === 403) {
              console.log("Token is not valid!");
              navigate('/Institutionlogin');
            } else {
              console.error("Error Fetching Data:", error);
            }
          }
        };
      
        fetchData();
      }, []);

      useEffect(() => {
        axios
          .get(`${api}/getAllLocations`)
          .then((response) => {
            // Update the institutions state with the fetched data
            setLocations(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching Locations:", error);
            // Handle the error, e.g., set institutions to an empty array
            setLocations([]);
          });
      }, []);

      useEffect(() => {
        axios
          .get(`${api}/getInstitutionsByLocation/${selectedLocation}`)
          .then((response) => {
            setInstitutions(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching institutions by location:", error);
            setInstitutions([]); // Handle the error, e.g., set institutions to an empty array
          });
      }, [selectedLocation]);

      const handleLocationChange = (e) => {
        const newLocation = e.target.value;
        setSelectedLocation(newLocation);
      };
    

  return (
    <>
    <div className="all-instituions-section1">
      <div className="all-instituions-section1-left">
      <motion.div className="absolute-color" 
      variants={{
        hidden:{opacity: 0,y: -175},
        visible:{opacity: 1,y: 0},
      }}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
        delay:0.8
      }}
      ></motion.div>
      <motion.div className="absolute-color2"
      variants={{
        hidden:{opacity: 0,y: 175},
        visible:{opacity: 1,y: 0},
      }}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
        delay:0.8

      }}
      ></motion.div>

        <motion.h1 
        variants={{
          hidden:{opacity: 0,x: -175},
          visible:{opacity: 1,x: 0},
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
        }}
        >Welcome to our <span>Institutions</span> Hub</motion.h1>
        <motion.div className="all-instituions-section1-left-content"
        variants={{
          hidden:{opacity: 0,x: -175},
          visible:{opacity: 1,x: 0},
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
          delay:0.2
        }}
        >
          <p>Discover a world of  possibilities</p>
        </motion.div>
        <div className="all-instituions-section1-left-statistiques">

        <motion.div className="all-instituions-section1-left-statistiques-item" 
        variants={{
          hidden:{opacity: 0,x: -175},
          visible:{opacity: 1,x: 0},
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
          delay:0.4
        }}
        >
          <div className="svgnumber"><FaCertificate/>{certificateData3.totalCertificates}</div>
          <p> certificates</p>
        </motion.div>
        <motion.div className="all-instituions-section1-left-statistiques-item" 
        variants={{
          hidden:{opacity: 0,x: -175},
          visible:{opacity: 1,x: 0},
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
          delay:0.5
        }}
        >
          <div className="svgnumber"><FaUniversity  />{institutionCount}</div>
          <p> institutions</p>
        </motion.div>
        <motion.div className="all-instituions-section1-left-statistiques-item" 
        variants={{
          hidden:{opacity: 0,x: -175},
          visible:{opacity: 1,x: 0},
        }}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
          delay:0.6
        }}
        >
          <div className="svgnumber"><FaUserGraduate />{studentCount}</div>
          <p> Students</p>
        </motion.div>
        </div>
        {/* END OF STATISTIQUES*/ }
      </div>
      {/* END OF LEFT SECTION*/ }
      <motion.div className="all-instituions-section1-right" 
      variants={{
        hidden:{opacity: 0,x: 175},
        visible:{opacity: 1,x: 0},
      }}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
      }}
      >
        <img src={image} alt="" />
      </motion.div>
      {/* END OF Right SECTION*/ }
      <div className="absolute-position10"></div>
    </div>
    {/* END OF  SECTION*/ }



    <div className="search-institutions">
      <div>
      <FaSearch  />
    <input type="text" placeholder="Search By Name or Email" onChange={(e) => setSearchInput(e.target.value)}/>
      </div>
      <select name="" id="" onChange={handleLocationChange}>
          <option value="All">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
    </div>
    
    <div className="all-institutions-container">
     {filteredInstitutions.map((institution) => (
      <>
            <div className="card red" key={institution._id}>
              <h1 className="tip">{institution.name}</h1>
              <h3 className="second-text">{institution.email}</h3>
              <h3 className="second-text">{institution.location}</h3>
              <div className="buttons-container">
                <button onClick={() => handleUploadButtonClick(institution._id)}>
                  <FaUpload /> Upload
                </button>
                <button>
                  <Link to={`/CertificateRequest/${institution._id}`} ><FaRegHandPointer /> Request</Link>
                  
                </button>
                
              </div>
              

            </div>
            
            </>
          ))}

        
        
          

    </div>

    

    
    </>
  )
}

export default AllInstitutions