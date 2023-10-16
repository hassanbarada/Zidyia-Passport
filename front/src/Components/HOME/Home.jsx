import React,{useEffect,useState,useRef} from "react";
import './Home.css';
import Footer from "../Footer/Footer";
import Image1 from '../../images/image1.png';
import Image2 from '../../images/certificateImage.jpg';
import Image3 from '../../images/meeting.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import {motion, useInView, useAnimation} from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    //SCROLL ANIMATION
  const aboutRef = useRef(null);
  const aboutIsInView = useInView(aboutRef);
  const aboutMainControls = useAnimation();
  useEffect(()=>{
    if(aboutIsInView){
        aboutMainControls.start("visible");
      console.log("Contact us is in view");
    }
  },[aboutIsInView])
  const rendered = localStorage.getItem("rendered");
  
    const registerNavigate = () => {
        navigate('/register');
    }
    return(
        <>
        {rendered ? (
            <div className="landpage2">
            
            <div className="box5"></div>
            <div className="box6">
                <div className="landpage-text2">
                Discover <br/> <span>Credentials</span>
                </div>
                <div className="landpage-subheading2">
                    <h2>Explore Our Services</h2>
                    
                </div>
                <div className="landpage-btn-container2">
                <button onClick={registerNavigate}>Get Started</button>
                </div>
            </div>
        </div>
        ):(
            <div className="landpage">
            
            <div className="box1"></div>
            <div className="box2">
                <div className="landpage-text">
                Discover <br/> <span>Credentials</span>
                </div>
                <div className="landpage-subheading">
                    <h2>Explore Our Services</h2>
                    
                </div>
                <div className="landpage-btn-container">
                <button onClick={registerNavigate}>Get Started</button>
                </div>
            </div>
        </div>
        )}
        


        <div className="first-aboutus-section " ref={aboutRef}>
            <motion.h3 variants={{
                hidden:{opacity: 0,y: -75},
                visible:{opacity: 1,y: 0},
              }}
              initial="hidden"
              animate={aboutMainControls}
              transition={{
                duration: 0.7,
                delay:  0.2, 
              }}
              >
                
                The Power of Zidyia Passport
                </motion.h3>
            <motion.h1 
            variants={{
                hidden:{opacity: 0,y: -75},
                visible:{opacity: 1,y: 0},
              }}
              initial="hidden"
              animate={aboutMainControls}
              transition={{
                duration: 0.7,
                delay:  0.3, 
              }}
            >
                A next gen Certificate management system</motion.h1>
            <div className="aboutus-section-content" >
                <motion.img src={Image1} alt="" 
                variants={{
                    hidden:{opacity: 0,x: -175},
                    visible:{opacity: 1,x: -40},
                  }}
                  initial="hidden"
                  animate={aboutMainControls}
                  transition={{
                    duration: 0.7,
                    delay:  0.5, 
                  }}
                 />
                <motion.div className="aboutus-section-content-right"
                variants={{
                    hidden:{opacity: 0,x: 175},
                    visible:{opacity: 1,x: 40},
                  }}
                  initial="hidden"
                  animate={aboutMainControls}
                  transition={{
                    duration: 0.7,
                    delay:  0.5, 
                  }}
                >
                    <h1>Simple</h1>
                    <p>Zidyia Passport provides an easy to use platform with the best user experience</p>
                        <li><FontAwesomeIcon icon={faCheck}  />
                            Engaging course content composed of quizzes and grades.
                        </li>
                        <li><FontAwesomeIcon icon={faCheck}  />
                            Data and insights to analyze integration with course content.
                        </li>
                </motion.div>
            </div>
        </div>

        <div className="aboutus-section2">
                
                <div className="aboutus-section-content2">
                    <div className="aboutus-section-content2-left">
                        <h1>Secure</h1>
                        <p>We prioritize the security of your certificates and data.</p>
                            <li>
                                <FontAwesomeIcon icon={faCheck} />
                                Robust encryption to protect sensitive information.
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheck} />
                                Regular security audits to ensure your data's safety.
                            </li>
                    </div>
                    <img src={Image3} alt="" />
                </div>
            </div>

            <div className="aboutus-section">
                
                <div className="aboutus-section-content">
                    <img src={Image2} alt="" />
                    <div className="aboutus-section-content-right">
                        <h1>Efficient</h1>
                        <p>Zidyia Passport streamlines your certificate management process.</p>
                            <li>
                                <FontAwesomeIcon icon={faCheck} />
                                Time-saving features for quick certificate generation.
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheck} />
                                Simplified workflows to enhance productivity.
                            </li>
                    </div>
                </div>
            </div>


        <Footer />
        
        </>
    )
}

export default Home;
