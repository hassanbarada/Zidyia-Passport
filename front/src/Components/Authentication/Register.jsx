import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./register.css"; 
  import { ToastContainer, toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const api = "http://localhost:3001";
  const [ID,setID] = useState('');
  const [firstname,setrFirstname] = useState('');
  const [lastname,setLastname] = useState('');
  const [ email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [IDError, setIDError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [BioError, setBioError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registerError, setregisterError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }
  
  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((prevState) => !prevState);
  }


  

  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }

  function handleregister(e) {
    e.preventDefault();

    setNameError("");
    setLastNameError("");
    setIDError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setregisterError("");
    let isValid = true;

    // Validate each field and set corresponding error messages
    // if (!firstname) {
    //   toast.error("First name is required.", {
    //     theme: "dark",
    //   });
    //   isValid = false;
    // }

    // if (!lastname) {
    //   toast.error("Last name is required.", {
    //     theme: "dark",
    //   });
    //   isValid = false;
    // }

    // if (!ID) {
    //     toast.error("Profile Picture is required.", {
    //       theme: "dark",
    //     });
    //   isValid = false;
    // }

    

    // if (!email) {
    //   toast.error("Email address is required.", {
    //     theme: "dark",
    //   });
    //   isValid = false;
    if (!firstname || !lastname || !ID || !email || !password) {
  toast.error("All fields are required.", {
    theme: "dark",
  });
  isValid = false;
} else if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", {
        theme: "dark",
      });
      isValid = false;
    }

    // if (!password) {
    //   toast.error("Password is required.", {
    //     theme: "dark",
    //   });
    //   isValid = false;
      else if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least 8 characters, including one uppercase letter, one special character, and one number.",
        {
          theme: "dark",
        }
      );
      isValid = false;
    }

    // if (!confirmPassword) {
    //   toast.error("Please confirm your password.", {
    //     theme: "dark",
    //   });
    //   isValid = false;
      else if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        theme: "dark",
      });
      isValid = false;
    }

    if (isValid) {
      const userData = new FormData();
      userData.append('ID',ID);
      userData.append('firstname',firstname);
      userData.append('lastname',lastname);
      userData.append('email',email);
      userData.append('password',confirmPassword);

      axios
        .post(`${api}/register`, userData)
        .then((response) => {
          console.log("Registration successful!");
          localStorage.clear(); // Clear localStorage here
          navigate(`/EmailSent/${email}`)
        })
        .catch((error) => {
          if (error.response) {
            const { data } = error.response;
            console.log("Backend error response:", data); // Log the backend error response
            if (data.error === "Email already registered") {
              console.log("Email already registered");
              toast.error("Email address is already registered.", {
                theme: "dark",
              });
            } else {
              console.error("Registration failed:", error);
            }
          } else {
            console.error("Registration failed:", error);
          }
        });
    }
  }

  return (
    <section className="register">
      <ToastContainer />

      <div className="register-container">
        <div className="register-content">
          <h2 className="register-center auth-header">Create a Wallet</h2>
          <p className="register-center auth-par">Already have one? <Link
                    to="/login"
                    className="linktologin"
                  >
                    Login
                  </Link></p>
          <form onSubmit={handleregister}>
            <label className="registerlabel">
              First Name <span className="star">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              id="firstname"
              value={firstname}
              onChange={(e) => setrFirstname(e.target.value)}
            />
            <div className="flexdirect">
              {nameError && (
                <span className="error-firstname-notify">{nameError}</span>
              )}
              <label className="registerlabel">
                Last Name <span className="star">*</span>
              </label>
            </div>

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              id="lastname"
              className="left"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <div className="flexdirect">
              {/* {lastNameError && (
                <span className="error-lastname-notify">{lastNameError}</span>
              )} */}

              <label className="registerlabel">
                Student ID <span className="star">*</span>
              </label>
            </div>
            <input
              type="file"
              name="ID"
              accept="image/*"
              id="profilePicture"
              placeholder="ID Picture"
              onChange={(e) => setID(e.target.files[0])}
            />

            <div className="flexdirect">
              {/* {IDError && (
                <span className="error-studentid-notify">{IDError}</span>
              )} */}

              <label className="registerlabel">
                Email <span className="star">*</span>
              </label>
            </div>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flexdirect">
              {/* {emailError && (
                <span className="error-email-notify">{emailError}</span>
              )} */}
              <label className="registerlabel">
                Password <span className="star">*</span>
              </label>
            </div>
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="fa-eye"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="flexdirect">
              {passwordError && (
                <span className="error-password-notify">{passwordError}</span>
              )}
              <label className="registerlabel">
                Confirm Password <span className="star">*</span>
              </label>
            </div>
            <div className="password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye} // Toggle eye icon based on showConfirmPassword state
                className="fa-eye"
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>

            {confirmPasswordError && (
              <span className="error-confirmpassword-notify">
                {confirmPasswordError}
              </span>
            )}

            <div className="centering">
              <button type="submit" className="register-create-wallet">
                create a wallet
              </button>
            </div>

            {/* {registerError && (
              <span className="error-register-message">{registerError}</span>
            )} */}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
