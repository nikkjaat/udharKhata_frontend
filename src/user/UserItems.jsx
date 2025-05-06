import React, { useContext, useEffect, useState } from "react";
import styles from "./UserItems.module.css";
import UserNavbar from "../components/user Navbar/UserNavbar";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import BottomNavbar from "../components/user Navbar/BottomNavbar";
import { FiRefreshCw } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";

export default function UserItems() {
  const [items, setItems] = useState([]);
  const [shopkeeper, setShopkeeper] = useState("");
  const [data, setData] = useState([]);
  const authCtx = useContext(AuthContext);
  let totalPrice = 0;

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

  useEffect(() => {
    getItems();
  }, []);

  if (items.data) {
    items.data.forEach((item) => {
      totalPrice += item.price;
    });
  }

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
    setData(response.data.data);
    getAdmin(response.data.data.userId);
  };

  useEffect(() => {
    if (items.data) getShopkeeper();
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
    if (response.status === 200) {
      setShopkeeper(response.data.data);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className={styles.header}>
        <h1>udhaarKhata</h1>
        <button className={styles.reloadBtn} onClick={getItems}>
          <FiRefreshCw /> Reload
        </button>
      </div>

      <div className={styles.searchBar}>
        <input type="text" placeholder="Search" />
      </div>

      <div className={styles.container}>
        {items.data &&
          items.data.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.icon}>🍞</div>
                <div className={styles.name}>{item.name}</div>
              </div>
              <div className={styles.cardRight}>
                <div className={styles.price}>₹ {item.price}</div>
                <div className={styles.date}>
                  <FiCalendar size={14} />{" "}
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
      </div>

      <BottomNavbar
        getItems={getItems}
        shopkeeper={shopkeeper}
        totalPrice={totalPrice}
        data={data}
        items={items.data}
      />
    </>
  );
}
