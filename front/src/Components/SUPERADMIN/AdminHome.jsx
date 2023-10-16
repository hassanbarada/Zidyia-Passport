import React,{useState,useEffect} from 'react'
import 
{  BsPersonFill}
 from 'react-icons/bs'
 import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 import { useNavigate } from 'react-router-dom';
 import axios from 'axios';
 import { CirclesWithBar } from 'react-loader-spinner';
 import {motion} from 'framer-motion';
import { FaUser, FaCertificate } from 'react-icons/fa';
import {CircularProgressbar} from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";


const Home = () => {

    const token = localStorage.getItem("access_token");
    const [certificateData, setCertificateData] = useState([]);
    const [certificateData2, setCertificateData2] = useState([]);
    const [certificateData3, setCertificateData3] = useState(0);
    const [studentCount, setStudentCount] = useState(null);
    const [subscriptionCount, setSubscriptionCount] = useState(null);
    const [institutionCount, setInstitutionCount] = useState(null);
    
    const [verifiedSubscriptionCount, setVerifiedSubscriptionCount] = useState(null);
    const [verifiedSubscriptionAverage, setVerifiedSubscriptionAverage] = useState(null);
    const [expiredSubscriptionCount, setExpiredSubscriptionCount] = useState(null);
    const [expiredSubscriptionAverage, setExpiredSubscriptionAverage] = useState(null);

    
    const api = "http://localhost:3001";

 
    const navigate = useNavigate();

    const [institutionData, setInstitutionData] = useState('');

    useEffect(() => {
  
      axios
        .get(`${api}/getAverageVerifiedAndExpiredSubscribers`, )
        .then((response) => {
          setVerifiedSubscriptionCount(response.data.verified);
          setVerifiedSubscriptionAverage(response.data.averageVerified)
          setExpiredSubscriptionCount(response.data.expired)
          setExpiredSubscriptionAverage(response.data.averageExpired)
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
        .get(`${api}/countTotalSubscribers`, )
        .then((response) => {
          setSubscriptionCount(response.data.total);
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
            const response = await axios.get(`${api}/getAllInstitutionsCertificateUploadCounts/count`);
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
          const response = await axios.get(`${api}/countCertificateRequestsForAllInstitutions`);
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

      const data2 = [
        {
          name: 'certificates',
          total: certificateData3.totalCertificates
        },
        {
          name: 'Students',
          total: studentCount
        },
        {
          name: 'Institutions',
          total: institutionCount
        },
        {
          name: 'Subscribers',
          total: subscriptionCount
        },
        {
          name: 'Certificate Request',
          total: certificateData2.total
        },
        {
          name: 'Certificate Uploaded ',
          total: certificateData.total
        }
      ]

      console.log(data2);


  return (
    <main className='main-container-super'>
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
                <FaCertificate className='card-icon'/>
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
                <FaUser className='card-icon'/>
            </div>
            <h1>{studentCount}</h1>
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
                <h3>Verified <br /> Subscription</h3>
                <div className='circular-bar-container'>
                <CircularProgressbar
                value={verifiedSubscriptionAverage}
                text={`${verifiedSubscriptionAverage}%`}
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
            <h1>{verifiedSubscriptionCount}</h1>
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
                <h3>Expired <br /> Subscription</h3>
                <div className='circular-bar-container'>
                <CircularProgressbar
                value={expiredSubscriptionAverage}
                text={`${expiredSubscriptionAverage}%`}
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
                    stroke:"red"
                  },
                  text:{
                    fill:"red"
                  }
                }}
                strokeWidth={10}
                
                />
                </div>
            </div>
            <h1>{expiredSubscriptionCount}</h1>
            </motion.div>
        </div>
        
        
        <div className="charts-super">
          
          <ResponsiveContainer className='first-chart' width="100%" height="100%" >
          {isLoadingData ? <h1>loading</h1>: (
            <BarChart
              width={500}
              height={300}
              data={data} 
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}>

              <XAxis dataKey="name" stroke="#5DD3B3"/>
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
        
        <ResponsiveContainer className='second-chart'  width="100%" height="100%" >
        <BarChart  data={data2}>
        <XAxis dataKey="name" stroke="#5DD3B3"/>
        <YAxis stroke="#5DD3B3"/>
        <Tooltip />
        <Legend />
        <Bar dataKey="total" barSize={30} fill="#5DD3B3" />
        </BarChart>
        </ResponsiveContainer>
      </div>

    </main>
  )
}

export default Home