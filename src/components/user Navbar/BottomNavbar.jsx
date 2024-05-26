import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./BottomNavbar.module.css";
import axios from "axios";
import GooglePayButton from "@google-pay/button-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcAmazonPay,
  faRocketchat,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import Chat from "../chat/Chat";
import AuthContext from "../../Context/AuthContext";
import Error from "../Error/Error";
import io from "socket.io-client";
import PaidAmount from "../PayBill/PaidAmount";
import ShopkeeprDetails from "../Shopkeeper Details/ShopkeeperDetails";

export default function BottomNavbar(props) {
  const authCtx = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidData, setPaidData] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  // const socket = io("http://localhost:4000");

  // useEffect(() => {
  //   // Listen for chat messages from the server
  //   socket.on("chatMessage", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   authCtx.socket.current.emit("addUsers", authCtx.userId);
  // }, []);

  // console.log(props.data);

  const getNewMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/newmessage?userId=${
        props.shopkeeper._id
      }&number=${authCtx.userId}`
    );
    // console.log(response);
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
    // console.log(response);
    if (response.status === 200) {
      getNewMessage();
    }
  };

  const sendMessage = async () => {
    let message = {
      senderId: authCtx.userId,
      receiverId: props.shopkeeper._id,
      text: value,
      conversationId: props.shopkeeper._id + "?" + authCtx.userId,
      admin: false,
    };
    // socket.emit("chatMessage", message);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/message/send`,
        {
          message,
        }
      );
      // console.log(response);

      if (response.status === 200) {
        setAlert(!alert);
        setAlertType("success");
        setAlertMessage(response.data);
        getMessage();
        setValue("");
        return response;
      } else {
        // Handle other successful status codes (if needed)
      }
    } catch (error) {
      if (error.response) {
        // Handle error response
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

  const getMessage = async () => {
    if (props.shopkeeper && props.shopkeeper._id) {
      // console.log(props.shopkeeper._id);
      // Check if props.shopkeeper and props.shopkeeper._id are not null or undefined
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/message/get?conversationId=${
          props.shopkeeper._id + "?" + authCtx.userId
        }`
      );
      // console.log(response);
      if (response.status === 200) {
        setMessage(response.data);
      }
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
        }&adminId=${props.data.userId}`
      );
      // console.log(response);
      if (response.status === 200) {
        setPaidData(response.data);
        let price = 0;
        response.data.forEach((item) => {
          price += item.amount;
          setPaidAmount(price);
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      }
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
        <nav className={`${styles.navbar} navbar justify-content-between`}>
          <div>
            {/* {props.data.shopkeeperName} */}
            <ShopkeeprDetails
              totalAmount={props.totalPrice}
              paidAmount={paidAmount}
              shopkeeperName={props.data.shopkeeperName}
              number={props.shopkeeper.number}
            />
          </div>
          <div className={styles.iconsContainer}>
            <Link
              title="WhatsApp"
              target="blank"
              to={`https://wa.me/+91${
                props.shopkeeper && props.shopkeeper.number
              }`}>
              <FontAwesomeIcon icon={faWhatsapp} />
            </Link>
            <Link title="Pay">
              <FontAwesomeIcon icon={faCcAmazonPay} />
            </Link>
            <Link title="Chat">
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
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <PaidAmount
              customer={true}
              paidData={paidData}
              price={props.totalPrice - paidAmount}
              getPaidAmount={getPaidAmount}
            />
          </div>
        </nav>
      </div>
    </>
  );
}
