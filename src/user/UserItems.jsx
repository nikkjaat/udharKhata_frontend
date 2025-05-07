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
  const [searchTerm, setSearchTerm] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
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
      setFilteredItems(response.data.data || []); // Initialize filtered items with all items
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (items.data) {
      const filtered = items.data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  if (filteredItems) {
    filteredItems.forEach((item) => {
      totalPrice += item.price;
    });
  }

  const getShopkeeper = async () => {
    if (items.data && items.data.length > 0) {
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
    }
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReload = async () => {
    setIsRotating(true); // start rotation
    await getItems(); // fetch data
    setTimeout(() => setIsRotating(false), 1000); // remove animation after 1s
  };

  return (
    <>
      <UserNavbar />
      <div className={styles.header}>
        <h1>{data.name}</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className={styles.reloadBtn} onClick={handleReload}>
          <span className={isRotating ? styles.rotate : ""}>
            <FiRefreshCw />
          </span>
          <span style={{ marginLeft: "6px" }}>Reload</span>
        </button>
      </div>

      <div className={styles.container}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
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
          ))
        ) : (
          <div className={styles.noResults}>
            {searchTerm ? "No items match your search" : "No items found"}
          </div>
        )}
      </div>

      <BottomNavbar
        getItems={getItems}
        shopkeeper={shopkeeper}
        totalPrice={totalPrice}
        data={data}
        items={filteredItems} // Pass filtered items instead of all items
      />
    </>
  );
}
