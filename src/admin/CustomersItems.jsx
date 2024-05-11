import React, { useContext, useEffect, useState } from "react";
import styles from "../components/home/Body.module.css";
import Button from "../components/Button/Button";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import AddCustomer from "./AddCustomer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import Chat from "../components/chat/Chat";

export default function (props) {
  const [message, setMessage] = useState([]);
  // const [props.addProduct, props.setAddProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [productId, setProductId] = useState("");
  const [newMessage, setNewMessage] = useState(false);
  const [value, setValue] = React.useState("");
  const authCtx = useContext(AuthContext);

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

  const eidtNadDeleteHandler = async (event, productId) => {
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
      setTotalPrice(response.data.product.price + totalPrice);
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

  const unreadNotifications = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/unreadnotification?userId=${
        props.customerData._id
      }`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response);
  };

  const inputHandler = (event, value) => {
    if (event === "name") {
      setName(value);
    } else {
      setPrice(value);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (productId === "") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/addproduct`,
          {
            name,
            price,
            userId: props.customerData._id,
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
          unreadNotifications();
          authCtx.refreshHandler();
          props.setAddProduct(false);
          props.setAlert(true);
          props.setAlertType("success");
          props.setAlertMessage(response.data.message);
          setName("");
          setPrice("");
          setProductId("");
        }
      } catch (error) {
        if (error.request) {
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
    } else {
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/admin/updateproduct?productId=${productId}`,
          {
            name,
            price,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.status === 200) {
          authCtx.refreshHandler();
          props.setAddProduct(false);
          props.setAlert(true);
          props.setAlertType("success");
          props.setAlertMessage(response.data.message);
          setName("");
          setPrice("");
          setProductId("");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            props.setAlert(true);
            props.setAlertType("error");
            props.setAlertMessage(response.data.message);
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
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
  // console.log(props.products.products);
  return (
    <>
      {/* {!props.addProduct && props.products.products && (
        <div
          onClick={() => {
            props.setAddProduct(!props.addProduct);
            setName("");
            setPrice("");
            setProductId("");
          }}
          className={styles.addProduct}>
          <Button>Add Item</Button>
        </div>
      )} */}
      {props.customerData._id && (
        <div className={styles.chatButton}>
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
      {props.addProduct && (
        <form onSubmit={submitHandler} className={styles.addData}>
          <input
            onChange={(e) => {
              inputHandler("name", e.target.value);
            }}
            required
            value={name}
            type="text"
            placeholder="Enter Product Name"
          />
          <input
            onChange={(e) => {
              inputHandler("price", e.target.value);
            }}
            required
            value={price}
            type="number"
            placeholder="Enter Product Price"
          />

          <div>
            <button>Save</button>
            <button
              className={styles.removeProduct}
              onClick={() => {
                props.setAddProduct(!props.addProduct);
                setName("");
                setPrice("");
                setProductId("");
              }}>
              X
            </button>
          </div>
        </form>
      )}
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
                        eidtNadDeleteHandler("edit", product._id);
                        props.setAddProduct(true);
                      }}>
                      <i className="fa fa-edit"></i>
                    </span>
                    <span
                      onClick={() => {
                        eidtNadDeleteHandler("delete", product._id);
                      }}>
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
