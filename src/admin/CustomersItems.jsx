import React, { useContext, useEffect, useState } from "react";
import styles from "../components/home/Body.module.css";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import AddCustomer from "./AddCustomer";
import Chat from "../components/chat/Chat";
import CustomContext from "../Context/CustomContext";

export default function (props) {
  const [message, setMessage] = useState([]);
  // const [props.addProduct, props.setAddProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [productId, setProductId] = useState("");
  const [newMessage, setNewMessage] = useState(false);
  const [value, setValue] = useState("");
  const authCtx = useContext(AuthContext);
  const customeCtx = useContext(CustomContext);

  const getNewMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/newmessage?userId=${
        props.customerData.userId
      }&number=${props.customerData.number}`
    );
    setNewMessage(response.data.newShopkeeperMessage);
  };
  useEffect(() => {
    getNewMessage();
  }, [props.customerData._id]);

  const getMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/get?conversationId=${
        authCtx.userId + "?" + props.customerData.number
      }`
    );
    // console.log(response);
    if (response.status === 200) {
      setMessage(response.data);
    } else if (response.status === 404) {
      setMessage([]);
    }
  };

  React.useEffect(() => {
    getMessage();
  }, [props.customerData.number]);
  // console.log(message);

  const sendText = async () => {
    let message = {
      senderId: authCtx.userId,
      receiverId: props.customerData.number,
      text: value,
      conversationId: authCtx.userId + "?" + props.customerData.number,
      admin: true,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/message/send`,
      {
        message,
      }
    );
    if (response.status === 200) {
      setValue("");
      return response;
    }
  };

  const readMessage = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/message/readmessage`,
      {
        senderId: authCtx.userId,
        receiverId: props.customerData.number,
        admin: true,
      }
    );
    // console.log(response);
    if (response.status === 200) {
      getNewMessage();
    }
  };

  const editNadDeleteHandler = async (event, productId) => {
    if (event === "edit") {
      setProductId(productId);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/getsingleproduct?productId=${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      setName(response.data.product.name);
      setPrice(response.data.product.price);
      // setTotalPrice(response.data.product.price + totalPrice);
    } else {
      try {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/admin/deleteproduct?productId=${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.status === 200) {
          setProductId("");
          authCtx.refreshHandler();
          props.setAddProduct(false);
          props.setAlert(true);
          props.setAlertType("success");
          props.setAlertMessage(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            props.setAlert(true);
            props.setAlertType("success");
            props.setAlertMessage(response.data.message);
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
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
    }
  };

  // const unreadNotifications = async () => {
  //   const response = await axios.post(
  //     `${import.meta.env.VITE_BACKEND_URL}/admin/unreadnotification?userId=${
  //       props.customerData._id
  //     }`,
  //     {},
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + authCtx.token,
  //       },
  //     }
  //   );
  // };

  const deleteAllData = async (adminId, customerId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/deletealldata?adminId=${adminId}&customerId=${customerId}`
      );
      if (response.status === 200) {
        authCtx.refreshHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {props.customerData._id && (
        <div className={styles.chatButton}>
          {customeCtx.deleteButton && (
            <div
              onClick={() => {
                deleteAllData(
                  props.customerData.userId,
                  props.customerData._id
                );
              }}
            >
              Clear all Data <i className="fa fa-trash"></i>
            </div>
          )}
          <Chat
            readMessage={readMessage}
            message={message}
            getMessage={getMessage}
            value={value}
            setValue={setValue}
            sendText={sendText}
            customer={props.customerData}
            className={styles.chat}
            newMessage={newMessage}
          />
        </div>
      )}
      <div className={styles.addCustomerButton}>
        <AddCustomer />
      </div>
      <div className={styles.dataField}>
        <div>Date</div>
        <div>Product</div>
        <div>Price</div>
      </div>

      <div className={styles.customerDataDetailes}>
        {props.products.products ? (
          props.products.products.map((product) => {
            return (
              <>
                <div key={product._id} className={styles.data}>
                  <div>{new Date(product.date).toLocaleDateString()}</div>
                  <div>{product.name}</div>
                  <div>{product.price}</div>

                  <div>
                    <span
                      onClick={() => {
                        // eidtNadDeleteHandler("edit", product._id);
                        props.setProductId(product._id);
                        props.setOpen(true);
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </span>
                    <span
                      onClick={() => {
                        editNadDeleteHandler("delete", product._id);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </span>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <h2>No Data Available</h2>
        )}
      </div>
    </>
  );
}
