import React from 'react'
import { useNavigate,useParams } from 'react-router'
import './EmailSent.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'; // Use faEnvelopeOpen icon

function EmailSent() {
    const navigate = useNavigate();
    const param = useParams();

    const handleNavigate = () =>{
        navigate('/login');
    }
  return (
    <div className='email-sent-container'>
        <div className='email-sent-container-content'>
            <h1><FontAwesomeIcon icon={faEnvelopeOpen} /></h1>
            <h1>Thank You</h1>
            <p>An email has been sent to <br /><span>{param.email}</span></p>
        </div>
        <button onClick={handleNavigate}>Access my wallet</button>
    </div>
  )
}

export default EmailSent