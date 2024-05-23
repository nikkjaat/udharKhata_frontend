import React, { useContext, useEffect, useState } from "react";
import styles from "../components/home/Body.module.css";
import axios from "axios";
import AuthContext from "../Context/AuthContext";

export default function MyCustomer(props) {
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [hold, setHold] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  // const [products, setProducts] = useState([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const getCustomer = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getadmincustomers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        setCustomers(response.data);
      }
    };
    getCustomer();
  }, [authCtx.refresh]);

  const filterHandler = async (e) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/admin/filtercustomer?filter=${
        e.target.value
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response);
    if (response.status === 203) {
      setCustomers([]);
    }
    if (response.status === 200) {
      setCustomers(response.data);
    }
  };
  // console.log(customers.data);
  useEffect(() => {
    userHandler(props.customerId);
  }, []);

  const userHandler = async (userId) => {
    // console.log(userId);
    props.setUserId(userId);
    props.setCustomerId(userId);
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/admin/getcustomerdata?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response.data);
    if (response.status === 200) {
      setAddProduct(false);
      props.products(response.data);
      // setProducts(response.data);
      props.customerData(response.data.user);
    }
  };

  // Function to handle tap start
  const handleTouchStart = () => {
    setHoldTimeout(setTimeout(handleHold, 800)); // Adjust the duration for your hold
  };

  // Function to handle tap end
  const handleTouchEnd = () => {
    clearTimeout(holdTimeout);
  };

  // Function to handle hold event
  const handleHold = () => {
    setHold(true);
    console.log("Hold event detected");
    // Perform actions you want on hold event
  };
  return (
    <>
      <div className={styles.inputContainer}>
        <input
          onChange={filterHandler}
          type="search"
          autoComplete="false"
          placeholder="Name / Number"
          name="search"
          id="search"
        />
      </div>
      <ul className={styles.customerNames}>
        {customers.data ? (
          customers.data.map((customer) => {
            return (
              <li
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                key={customer._id}
                onClick={() => {
                  userHandler(
                    customers.admin ? customer._id : customer.customerId._id
                  );
                }}
                style={{ cursor: "pointer", margin: "1em" }}>
                {customers.admin ? customer.name : customer.customerId.name}
              </li>
            );
          })
        ) : (
          <p>Not found</p>
        )}
      </ul>
    </>
  );
}
