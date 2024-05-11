import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./BottomNavbar.module.css";
import Button from "../Button/Button";
import Chat from "../chat/Chat";

export default function BottomNavbar(props) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total price by summing up the prices of all products
    if (props.products.length != []) {
      const totalPrice = props.products.products.reduce(
        (acc, product) => acc + product.price,
        0
      );
      setTotalPrice(totalPrice);
    }
  }, [props.products]);

  return (
    <>
      <div className={styles.container}>
        <button>{totalPrice}</button>
        <div>{/* <Chat /> */}</div>
        <div>
          <button onClick={props.onClick}>Add Item</button>
        </div>
      </div>
    </>
  );
}
