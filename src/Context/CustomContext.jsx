import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const CustomContext = createContext({
  getItems: () => {},
  getPaidAmount: () => {},
});

export const CustomContextProvider = (props) => {
  const authCtx = useContext(AuthContext);
  const [totalAmout, setTotalAmount] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [items, setItems] = useState([]);
  const [deleteButton, setDeleteButton] = useState(false);

  const userId = localStorage.getItem("userId");
  let totalPrice = 0;

  const getItems = async () => {
    const userId = localStorage.getItem("userId");
    //   console.log(userId);
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
    console.log(response);
    if (response.status === 200) {
      setItems(response.data);
    }
  };

  useEffect(() => {
    getItems();
  }, [userId]);

  if (items.data) {
    items.data.forEach((item) => {
      totalPrice += item.price;
    });
  }

  const getPaidAmount = async () => {
    const userId = localStorage.getItem("userId");
    const adminId = authCtx.userId;
    console.log(userId, adminId);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/getpaidamount?customerId=${userId}&adminId=${adminId}`
      );
      console.log(response);
      if (response.status === 200) {
        let price = 0;
        response.data.forEach((item) => {
          price += item.amount;
          setPaidAmount(price);
        });
      }
      if (response.status === 204) {
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
  }, [userId]);

  console.log(totalPrice, paidAmount);
  useEffect(() => {
    if (totalPrice === paidAmount) {
      setDeleteButton(true);
    } else {
      setDeleteButton(false);
    }
  }, [totalPrice, paidAmount]);

  return (
    <CustomContext.Provider value={{ deleteButton, getItems, getPaidAmount }}>
      {props.children}
    </CustomContext.Provider>
  );
};

export default CustomContext;
