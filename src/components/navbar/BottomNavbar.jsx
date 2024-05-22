import React, { useContext, useEffect, useState } from "react";
import styles from "./BottomNavbar.module.css";
import PayBill from "../PayBill/PayBill";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";

export default function BottomNavbar(props) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const authCtx = useContext(AuthContext);

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

  const getPaidAmount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getpaidamount?customerId=${
          props.userId
        }&adminId=${authCtx.userId}`
      );
      // console.log(response);
      if (response.status === 200) {
        let price = 0;
        response.data.forEach((item) => {
          price += item.amount;
          setPaidAmount(price);
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    getPaidAmount();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-currency-rupee"
            viewBox="0 0 16 16">
            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
          </svg>{" "}
          {totalPrice - paidAmount}
        </button>
        <div>
          <PayBill getPaidAmount={getPaidAmount} userId={props.userId} />
        </div>
        <div>
          <button onClick={props.onClick}>Add Item</button>
        </div>
      </div>
    </>
  );
}
