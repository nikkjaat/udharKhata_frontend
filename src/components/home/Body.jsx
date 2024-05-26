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
import BottomNavbar from "../navbar/BottomNavbar";

export default function Home() {
  const authCtx = useContext(AuthContext);

  // const [addCustomer, setAddCustomer] = useState(false);
  // const [customers, setCustomers] = useState([]);
  const [customerData, setCustomerData] = useState({
    name: "",
    number: null,
  });
  const [addProduct, setAddProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [userId, setUserId] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  // console.log(userId);
  // useEffect(() => {
  //   const getCustomer = async () => {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/admin/getadmincustomers`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + authCtx.token,
  //         },
  //       }
  //     );
  //     // console.log(response.data.data[0].customerId._id);
  //     setCustomers(response.data);
  //   };
  //   getCustomer();
  // }, [authCtx.refresh]);

  // useEffect(() => {
  //   const getProduct = async () => {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/admin/getproduct`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + authCtx.token,
  //         },
  //       }
  //     );
  //     // console.log(response);
  //   };
  //   getProduct();
  // }, [authCtx.refresh]);

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

  const addItem = () => {
    setAddProduct(true);
  };

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
              open={open}
              setAlert={setAlert}
              setAlertType={setAlertType}
              setAlertMessage={setAlertMessage}
              customerData={customerData}
              products={products}
              setAddProduct={setAddProduct}
              addProduct={addProduct}
              setOpen={setOpen}
              setProductId={setProductId}
            />
          </div>
          {!showNav && (
            <div className={styles.bottomNavbarContainer}>
              <BottomNavbar
                open={open}
                setOpen={setOpen}
                customerData={customerData}
                userId={userId}
                products={products}
                productId={productId}
                setProductId={setProductId}
                onClick={addItem}
              />
            </div>
          )}
        </div>
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
              borderRadius: "0em 0.3em 0.3em 0em",
              position: "sticky",
              top: "37em",
              right: "14em",
              zIndex: "100",
              cursor: "pointer",
            }}>
            {showNav ? (
              <i class="bi bi-chevron-double-right"></i>
            ) : (
              <i class="bi bi-chevron-double-left"></i>
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
                setUserId={setUserId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
