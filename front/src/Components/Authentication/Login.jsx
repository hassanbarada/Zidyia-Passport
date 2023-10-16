import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Handlelogin.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { ToastContainer, toast } from "react-toastify";


function LogintoZidyia(){
    const navigate = useNavigate();
  const api = "http://localhost:3001";
  const [contact, setContact] = useState({
    email: "",
    password: ""
  });
  const [emailError, setEmailError] = useState("");
  const [passworderror, setpasswordError] = useState("");
  const[loginError,setloginError]= useState("");
  

  const [showPassword, setShowPassword] = useState(false);
  

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }

  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setContact((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  function handlelogin(e) {
    e.preventDefault();

    setEmailError('');
    setpasswordError('');
    setloginError('');

    let isValid=true;

    if (!contact.email) {
      toast.error("Email address is required.",{
        theme:"dark",
      });
        isValid=false;
    }else if (!validateEmail(contact.email)) {
      toast.error("Please enter a valid email address.", {
        theme: "dark",
      });
      isValid=false;
    }

    if (!contact.password) {
      toast.error("Password is required.", {
        theme: "dark",
      });
      isValid = false;
    } else if (!validatePassword(contact.password)) {
      toast.error("Password must contain at least 8 characters, including one uppercase letter, one special character, and one number.",{
        theme:"dark"
      });
      console.log("Password validation failed:", contact.password);
      isValid = false;
    }

    if (isValid) {
    axios.post(`${api}/login`, contact)
      .then((response) => {
        console.log("Login successful!");
        console.log(response);
        localStorage.setItem("access_token", response.data.accessToken);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("isblocked", response.data.user.isblocked);
        navigate('/');
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          console.log("Backend error response:", data);
          if (data.error && data.error === "Email or Password is not valid") {
            toast.error("Email or Password is not valid",{
              theme:"dark"
            });
          }else if (data.message && data.message === "Please Verify your Account") {
            toast.error("Please verify your Account",{theme:"dark"});
          } else {
            console.error("login failed:", error);
          }
        } else {
          console.error("login failed:", error);
        }
      });
    }
  }


    return (
      <>
        <div className="logintozidyia-parent">
          <ToastContainer />

          <div className="logintozidyia-contentWithform">
            <form className="logintozidyia-loginform" onSubmit={handlelogin}>
              <h1 className="logintozidyia-headone">As Student</h1>
              <div className="directiontocolumn">
                <label className="logintozidyia-label">Email:</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email Address"
                  id="loginemail"
                  className="logintozidyia-input"
                  value={contact.email}
                  onChange={handleChange}
                />
                {/* {emailError && (
                  <span className="error-image-message">{emailError}</span>
                )} */}
              </div>
              <div className="directiontocolumn">
                <label className="logintozidyia-label">Password:</label>
                <div className="loginpass">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="logintozidyia-input"
                    value={contact.password}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="eyeiconforlogin"
                    onClick={togglePasswordVisibility}
                  />
                </div>

                {/* {passworderror && (
                  <span className="error-image-message">{passworderror}</span>
                )} */}
              </div>
              <div className="checkboxandforgot">
                <div className="checkboxwithlebel">
                  <input type="checkbox" />
                  <label className="rememberme-label">Remember me</label>
                </div>
                <p>
                  <Link
                    to="/forgot-password"
                    className="logintozidyia-forgotpass"
                  >
                    Forgot password?
                  </Link>
                </p>
              </div>

              <button className="Signinbutton">Sign In</button>

              {/* {loginError && (
                <span className="error-image-message">{loginError}</span>
              )} */}
            </form>
          </div>
        </div>
      </>
    );
}

export default LogintoZidyia;