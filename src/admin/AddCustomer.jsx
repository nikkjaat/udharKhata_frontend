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
    if (event === "name") setCustomerName(value);
    else if (event === "shopkeeperName") setShopkeeperName(value);
    else if (event === "number") setNumber(value);
    else setOtp(value);
  };

  useEffect(() => {
    if (number.length === 10 && customerName.length > 3) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [number, customerName]);

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
      if (response.status === 200) {
        setGetOtp(true);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.message);
        alert(error.response.data.message || "Something went wrong");
      }
    }
  };

  const addCustomerHandler = async (e) => {
    e.preventDefault(); // prevent page reload
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

      if (response.status === 200) {
        props.getCustomer();
        authCtx.refreshHandler();

        // Clear form
        setCustomerName("");
        setNumber("");
        setOtp(null);
        setGetOtp(false);
        setAddCustomer(false);
        setDisabledBtn(true);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Submission failed");
      } else {
        console.error("Request failed:", error.message);
      }
    }
  };

  const handleCancel = () => {
    setAddCustomer(false);
    setGetOtp(false);
    setCustomerName("");
    setNumber("");
    setOtp(null);
    setDisabledBtn(true);
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        minWidth: "10em",
        position: "relative",
        backgroundColor: !addCustomer ? "transparent" : "#ec8626",
        padding: "1em 2em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderRadius: "1em",
      }}
    >
      <div
        onClick={() => {
          if (addCustomer) handleCancel();
          else setAddCustomer(true);
        }}
        className={styles.addCustomerBtn}
      >
        <b>
          {!addCustomer ? (
            <Button>Add Customer</Button>
          ) : (
            <Button className="cancel">Cancel</Button>
          )}
        </b>
      </div>

      {addCustomer && (
        <form className={styles.addCustomer} onSubmit={addCustomerHandler}>
          <div>
            <input
              onChange={(e) => customerInputHandler("name", e.target.value)}
              required
              type="text"
              placeholder="Enter Customer Name"
              value={customerName}
            />
          </div>
          <div>
            <input
              type="number"
              onChange={(e) => customerInputHandler("number", e.target.value)}
              required
              placeholder="Enter Customer Number"
              value={number}
            />
          </div>

          {!getOtp ? (
            <button
              type="button"
              disabled={disabledBtn}
              onClick={sentOtp}
              className={styles.getOtpBtn}
            >
              Get OTP
            </button>
          ) : (
            <>
              <div>
                <input
                  onChange={(e) => customerInputHandler("otp", e.target.value)}
                  type="number"
                  placeholder="Enter OTP"
                  name="otp"
                  value={otp || ""}
                />
              </div>
              <span style={{ color: "blue", fontWeight: 400 }}>Resend</span>
              <button type="submit" className={styles.submitBtn}>
                Save
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
