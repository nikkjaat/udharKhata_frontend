import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css"; // Make sure to create this file with the CSS above

export default function Login() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [number, setNumber] = useState();
  const [password, setPassword] = useState();
  const [OTP, setOTP] = useState("");
  const [admin, setAdmin] = useState(false);
  const [otpBtn, setOtpBtn] = useState(false);
  const [otp, setOtp] = useState(false);
  const [showPassword, setShowPassword] = useState("password");

  const adminHandler = (e) => {
    setAdmin(e.target.checked);
    setOtp(false);
  };

  const inputHandler = (event, value) => {
    if (event === "number") {
      if (value.length >= 10 && value.length <= 12) {
        setOtpBtn(true);
      } else {
        setOtpBtn(false);
      }
      setNumber(value);
    } else if (event === "password") {
      setPassword(value);
    } else {
      setOTP(value);
    }
  };

  const getOtp = async () => {
    setOtp(true);
    setAdmin(false);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/getotp?number=${number}`
    );

    if (response.status === 200) {
      console.log(response.data.otp);
      alert(`OTP is : ${response.data.otp}`);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (admin) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/login`,
          { number, password }
        );

        if (response.status === 200) {
          authCtx.refreshHandler();
          authCtx.loginHandler(response.data.authToken, response.data.admin);
          navigate("/");
        }
      } catch (error) {
        console.error("Admin login error:", error.response?.data);
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/login`,
          { number, otp: OTP }
        );

        if (response.status === 200) {
          authCtx.refreshHandler();
          authCtx.loginHandler(response.data.authToken, response.data.admin);
          navigate("/");
        }
      } catch (error) {
        console.error("User login error:", error.response?.data);
      }
    }
  };

  const showPasswordOnClick = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={submitHandler}>
          <h2 className="login-title">Welcome Back</h2>
          
          <div className="form-group">
            <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
            <input
              onChange={(e) => inputHandler("number", e.target.value)}
              type="number"
              className="form-input"
              id="mobileNumber"
              placeholder="Enter your mobile number"
            />
            {otpBtn && (
              <button
                type="button"
                onClick={getOtp}
                className="get-otp-btn"
              >
                Get OTP
              </button>
            )}
          </div>

          <div className="form-group">
            {admin && (
              <>
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  onChange={(e) => inputHandler("password", e.target.value)}
                  type={showPassword}
                  className="form-input"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
                <FontAwesomeIcon 
                  onClick={showPasswordOnClick} 
                  icon={showPassword === "password" ? faEye : faEyeSlash} 
                  className="password-toggle"
                />
              </>
            )}
            {otp && (
              <>
                <label className="form-label" htmlFor="otp">OTP</label>
                <input
                  onChange={(e) => inputHandler("otp", e.target.value)}
                  type="number"
                  className="form-input"
                  id="otp"
                  placeholder="Enter OTP received"
                />
              </>
            )}
          </div>
          
          <div className="admin-checkbox">
            <input
              onChange={adminHandler}
              type="checkbox"
              id="adminCheck"
            />
            <label htmlFor="adminCheck">I'm an Admin</label>
          </div>
          
          <button type="submit" className="submit-btn">
            Login
          </button>
          
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </>
  );
}