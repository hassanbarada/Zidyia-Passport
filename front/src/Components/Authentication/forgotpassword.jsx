import React, { useState } from "react";
import axios from "axios";
import "./forgotpassword.css"; 
import {useNavigate} from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";



function Forgotpassword() {
  const navigate = useNavigate();
  const api = "http://localhost:3001";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  function validateEmail(email) {
    // A basic email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  function handleforgot(e) {
    e.preventDefault();
    setEmailError("");
    if (!email) {
      toast.error("Email adress is required.",{
        theme:"dark"
      });
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.",{
        theme:"dark"
      });
      return;
    }
    
    axios.post(`${api}/forgot-password`, { email })
      .then((res) => {
        if (res.data.Status === 'Success' || res.data.status === 'Success' || res.data.message === 'Reset email sent successfully') {
          navigate('/login');
        } else {
          console.log('Reset email sending failed:', res);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log('Error response from server:', err.response);
        } else if (err.request) {
          console.log('No response received:', err.request);
        } else {
          console.log('Error during request:', err.message);
        }
      });
  }

  return (
   <>
   <div className="zidyiaforgotpass-parent">
    <ToastContainer/>
     <div className="zidyiaforgotpass-contentandform">
     <h2 className="zidyiaforgotpass-header">Forgot Password</h2>
        <p className="zidyiaforgotpass-paragone">PLEASE ENTER YOUR EMAIL TO RESET YOUR PASSWORD</p>   
      <form className="zidyiaforgotpass-frogotform" onSubmit={handleforgot}>
               
        <input type="text" name="email" placeholder="Email Address"  className="zidyiaforgotpass-input" id="email" value={email}    onChange={(e) => setEmail(e.target.value)} />
            {/* {emailError && (
              <span className="error-message">{emailError}</span>
            )} */}
       <button type="submit" className="zidyiaforgotpass">Send</button>
        
      </form>
     </div>
   </div>
   </>
  );
}

export default Forgotpassword;
