import React, { useContext, useEffect, useState } from "react";
import styles from "./BottomNavbar.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import Chat from "../chat/Chat";
import AuthContext from "../../Context/AuthContext";
import Error from "../Error/Error";
import PaidAmount from "../PayBill/PaidAmount";
import ShopkeeprDetails from "../Shopkeeper Details/ShopkeeperDetails";
import RazorPay from "../../user/RazorPay";
import ConfirmAmountModal from "../../user/ConfirmAmountModal";
import Button from "../Button/Button";

export default function BottomNavbar(props) {
  const authCtx = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [paidData, setPaidData] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [customAmount, setCustomAmount] = useState(null);

  const getNewMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/newmessage?userId=${
        props.shopkeeper._id
      }&number=${authCtx.userId}`
    );
    setNewMessage(response.data.newCustomerMessage);
  };

  useEffect(() => {
    getNewMessage();
  }, [props.shopkeeper._id]);

  const readMessage = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/message/readmessage`,
      {
        senderId: authCtx.userId,
        receiverId: props.shopkeeper._id,
        admin: false,
      }
    );
    if (response.status === 200) getNewMessage();
  };

  const sendMessage = async () => {
    const message = {
      senderId: authCtx.userId,
      receiverId: props.shopkeeper._id,
      text: value,
      conversationId: `${props.shopkeeper._id}?${authCtx.userId}`,
      admin: false,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/message/send`,
        { message }
      );
      if (response.status === 200) {
        setAlert(true);
        setAlertType("success");
        setAlertMessage(response.data);
        getMessage();
        setValue("");
      }
    } catch (error) {
      console.error("Message send error:", error.message);
      props.setAlert(true);
      props.setAlertType("error");
      props.setAlertMessage("An unexpected error occurred");
    }
  };

  const getMessage = async () => {
    if (!props.shopkeeper?._id) return;
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/get?conversationId=${
        props.shopkeeper._id
      }?${authCtx.userId}`
    );
    if (response.status === 200) {
      setMessage(response.data);
    }
  };

  useEffect(() => {
    getMessage();
  }, [props.shopkeeper]);

  const getPaidAmount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getpaidamount?customerId=${
          props.data._id
        }&adminId=${props.data.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        setPaidData(response.data);
      }
    } catch (error) {
      console.log("Fetch paid amount error:", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getPaidAmount();
  }, [props.data._id]);

  return (
    <>
      <Error
        alert={alert}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlert={setAlert}
      />
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.leftSection}>
            <ShopkeeprDetails
              totalAmount={props.totalPrice}
              paidAmount={props.data.paidAmount}
              shopkeeperName={props.data.shopkeeperName}
              number={props.shopkeeper.number}
              getItems={props.getItems}
              getPaidAmount={getPaidAmount}
            />
          </div>

          <div className={styles.centerSection}>
            <div className={styles.iconGroup}>
              <Link
                to={`https://wa.me/+91${props.shopkeeper?.number}`}
                target="_blank"
                title="Message on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className={styles.icon} />
              </Link>

              <Button
                onClick={() => setShowAmountModal(true)}
                style={{
                  background: "#f1f1f1",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Pay
              </Button>

              <ConfirmAmountModal
                shopkeeperName={props.data.shopkeeperName}
                number={props.shopkeeper.number}
                price={customAmount}
                data={props.data}
                getItems={props.getItems}
                getPaidAmount={getPaidAmount}
                open={showAmountModal}
                onClose={() => setShowAmountModal(false)}
                maxAmount={props.totalPrice - props.data.paidAmount}
                onConfirm={(amount) => {
                  setCustomAmount(amount);
                }}
              />

              {/* {customAmount && (
                <RazorPay
                  shopkeeperName={props.data.shopkeeperName}
                  number={props.shopkeeper.number}
                  price={customAmount}
                  data={props.data}
                  getItems={props.getItems}
                  getPaidAmount={getPaidAmount}
                />
              )} */}

              <Chat
                readMessage={readMessage}
                className={styles.chat}
                message={message}
                getMessage={getMessage}
                value={value}
                setValue={setValue}
                sendText={sendMessage}
                newMessage={newMessage}
              />
            </div>
          </div>

          <div className={styles.rightSection}>
            <PaidAmount
              buttonSx={customButtonStyle}
              customer={true}
              paidData={paidData}
              price={props.data.totalAmount - props.data.paidAmount}
              getPaidAmount={getPaidAmount}
              getItems={props.getItems}
              open={open}
              setOpen={setOpen}
            />
          </div>
        </nav>
      </div>
    </>
  );
}

const customButtonStyle = {
  background: "rgba(0, 0, 0, 0.2)",
  color: "black",
};
