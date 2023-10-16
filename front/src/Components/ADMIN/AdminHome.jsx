import React,{useState,useEffect} from 'react'
import 
{  BsPersonFill}
 from 'react-icons/bs'
 import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 import { useNavigate } from 'react-router-dom';
 import axios from 'axios';
 import { CirclesWithBar } from 'react-loader-spinner';
 import {motion} from 'framer-motion';
import defaultImage from '../../images/download.png'
import { FaUser, FaCertificate } from 'react-icons/fa';
import {CircularProgressbar} from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";


const Home = () => {

    const token = localStorage.getItem("access_token");
    const [certificateData, setCertificateData] = useState([]);
    const [certificateData2, setCertificateData2] = useState([]);
    const [certificateData3, setCertificateData3] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [studentCount, setStudentCount] = useState(null);
    const [certificateAverage, setCertificateAverage] = useState(null);
    const [studentsAverage, setStudentsAverage] = useState(null);

    const [newPassword, setNewPassword] = useState('');
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);

  const api = 'http://localhost:3001'


  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

    const navigate = useNavigate();

    const [institutionData, setInstitutionData] = useState('');

    

   

    useEffect(() => {
  
      axios
        .get(`${api}/getStudentCountsForInstitution`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setStudentCount(response.data.totalStudentCount);
          console.log(studentCount)
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
        .get(`${api}/calculateAverageCertificates`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCertificateAverage(response.data.average);
          console.log(response.data.average)
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
        .get(`${api}/getStudentAverageForInstitution`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setStudentsAverage(response.data.average);
          console.log(response.data.average)
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
    const role = localStorage.getItem('role');
    const config = {
      headers: {
        token: `Bearer ${token}`,
      },
    };

    axios.get(`${api}/getInstitution`, config)
      .then(response => {
        setInstitutionData(response.data.institution);
        console.log(response.data.institution);
        if (!response.data.institution.notified) {
          openModal(); 
        }
        if(response.data.institution.role !== role){
          navigate('/Institutionlogin');
        }
      })
      .catch(error => {
        console.error('Error fetching institution data:', error);
      });
  }, []);

    const [isLoadingData, setIsLoadingData] = useState(true); // Separate loading state for data
  
    // Function to fetch certificate uploads count for intitution from the server
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${api}/certificateUploadRoute/count`, {
              headers: {
                token: `Bearer ${token}`, // Include the token in the header
              },
            });
            // Structure the data as you described
            const structuredData = {
              name: 'certificate Uploads',
              pending: response.data.certificateCounts.Pending,
              rejected: response.data.certificateCounts.Rejected,
              approved: response.data.certificateCounts.Approved,
              total: response.data.certificateCounts.totalCertificates,
            };
      
            setCertificateData(structuredData);
            setIsLoadingData(false);
            console.log(response.data.certificateCounts); // Move the log here
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

    // Function to fetch certificate request count for intitution from the server
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${api}/getCertificateRequestsCount`, {
            headers: {
              token: `Bearer ${token}`, // Include the token in the header
            },
          });
          // Structure the data as you described
          const structuredData2 = {
            name: 'certificate Request',
            pending: response.data.requestCounts.Pending,
            rejected: response.data.requestCounts.Rejected,
            approved: response.data.requestCounts.Approved,
            total: response.data.requestCounts.totalRequests,
          };
    
          setCertificateData2(structuredData2);
          setIsLoadingData(false);
          console.log(response.data.requestCounts); // Move the log here
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


    // Function to fetch certificate  count for intitution from the server
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${api}/countTotalCertificates`, {
            headers: {
              token: `Bearer ${token}`, // Include the token in the header
            },
          });
          
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

    const updatePassword = async ( newPassword) => {
      try {
        // Make a PUT request to update the certificate status with a reason
        const response = await axios.put(
          `${api}/updateInstitutionPasswordById`,
          { newPassword }, 
          {
            headers: {
              token: `Bearer ${token}`,
            },
        }
        );
    
        if (response.status === 200) {
          closeModal();
        }
      } catch (error) {
        console.error('Error Updatine Password:', error);
        // Handle the error (e.g., show an error message to the user)
      }
    };
    


      const data = [
        {
          name: certificateData.name,
          pending: certificateData.pending,
          rejected: certificateData.rejected,
          approved: certificateData.approved,
          total: certificateData.total,
        },
        {
          name: certificateData2.name,
          pending: certificateData2.pending,
          rejected: certificateData2.rejected,
          approved: certificateData2.approved,
          total: certificateData2.total,
        }
      ];



      


  return (
    <main className='main-container'>
        <div className='main-title'>
            {isLoadingData && (<CirclesWithBar
                               height="100"
                               width="100"
                               color="rgb(70, 241, 207)"
                               wrapperStyle={{}}
                               wrapperClass=""
                               visible={true}
                               outerCircleColor=""
                               innerCircleColor=""
                               barColor=""
                               ariaLabel='circles-with-bar-loading'
                               />)}
        </div>

        <div className='main-cards'
        >

            <motion.div className="main-cards-card"
            variants={{
              hidden:{opacity: 0,x: 75},
              visible:{opacity: 1,x: 0},
            }}
            initial="hidden"
            animate="visible"
            transition={{duration:0.5,delay:0.2}}
            >
            <div className='card-inner'>
                <h3>Certificates</h3>
                <div className='circular-bar-container'>
                <CircularProgressbar
                value={certificateAverage}
                text={`${certificateAverage}%`}
                circleRatio={0.7}
                
                styles={{
                  trail:{
                    strokeLinecap:"butt",
                    transform:"rotate(-126deg)",
                    transformOrigin:"center center",
                    
                  },
                  path:{
                    strokeLinecap:"butt",
                    transform:"rotate(-126deg)",
                    transformOrigin:"center center",
                    stroke:"#5DD3B3"
                  },
                  text:{
                    fill:"#5DD3B3"
                  }
                }}
                strokeWidth={10}
                
                />
                </div>
                
            </div>
            <h1>{certificateData3.totalCertificates}</h1>
            </motion.div>

            <motion.div className="main-cards-card"
            variants={{
              hidden:{opacity: 0,x: 75},
              visible:{opacity: 1,x: 0},
            }}
            initial="hidden"
            animate="visible"
            transition={{duration:0.5,delay:0.4}}
            >
            <div className='card-inner'>
                <h3>Students</h3>
                <div className='circular-bar-container'>
                <CircularProgressbar
                value={studentsAverage}
                text={`${studentsAverage}%`}
                circleRatio={0.7}
                
                styles={{
                  trail:{
                    strokeLinecap:"butt",
                    transform:"rotate(-126deg)",
                    transformOrigin:"center center",
                    
                  },
                  path:{
                    strokeLinecap:"butt",
                    transform:"rotate(-126deg)",
                    transformOrigin:"center center",
                    stroke:"#5DD3B3"
                  },
                  text:{
                    fill:"#5DD3B3"
                  }
                }}
                strokeWidth={10}
                
                />
                </div>
            </div>
            <h1>{studentCount}</h1>
            </motion.div>

            

            <motion.div id='third-card' className="main-cards-card"
            variants={{
              hidden:{opacity: 0,x: 75},
              visible:{opacity: 1,x: 0},
            }}
            initial="hidden"
            animate="visible"
            transition={{duration:0.5,delay:0.8}}
            >
            <div className='card-inner'>
                <h3> <BsPersonFill style={{marginRight:5}}/>Profile</h3>
                <h2 className='card-icon'>{institutionData.name}</h2>
            </div>
            <div className="card-inner">
            <h2>{institutionData.email}</h2>
            <h2>{institutionData.location}</h2>
            </div>
            </motion.div>
            
        </div>
        {/* End Of Card*/ }
        
        <div className="charts">
          
        <ResponsiveContainer width="100%" height="100%" >
          {isLoadingData ? <h1>loading</h1>: (
            < BarChart
              width={500}
              height={300}
              data={data} 
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              
              <XAxis dataKey="name"  stroke="#5DD3B3"/>
              <YAxis  stroke="#5DD3B3"/>
              <Tooltip />
              <Legend />
              <Bar barSize={100} dataKey="pending" fill="#5D86D3" />
              <Bar barSize={100} dataKey="rejected" fill="#8E5DFD" />
              <Bar barSize={100} dataKey="approved" fill="#96B4E3" />
              <Bar barSize={100} dataKey="total" fill="#2AF39C" />
            </BarChart>
          )}
        </ResponsiveContainer>

        
      </div>


      {showModal && (
        <div className="modal">
          
          <form className="modal-content">
            <div className="container">
              <h1 style={{color:'black'}}> Create New Password</h1>
              
              <input placeholder='newPassword' className='new-password-input'  value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}/>
{newPasswordRequired && (
  <div className="error-message">The New Password is required.</div>
)}
              <div className="clearfix">
                
                <button type="button" className="deletebtn"  onClick={() => {
              if (newPassword) {
                updatePassword(newPassword);
              }else {
                // Show the "reason is required" message
                setNewPasswordRequired(true);
              }
             
            }}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}


    </main>
  )
}

export default Home