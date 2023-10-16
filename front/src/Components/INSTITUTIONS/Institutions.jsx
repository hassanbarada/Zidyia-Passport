import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Institutions.css";
import Image1 from "../../images/institution.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/Footer";
import { FaUpload, FaRegHandPointer,FaArrowRight  } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const useParallaxBanner = (setScrollPosition) => {
  const handleScroll = () => setScrollPosition(window.pageYOffset);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};



function Institutions() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const [institutions, setInstitutions] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();

  const api = "http://localhost:3001";

  useEffect(() => {
    // Set a key named 'rendered' to 'true' in localStorage
    localStorage.setItem('rendered', 'true');
  }, []); 

  // Fetch the list of institutions from the API
  useEffect(() => {
    axios
      .get(`${api}/getLastThreeInstitutions`)
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
  useParallaxBanner(setScrollPosition);

  const AllinstitutionNavigate = () => {
    navigate('/AllInstitutions');
  }
  return (
    <>
      <section
        style={{
          backgroundSize: `${(window.outerHeight - scrollPosition) / 3}%`,
        }}
        className="banner"
      >
        <h1>Upload, Request and Get Approved</h1>
      </section>

      <div className="institutions-container">
        <h1 style={{color:"#2D3741"}}>Interact with Our Institutions</h1>
        <div className="aboutus-section-institution">
          <div className="aboutus-section-content2">
            <div className="aboutus-section-content2-left">
              <h1 style={{color:"#2D3741"}}>Empowering Institutions</h1>
              <p>
              At Zidyia Passport, we are dedicated to empowering institutions with cutting-edge certificate management solutions. We believe in simplicity, security, and efficiency.

              </p>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                Streamlined processes for certificate uploads and requests.
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                Robust security measures to protect your institution's data.
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} />
                Insightful analytics for data-driven decision-making.
              </li>
            </div>
            <img src={Image1} alt="" />
          </div>
        </div>

        <div className="parents-container">
          {institutions.map((institution) => (
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
          ))}
        </div>
        <button onClick={AllinstitutionNavigate} className="view-all-button">View All <FaArrowRight  /></button>
      </div>

    </>
  );
}

export default Institutions;
