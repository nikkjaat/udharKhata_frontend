import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Body.module.css";
import axios from "axios";
import MyCustomer from "../../admin/MyCustomers";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import Navbar from "../navbar/Navbar";
import Button from "../Button/Button";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditButton from "../Button/EditButton";
import AddCustomer from "../../admin/AddCustomer";
import CustomersItems from "../../admin/CustomersItems";
import CustomerDetails from "../../admin/CustomerDetails";
import Error from "../Error/Error";

export default function Home() {
  const authCtx = useContext(AuthContext);

  const [addCustomer, setAddCustomer] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    number: null,
  });
  const [addProduct, setAddProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showNav, setShowNav] = useState(false);
  const containerRef = useRef();

  // console.log(products);
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
      // console.log(response.data.data[0].customerId._id);
      setCustomers(response.data);
    };
    getCustomer();
  }, [authCtx.refresh]);

  useEffect(() => {
    const getProduct = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getproduct`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response);
    };
    getProduct();
  }, [authCtx.refresh]);

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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/addproduct`,
        {
          name,
          price,
          userId: customerData._id,
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
        setAddProduct(false);
      }
    } else {
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
        setAddProduct(false);
      }
    }
  };

  const customerInputHandler = (event, value) => {
    if (event === "name") {
      setCustomerName(value);
    } else if (event === "shopkeeperName") {
      setShopkeeperName(value);
    } else {
      setNumber(value);
    }
  };

  const addCustomerHandler = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/addcustomer`,
      {
        name: customerName,
        number: number,
        shopkeeperName: shopkeeperName,
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
      authCtx.refreshHandler();
      setAddCustomer(false);
    }
  };

  useEffect(() => {
    userHandler(customerId);
  }, [authCtx.refresh]);

  const userHandler = async (userId) => {
    // console.log(userId);
    setCustomerId(userId);
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
    // console.log(response);
    if (response.status === 200) {
      setAddProduct(false);
      setProducts(response.data);
      setCustomerData(response.data.user);
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
    } else {
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
        setAddProduct(false);
      }
    }
  };

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
    console.log(response.data);
    if (response.status === 203) {
      setCustomers(response.data);
    }
    if (response.status === 200) {
      setCustomers(response.data);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && containerRef.current.contains(event.target)) {
        // Clicked outside navbar
        setShowNav(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNav]);

  return (
    <>
      <Error
        alert={alert}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlert={setAlert}
      />

      <Navbar userHandler={userHandler} />

      <div className={styles.body}>
        <div className={`${styles.sideNav} ${!showNav && styles.hideSideNav}`}>
          <div
            onClick={() => {
              setShowNav(!showNav);
            }}
            style={{
              background: "black",
              width: "fit-content",
              marginLeft: "auto",
              padding: ".3em .4em .4em",
              borderRadius: ".3em 0 0 .3em",
            }}>
            {showNav ? (
              <i class="bi bi-chevron-double-left"></i>
            ) : (
              <i class="bi bi-chevron-double-right"></i>
            )}
          </div>
          <div className={styles.sideNavChild}>
            <div>
              <AddCustomer
                setAlert={setAlert}
                setAlertType={setAlertType}
                setAlertMessage={setAlertMessage}
              />
            </div>

            <hr />
            <div>
              <MyCustomer
                setCustomerId={setCustomerId}
                customerData={setCustomerData}
                products={setProducts}
              />
            </div>
          </div>
        </div>

        <div ref={containerRef} className={styles.container}>
          <CustomerDetails
            customerId={setCustomerId}
            customerData={customerData}
            setCustomerData={setCustomerData}
            setProducts={setProducts}
            setAlert={setAlert}
            setAlertType={setAlertType}
            setAlertMessage={setAlertMessage}
          />

          <div className={styles.userData}>
            <CustomersItems
              setAlert={setAlert}
              setAlertType={setAlertType}
              setAlertMessage={setAlertMessage}
              customerData={customerData}
              products={products}
            />
          </div>
        </div>
      </div>
    </>
  );
}
