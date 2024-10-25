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
               <i class="fa-solid fa-eye"></i>
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
