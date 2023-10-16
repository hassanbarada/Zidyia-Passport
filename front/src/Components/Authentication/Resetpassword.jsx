import React, { useState } from "react";
import axios from "axios";
import "./Resetpassword.css"; 
import {useNavigate,useParams} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { ToastContainer, toast } from "react-toastify";


function Resetpassword() {

  const navigate = useNavigate();
  const api = "http://localhost:3001";
  const [password, setPassword] = useState("");
  const[passwordError,setPasswordError]=useState("");

  const [showPassword, setShowPassword] = useState(false);
  

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function validatePassword(password) {
    // Password must contain at least one uppercase letter, one special character, and one number
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
  const {id, token} = useParams();

  

  function handlereset(e) {
    e.preventDefault();
    setPasswordError("");
    if (!password) {
      toast.error("Password is required.",{
        theme:"black"
      });
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Please enter a valid password.",{
        theme:"black"
      });
      return;
    }
    axios.post(`${api}/reset-password/${id}/${token}`, {password})
    .then(res => {
        if(res.data.Status === "Success") {
         
            navigate('/login');
        }
    }).catch(err => console.log(err.response))
}

   
  return (
    <>
    <div className="zidyiaresetpass-parent">
      <ToastContainer/>
      <div className="zidyiaresetpass-contentandform">
      <h2 className="zidyiaresetpass-header">Reset Password</h2>
         <p className="zidyiaresetpass-paragone">PLEASE ENTER A NEW PASSWORD</p>   
       <form className="zidyiaresetpass-frogotform" onSubmit={handlereset}>
                
       <input
           type="password"
           className="zidyiaresetpass-input" 
           name="password" placeholder="Enter password"
           id="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        
        <button type="submit" className="zidyiaresetpass">Send</button>
         
       </form>
      </div>
    </div>
    </>
  );
}

export default Resetpassword;
