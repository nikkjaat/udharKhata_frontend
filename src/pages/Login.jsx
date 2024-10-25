import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";


export default function Login() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [number, setNumber] = useState();
  const [password, setPassword] = useState();
  const [OTP, setOTP] = useState("");
  const [admin, setAdmin] = useState(false);
  const [otpBtn, setOtpBtn] = useState(false);
  const [otp, setOtp] = useState(false);

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

    console.log(response);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (admin) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/login`,
          {
            number,
            password,
          },
          { withCredentials: true }
        );
        console.log(response);
        if (response.status === 200) {
          authCtx.refreshHandler();
          authCtx.loginHandler(response.data.authToken);
          navigate("/");
        }
      } catch (error) {
        if (error) {
          console.log(error.response);
        }
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/user/login`,
          {
            number,
            otp: OTP,
          }
        );
        console.log(response);
        if (response.status === 200) {
          authCtx.refreshHandler();
          authCtx.loginHandler(response.data.authToken);
          navigate(`/user`);
        }
      } catch (error) {
        if (error) {
          console.log(error.response);
        }
      }
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
                className={styles.getOtpButton}>
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
                  type="text"
                  className={styles.input}
                  id="exampleInputPassword1"
                  placeholder="Password"
                  required
                />
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
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
