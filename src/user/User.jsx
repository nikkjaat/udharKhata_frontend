import React, { useContext, useEffect, useState } from "react";
import styles from "./User.module.css";
import Navbar from "../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Card from "../components/card/Card";
import AuthContext from "../Context/AuthContext";
import UserNavbar from "../components/user Navbar/UserNavbar";
import BottomNavbar from "../components/user Navbar/BottomNavbar";

export default function User() {
  const [customers, setCustomers] = useState([]);
  const authCtx = useContext(AuthContext);

  const number = authCtx.userId;

  useEffect(() => {
    const getCustomer = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/getcustomers?number=${number}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      setCustomers(response.data);
    };
    getCustomer();
  }, []);

  return (
    <>
      <UserNavbar setCustomers={setCustomers} />
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {customers.data &&
            customers.data.map((customer) => {
              return <Card customers={customer} />;
            })}
        </div>
      </div>
      {/* <BottomNavbar /> */}
    </>
  );
}
