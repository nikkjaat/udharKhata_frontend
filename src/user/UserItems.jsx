import React, { useContext, useEffect, useState } from "react";
import styles from "./UserItems.module.css";
import UserNavbar from "../components/user Navbar/UserNavbar";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import BottomNavbar from "../components/user Navbar/BottomNavbar";

export default function UserItems() {
  const [items, setItems] = useState([]);
  const [shopkeeperName, setShopkeeperName] = useState("");
  const [shopkeeper, setShopkeeper] = useState([]);
  const authCtx = useContext(AuthContext);
  let totalPrice = 0;

  useEffect(() => {
    const getItems = async () => {
      const userId = sessionStorage.getItem("userId");
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/getitemsdetails?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        setItems(response.data);
      }
    };
    getItems();
  }, []);
  if (items.data) {
    items.data.forEach((item) => {
      totalPrice += item.price;
    });
  }
  useEffect(() => {
    const getShopkeeper = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/getshopkeepername?userId=${
          items.data[0].userId
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response.data);
      setShopkeeperName(response.data.data.shopkeeperName);
      getAdmin(response.data.data.userId);
    };
    getShopkeeper();
  }, [items]);

  const getAdmin = async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/getshopkeeper?adminId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response.data);
    if (response.status === 200) {
      setShopkeeper(response.data.data);
    }
  };
  // console.log(totalPrice);
  return (
    <>
      <UserNavbar />
      <div className={styles.container}>
        {items.data &&
          items.data.map((item) => {
            return (
              <div className={styles.btn}>
                <div className={styles.input}>{item.name}</div>
                <div className={styles.input}>{item.price}</div>
                <div className={styles.input}>
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            );
          })}
      </div>
      <BottomNavbar
        shopkeeper={shopkeeper}
        totalPrice={totalPrice}
        shopkeeperName={shopkeeperName}
      />
    </>
  );
}
