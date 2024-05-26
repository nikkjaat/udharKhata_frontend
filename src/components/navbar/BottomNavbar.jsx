import React, { useContext, useEffect, useState } from "react";
import styles from "./BottomNavbar.module.css";
import PayBill from "../PayBill/PayBill";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";
import PaidAmount from "../PayBill/PaidAmount";
import AddItem from "../Add Item/AddItem";

export default function BottomNavbar(props) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidData, setPaidData] = useState([]);
  const [admin, setAdmin] = useState(true);

  //handle pay bill dialog box
  const [open, setOpen] = React.useState(false);

  //get id from PaidAmount for updating
  const [id, setId] = useState("");

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
        setPaidData(response.data);
        let price = 0;
        response.data.forEach((item) => {
          price += item.amount;
          setPaidAmount(price);
        });
      } else if (response.status === 204) {
        setPaidData([]);
        setPaidAmount(0);
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
        <button style={{ padding: 0, background: "transparent" }}>
          <PaidAmount
            open={open}
            setOpen={setOpen}
            paidData={paidData}
            price={totalPrice - paidAmount}
            setId={setId}
            getPaidAmount={getPaidAmount}
          />
        </button>
        <div>
          <PayBill
            id={id}
            setId={setId}
            open={open}
            setOpen={setOpen}
            getPaidAmount={getPaidAmount}
            userId={props.userId}
          />
        </div>
        <div>
          <button
            style={{ padding: 0, background: "transparent" }}
            // onClick={props.onClick}
          >
            <AddItem
              admin={admin}
              productId={props.productId}
              setProductId={props.setProductId}
              setOpen={props.setOpen}
              open={props.open}
              customerData={props.customerData}
            />
          </button>
        </div>
      </div>
    </>
  );
}
