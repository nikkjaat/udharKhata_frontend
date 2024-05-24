import React, { useContext, useEffect, useState } from "react";
import styles from "./UserItems.module.css";
import UserNavbar from "../components/user Navbar/UserNavbar";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import BottomNavbar from "../components/user Navbar/BottomNavbar";

export default function UserItems() {
  const [items, setItems] = useState([]);
  const [shopkeeper, setShopkeeper] = useState("");
  const [data, setData] = useState([]);
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
      setData(response.data.data);
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={styles.input}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-currency-rupee"
                    viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                  </svg>{" "}
                  {item.price}
                </div>
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
        data={data}
      />
    </>
  );
}
