import './CredentialUrl.css';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer'
import { ReactComponent as SvgProfile } from "../../../src/images/icons/Profile.svg"
import { ReactComponent as SvgShield } from "../../../src/images/icons/shield_accept.svg"





const CredentialUrl = () => {
    const[sharedCertificate, setSharedCertificate] = useState([]);
    const { sharedCertificateID } = useParams()
// console.log(sharedCertificateID)

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const api = 'http://localhost:3001'

    useEffect(() => {

        axios
        .get(`${api}/getSharedCertificateById/${sharedCertificateID}`)

        .then((response) => {
          // Update the institutions state with the fetched data
          setSharedCertificate(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching certificates:", error);
          // Handle the error, e.g., set institutions to an empty array
          setSharedCertificate([]);
        });
        
        }, []);  

// console.log(sharedCertificate.certificateRequestID.certificateID.image)
  return (
    <div className="Backgroundcu">
        <div className="ContainerCU" >
           <div className="NameDateVerifiedRow">
              <div style={{ display:"flex", gap:"0.9rem"}}>
                 <SvgProfile/>
              <p className='DateNameCol'>
                This badge was issued to 
                <span className='BlueTextCU'>
                     {sharedCertificate.certificateUploadID?.studentID?.username || sharedCertificate.certificateRequestID?.studentID?.username}
                </span>
                <span style={{marginLeft:"0.5rem"}}>

                      on {sharedCertificate.certificateUploadID
  ? formatDate(sharedCertificate.certificateUploadID.createdAt)
  : sharedCertificate.certificateRequestID
  ? formatDate(sharedCertificate.certificateRequestID.createdAt)
  : 'N/A'}
                </span>
              </p>
              </div>
                <div className='ShieldVerifyCol'>
                    <SvgShield/>
                    <p>Verified</p>
                </div>
            </div>
            <div className="ImgDescRow">
                    <div className="ImgTitleDesc">
                    {sharedCertificate.certificateUploadID ? (
  <img className='ImgStylingCU' src={`${api}/certificateUploadPhoto/${sharedCertificate.certificateUploadID._id}/photo`} alt="Certificate Upload" />
) : sharedCertificate.certificateRequestID ? (
  <img className='ImgStylingCU' src={`${api}/getCertificatePhoto/${sharedCertificate.certificateRequestID.certificateID._id}/photo`} alt="Certificate Request" />
) : null} 
                            <div className='DescColumn' >
                                <h1>
                            {sharedCertificate.certificateUploadID?.name || sharedCertificate.certificateRequestID?.certificateID?.name}

                                </h1>
                                <p>
                                    Issued by 
                                    <span className='BlueTextCU'>
                            {sharedCertificate.certificateUploadID?.institutionID?.name || sharedCertificate.certificateRequestID?.institutionID?.name}

                                    </span>

                                </p>
                            {sharedCertificate.certificateUploadID?.description || sharedCertificate.certificateRequestID?.certificateID?.description}
                            </div>
                    </div>
                    <div className="SkillsCU">

                    </div>
            </div>
            <div className="FooterCU">
            <Footer/>
            </div>
        </div>
    </div>
  )
}

export default CredentialUrl