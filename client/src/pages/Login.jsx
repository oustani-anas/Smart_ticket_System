
import React, { useEffect, useState } from "react";
import Image from "../assets/ticket2.png";
import Logo from "../assets/face2.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import TypewriterBanner from "../components/TypewriterBanner"


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [hasError, setHasError] = useState(false)
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    if (email.length > 0 && password.length > 0) {
      const formData = {
        email,
        password,
      };

      try {
        const response = await api.post("auth/login", formData);
        console.log('response: ', response.data);
        toast.success("Login successfull");
        navigate("/dashboard");
      } catch (err) {
        console.log("err message: ", err.response?.data?.message)
        let message = "Something went wrong. Please try again.";

      if (err.response) {
    // Backend responded with an error (like 401 or 500)
        if (err.response.status === 401) {
          message = "Invalid email or password";
          console.log("status code is ", err.response.status);
        } else if (err.response.status === 500) {
          message = "Server error. Please try later.";
          console.log("status code is ", err.response.status);
        } else {
          message = err.response.data?.message || message;
        }
        } else if (err.request) {
      // Request was made but no response (e.g. backend is down)
          message = "Cannot reach server. Please check your connection.";
        }
        setErrorMessage(message); // 👈 sets the message under the form
        setHasError(true);
        toast.error(message); // optional
      }
      
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        await api.get("/auth/profile"); 
        toast.info("You are already logged in.");
        navigate("/dashboard");
      } catch (error) {
        console.log("No active session found.");
      }
    };

    checkUserStatus();
  }, [navigate]); 
  

  return (
    <>
    <TypewriterBanner />
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="Email"
                name="email" 
                className={hasError ? "error-input" : ""}
                onChange={() => setHasError(false)}
                />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  className={hasError ? "error-input" : ""}
                  onChange={() => setHasError(false)}
                  />
                {showPassword ? (
                  <FaEyeSlash
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  />
                ) : (
                  <FaEye
                  onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    />
                  )}
              </div>
              {errorMessage && (
                <div className="form-error-message">{errorMessage}</div>
              )}
              <button
                type="button"
                className="camera-btn"
                onClick={() => {
                // You can replace this with navigation or modal open logic
                console.log("Open camera");
                }}
                >
                    Open Camera for Face Recognition
                </button>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
                <button type="submit">
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
