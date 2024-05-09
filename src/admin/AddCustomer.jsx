import React, { useContext, useEffect, useState } from "react";
import styles from "../components/home/Body.module.css";
import Button from "../components/Button/Button";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import Error from "../components/Error/Error";

export default function AddCustomer(props) {
  const [getOtp, setGetOtp] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [addCustomer, setAddCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [shopkeeperName, setShopkeeperName] = useState("");
  const [number, setNumber] = useState("");

  const [otp, setOtp] = useState(null);
  const authCtx = useContext(AuthContext);

  const customerInputHandler = (event, value) => {
    if (event === "name") {
      setCustomerName(value);
    } else if (event === "shopkeeperName") {
      setShopkeeperName(value);
    } else if (event === "number") {
      setNumber(value);
    } else {
      setOtp(value);
    }
  };

  useEffect(() => {
    // Update the disabledBtn state based on input conditions
    if (number.length === 10 && customerName.length > 3) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [number, shopkeeperName, customerName]);

  const sentOtp = async () => {
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
        setGetOtp(true);
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          console.log("Customer already exists");
          props.setAlert(true);
          props.setAlertType("warning");
          props.setAlertMessage(error.response.data.message);
        }
        if (error.response.status === 500) {
          console.log("Customer already exists");
          props.setAlertType("warning");
          props.setAlertMessage(error.response.data.error);
          alert(error.response.data.error);
          props.setAlert(true);
        }
      }
    }
  };

  const addCustomerHandler = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/addcustomer`,
        {
          name: customerName,
          number: number,
          shopkeeperName: shopkeeperName,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      // Check for successful response (2xx status codes)
      if (response.status === 200) {
        console.log("Add");
        setDisabledBtn(true);
        setAddCustomer(false);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
        authCtx.refreshHandler();
        props.setAlert(true);
      } else {
        // Handle other successful status codes (if needed)
      }
    } catch (error) {
      // Handle error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          console.log("Invalid OTP");
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage("Invalid OTP");
        } else if (error.response.status === 403) {
          console.log("OTP expired");
          props.setAlert(true);
          props.setAlertType("warning");
          props.setAlertMessage("Your OTP has expired");
        } else {
          // Handle other error status codes
          console.error("Error:", error.response.data.message);
          props.setAlert(true);
          props.setAlertType("error");
          props.setAlertMessage("An unexpected error occurred");
        }
      } else if (error.request) {
        // The request was made but no response was received
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

  return (
    <>
      <div style={{ maxWidth: "17em", minWidth: "10em", position: "relative" }}>
        <div
          onClick={() => {
            setAddCustomer(!addCustomer);
            setGetOtp(false);
          }}
          className={styles.addCustomerBtn}>
          <b>
            {!addCustomer ? (
              <Button>Add Customer</Button>
            ) : (
              <Button
                onClick={() => {
                  setDisabledBtn(true);
                }}
                className="cancel">
                Cancel
              </Button>
            )}
          </b>
        </div>
        {addCustomer && (
          <div className={styles.addCustomer}>
            <div className={styles}>
              <input
                onChange={(e) => {
                  customerInputHandler("name", e.target.value);
                }}
                required
                type="text"
                placeholder="Enter Customer Name"
                name="customername"
                id="customername"
              />
            </div>
            <div className={styles}>
              <input
                type="number"
                onChange={(e) => {
                  customerInputHandler("number", e.target.value);
                }}
                required
                placeholder="Enter Customer Number"
                name="customernumber"
                id="customernumber"
              />
            </div>
            {!getOtp ? (
              <button
                disabled={disabledBtn}
                onClick={() => {
                  sentOtp();
                }}
                className={styles.getOtpBtn}>
                Get otp
              </button>
            ) : (
              <>
                {" "}
                <div className={styles}>
                  <input
                    onChange={(e) => {
                      customerInputHandler("otp", e.target.value);
                    }}
                    type="number"
                    placeholder="Enter OTP"
                    name="otp"
                    id="otp"
                  />
                </div>
                <span
                  style={{
                    color: "blue",
                    fontWeight: "400",
                    position: "relative",
                  }}>
                  Resend
                </span>
              </>
            )}

            {getOtp && (
              <button className={styles.submitBtn} onClick={addCustomerHandler}>
                Save
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
