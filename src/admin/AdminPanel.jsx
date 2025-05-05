// CardComponent.jsx
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import styles from "./AdminPanel.module.css";
import { useNavigate } from "react-router-dom";
import { use } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import AddCustomer from "./AddCustomer";

const AdminPanel = ({ theme = "light" }) => {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const getUserData = async (id) => {
    navigate(`/admin/dashboard?id=${id}`);
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getadmincustomers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(res.data.data);
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const getItems = async () => {
    const userId = sessionStorage.getItem("userId");

    try {
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
        const items = response.data.data;
        const total = items.reduce((acc, item) => acc + item.price, 0);
        setItems(items);
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteCustomer = async (e, id, number) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the card
    e.preventDefault(); // Prevent the default action of the button
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deletecustomer`,
        {
          data: {
            id: id,
            number: number,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        getCustomer(); // Refresh the customer list after deletion
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: "4rem",
          right: "0.5em",
          // background: "red",
          width: "18rem",
        }}
      >
        <AddCustomer getCustomer={getCustomer} />
      </div>
      <div style={{ padding: "7rem 0 0.5em" }}>
        {users.map((user) => {
          return (
            <div
              onClick={() => {
                getUserData(user.customerId._id);
              }}
              className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg shadow-md w-full max-w-md ${styles.card}`}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className={`flex items-center ${styles.container}`}
              >
                <img
                  src="https://res.cloudinary.com/dbexuvouv/image/upload/v1742488691/FoodHub/b90d2cea-0e28-4522-83f6-3fe7a5c79fd9-1742488688328.jpg.jpg"
                  alt="chair"
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className={styles.cardContent}>
                  <h3 className="font-semibold text-lg">
                    {user.customerId.name}
                  </h3>
                  <p className="text-sm mt-1">{user.customerId.number}</p>
                </div>
              </div>
              <div className={`${styles.cardActions}`}>
                <button
                  className={`rounded-md ${
                    isDark
                      ? "bg-white text-gray-800 hover:bg-gray-200"
                      : "bg-gray-400 text-white hover:bg-gray-500"
                  }`}
                >
                  ₹ {user.customerId.totalAmount - user.customerId.paidAmount}{" "}
                  Due
                </button>
                <button
                  onClick={(e) => {
                    deleteCustomer(
                      e,
                      user.customerId._id,
                      user.customerId.number
                    );
                  }}
                  className={`rounded-md ${
                    isDark
                      ? "bg-white text-gray-800 hover:bg-gray-200"
                      : "bg-gray-400 text-white hover:bg-gray-500"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AdminPanel;
