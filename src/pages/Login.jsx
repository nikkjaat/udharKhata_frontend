import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

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
          navigate("/"); // Same route for both
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
          navigate("/"); // Same route for both
        }
      } catch (error) {
        console.error("User login error:", error.response?.data);
      }
    }
  };

  const showPasswordOnClick = () => {
    if (showPassword === "password") {
      setShowPassword("text");
    } else {
      setShowPassword("password");
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.container} container`}>
        <form onSubmit={submitHandler}>
          <div style={{ position: "relative" }} className="form-group">
            <label htmlFor="exampleInputNumber">Mobile Number</label>
            <input
              onChange={(e) => {
                inputHandler("number", e.target.value);
              }}
              type="number"
              className={styles.input}
              id="exampleInputNumber"
              placeholder="Enter Number"
            />
            {otpBtn && (
              <div
                disabled={true}
                onClick={() => {
                  getOtp();
                }}
                id="emailHelp"
                className={styles.getOtpButton}
              >
                Get OTP
              </div>
            )}
          </div>

          <div className="form-group">
            {admin && (
              <>
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  onChange={(e) => {
                    inputHandler("password", e.target.value);
                  }}
                  type={showPassword}
                  className={styles.input}
                  id="exampleInputPassword1"
                  placeholder="Password"
                  required
                />
                <FontAwesomeIcon onClick={showPasswordOnClick} icon={faEye} />
              </>
            )}
            {otp && (
              <>
                <label htmlFor="exampleInputPassword1">OTP</label>
                <input
                  onChange={(e) => {
                    inputHandler("otp", e.target.value);
                  }}
                  type="number"
                  className={styles.input}
                  id="exampleInputPassword1"
                  placeholder="Enter OTP"
                />
              </>
            )}
          </div>
          <div class="form-check">
            <input
              onChange={adminHandler}
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1">
              I'm Admin
            </label>
          </div>
          <div className={styles.signupLink}>
            <Link to={"/signup"}>Signup</Link>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
