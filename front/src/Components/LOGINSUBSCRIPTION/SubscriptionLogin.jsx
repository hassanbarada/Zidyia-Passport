import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SubscriptionLogin.css";
  import { ToastContainer, toast } from "react-toastify";
  import { useNavigate } from "react-router-dom";



const SubscriptionLogin = () => {
    const history = useNavigate();
      const api = "http://localhost:3001";


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setError("");
    setLoading(true);
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in both email and password fields.",{
        theme:"dark"
      });
      setLoading(false);
      return;
    }
   

    try {
      const response = await axios.post(
        `${api}/loginSubscription`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Login Subscription successfully");
        localStorage.setItem("access_token", response.data.accessToken);
        localStorage.setItem("userId", response.data.subscribtion._id);
        localStorage.setItem("role", response.data.subscribtion.role);

        // Clear form data
        setFormData({
          email: "",
          password: "",
        });
          history("/VerificationPlatformShared");

      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        console.log("Backend error response:", data);
        if (data.error && data.error === "Email or Password is not valid") {
          toast.error("Email or Password is not valid",{
            theme:"dark",
          });
        }else if (data.error && data.error === "Subscription is not verified") {
          history('/expiryLicense');
        } else {
          console.error("Login failed:", error);
        }
      } else {
        console.error("Login failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Subscription-parent">
      <ToastContainer/>
      <div className="Subscription-contentWithform">
        <form
          action="Post"
          className="Subscription-loginform"
          onSubmit={handleSubmit}
        >
          <h1 className="Subscription-headone">Subscription Login</h1>
          <div className="directionto-column">
            <label className="Subscription-label">Email:</label>
            <input
              className="Subscription-email"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="directionto-column">
            <label className="Subscription-label">Password:</label>
            <div className="inputwitheye">
              <input
                className="Subscription-password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="password"
                name="password"
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
          
          <input
            className="Subscriptionsubmit"
            type="submit"
            value={loading ? "Loading..." : "Sign in"}
            disabled={loading}
            
          />
        </form>
      </div>
    </div>
  );
};

export default SubscriptionLogin;
