import React, { useState } from "react";
import styles from "./Signup.module.css";
import Navbar from "../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [number, setNumber] = useState();
  const [password, setPassword] = useState();

  const inputHandler = (event, value) => {
    if (event === "name") {
      setName(value);
    } else if (event === "number") {
      setNumber(value);
    } else {
      setPassword(value);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/signup`,
      {
        name,
        number,
        password,
      }
    );
    if (response.status === 200) {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.container} container`}>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="exampleInputName">Full Name</label>
            <input
              required
              type="text"
              className=""
              id="exampleInputName"
              placeholder="Enter Name"
              onChange={(e) => {
                inputHandler("name", e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputNumber">Mobile Number</label>
            <input
              required
              onChange={(e) => {
                inputHandler("number", e.target.value);
              }}
              type="number"
              className=""
              id="exampleInputNumber"
              placeholder="Enter Number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              required
              type="password"
              className=""
              id="exampleInputPassword1"
              placeholder="Password"
              onChange={(e) => {
                inputHandler("password", e.target.value);
              }}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your details with anyone else.
            </small>
          </div>
          <div className={styles.signupLink}>
            <Link to={"/login"}>Login</Link>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
