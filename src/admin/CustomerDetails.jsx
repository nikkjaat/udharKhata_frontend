import React, { useContext, useEffect, useState } from "react";
import styles from "../components/home/Body.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import Error from "../components/Error/Error";

export default function CustomerDetails(props) {
  const [edit, setEdit] = useState(false);
  const [getOTP, setGetOTP] = useState(false);
  const [OTP, setOTP] = useState(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [otpVerify, setOtpVerify] = useState(false);

  const authCtx = useContext(AuthContext);

  // console.log(props.customerData);
  useEffect(() => {
    setName(props.customerData.name);
    setNumber(props.customerData.number);
    setEdit(false);
  }, [props.customerData]);

  const inputHandler = (event, value) => {
    if (event === "name") {
      setName(value);
    } else if (event === "number") {
      setNumber(value);
    } else {
      setOTP(value);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/updatecustomer?customerId=${customerId}`,
        {
          name,
          number,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response);
      if (response.status === 200) {
        setEdit(false);
        authCtx.refreshHandler();
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
      } else if (error.request) {
      } else {
      }
    }
  };

  const getOTPHandle = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/changenumber?number=${
          props.customerData.number
        }`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setGetOTP(true);
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // handle error response from server
      } else if (error.request) {
        console.error("No response received:", error.request);
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("An unexpected error occurred");
      }
    }
  };

  const submitOTP = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/verifyotp`,
        {
          number,
          otp: OTP,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setOtpVerify(true);
        setNumber("");
        setOTP("");
        setGetOTP(false);
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage(error.response.data.message);
        }
      } else if (error.request) {
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("No response received from the server");
      } else {
        console.error("Error:", error.message);
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("An unexpected error occurred");
      }
    }
  };

  const verifyNumber = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/verifyotp`,
        {
          number,
          otp: OTP,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        setOtpVerify(true);
        setOTP("");
        setGetOTP(false);
        setOtpVerify(false);
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage(error.response.data.message);
        } else {
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage(error.response.data.message);
        }
      } else if (error.request) {
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("No response received from the server");
      } else {
        console.error("Error:", error.message);
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("An unexpected error occurred");
      }
    }
  };

  const verifyNewNumber = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getotp?number=${number}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setOtpVerify(true);
        setGetOTP(false);
        setGetOTP(true);
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage(error.response.data.message);
        }
      } else if (error.request) {
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("No response received from the server");
      } else {
        console.error("Error:", error.message);
        props.setAlert(true);
        props.setAlertType("error");
        props.setAlertMessage("An unexpected error occurred");
      }
    }
  };

  const deleteCustomerHandler = async (customerId, customerNumber) => {
    // console.log(customerId, customerNumber);
    const response = await axios.delete(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/admin/deletecustomer?customerId=${customerId}&customerNumber=${customerNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      props.setCustomerData({ name: "", number: "" });
      props.setProducts([]);
      props.customerId("");
      props.setAlert(true);
      props.setAlertType("success");
      props.setAlertMessage(response.data.message);
      authCtx.refreshHandler();
    }
  };

  // console.log(props.customerData);
  return (
    <>
      <div className={styles.userDetails}>
        <div>
          <div className={styles.name}>
            <p>Name : </p>
            <input
              readOnly={!edit}
              onChange={(e) => {
                inputHandler("name", e.target.value);
              }}
              className={edit && styles.input}
              type="text"
              value={name}
            />
          </div>
          <div className={styles.number}>
            <p>{otpVerify ? "Enter New Number :" : "Customer Number :"}</p>
            <input
              readOnly={!otpVerify}
              className={otpVerify && styles.input}
              onChange={(e) => {
                inputHandler("number", e.target.value);
              }}
              // className={getOTP && styles.input}
              type="number"
              value={number}
            />
            {edit && (
              <span style={{}}>
                {otpVerify ? (
                  <span
                    onClick={verifyNewNumber}
                    style={{
                      background: "blue",
                      padding: ".4em .8em",
                      width: "7em",
                      height: "2em",
                      textAlign: "center",
                      fontSize: ".7em",
                      borderRadius: "1em",
                      cursor: "pointer",
                    }}>
                    Verify
                  </span>
                ) : (
                  <span
                    style={{
                      background: "black",
                      padding: ".4em .8em",
                      width: "7em",
                      height: "2em",
                      textAlign: "center",
                      fontSize: ".7em",
                      borderRadius: "1em",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      getOTPHandle();
                    }}>
                    Get OTP
                  </span>
                )}
              </span>
            )}
          </div>
          {getOTP && (
            <p>
              Enter OTP :
              <input
                onChange={(e) => {
                  inputHandler("otp", e.target.value);
                }}
                className={getOTP && styles.input}
                type="number"
                value={OTP}
                placeholder="Enter OTP"
              />
              {otpVerify ? (
                <span
                  onClick={() => {
                    verifyNumber();
                  }}
                  style={{
                    background: "green",
                    padding: ".4em .8em",
                    width: "7em",
                    height: "2em",
                    textAlign: "center",
                    fontSize: ".7em",
                    borderRadius: "1em",
                    cursor: "pointer",
                  }}>
                  Submit
                </span>
              ) : (
                <span
                  onClick={() => {
                    submitOTP();
                  }}
                  style={{
                    background: "Blue",
                    padding: ".4em .8em",
                    width: "7em",
                    height: "2em",
                    textAlign: "center",
                    fontSize: ".7em",
                    borderRadius: "1em",
                    cursor: "pointer",
                  }}>
                  Submit
                </span>
              )}
            </p>
          )}
        </div>
        {props.customerData.name !== "" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            {edit ? (
              <div
                onClick={submitHandler}
                style={{
                  background: "green",
                  height: "1.5em",
                  padding: "0 .4em",
                  borderRadius: ".3em",
                  textAlign: "center",
                  cursor: "pointer",
                }}>
                Save
              </div>
            ) : (
              <FontAwesomeIcon
                cursor="pointer"
                icon={faPenToSquare}
                onClick={() => {
                  setEdit(true);
                  setCustomerId(props.customerData._id);
                }}
              />
            )}

            {edit ? (
              <div
                onClick={() => {
                  setEdit(false);
                  setGetOTP(false);
                  setName(props.customerData.name);
                  setNumber(props.customerData.number);
                  setOTP("");
                  setOtpVerify(false);
                }}
                style={{
                  background: "red",
                  height: "1.5em",
                  padding: "0 .4em",
                  borderRadius: ".3em",
                  textAlign: "center",
                  cursor: "pointer",
                }}>
                Cancel
              </div>
            ) : (
              <FontAwesomeIcon
                onClick={() => {
                  deleteCustomerHandler(
                    props.customerData._id,
                    props.customerData.number
                  );
                }}
                cursor="pointer"
                icon={faTrash}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
