import React, { useEffect, useState } from "react";
import "./Institutionlogin.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {FaEye,FaEyeSlash } from 'react-icons/fa'
  import { ToastContainer, toast } from "react-toastify";


const Institutionlogin = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[showPassword,setShowPassword]=useState(false)
  const togglePasswordVisibility=()=>{
    setShowPassword(!showPassword)
  }

  const api = "http://localhost:3001";




  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password fields.", {
        theme: "dark",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${api}/loginInstitution`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.accessToken);
        localStorage.setItem("userId", response.data.institution._id);
        localStorage.setItem("role", response.data.institution.role);
        //const { institution, accessToken } = response.data;
        setLoading(false);

          history("/");
        } else {
          // Handle login failure
          console.error("Login failed");
          setLoading(false);
                  setError("Email or password is incorrect.");

          // You can display an error message to the user here
        }
      } catch (error) {
        console.error("Error during login:", error);
        setLoading(false);
  toast.error("email or password incorrect",{
    theme: "dark",


  })
      }
    
  }

  return (
    <div className="Institution-parent">
      <ToastContainer />

      <div className="Institution-contentWithform">
        <form action="Post" className="Institution-loginform">
          <h1 className="Institution-headone">Institution Login</h1>
          <div className="directionto-column">
            <label className="Institution-label">Email:</label>
            <input
              className="institute-email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
              name=""
              id=""
            ></input>
          </div>
          <div className="directionto-column">
            <label className="Institution-label">Password:</label>
            <div className="inputwitheye">
              <input
                className="institute-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="password"
                name=""
                id=""
              />
              <span
                className="inputwitheye-span"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEye style={{ color: "white" }} />
                ) : (
                  <FaEyeSlash style={{ color: "white" }} />
                )}
              </span>
            </div>
          </div>
          {/* {error && <div className="error-message">{error}</div>} */}
          
          <input
            className="institutesubmit"
            type="submit"
            onClick={submit}
            value={loading ? "Loading..." : "Sign in"}
            disabled={loading}
          ></input>
        </form>
      </div>
    </div>
  );
};



export default Institutionlogin;
