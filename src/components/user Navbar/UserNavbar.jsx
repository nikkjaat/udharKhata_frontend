import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./UserNavbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserNavbar(props) {
  const [customers, setCustomers] = useState([]);
  const authCtx = useContext(AuthContext);

  const logoutHandler = () => {
    authCtx.logoutHandler();
  };

  const filterHandler = async (e) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/filtercustomer?filter=${
        e.target.value
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response.data);
    if (response.status === 200) {
      props.setCustomers(response.data);
    } else if (response.status === 201) {
      setCustomers([]);
    } else {
      setCustomers({ data: [{ name: "Not Found" }] });
    }
  };

  return (
    <div className={styles.container}>
      <nav className={`${styles.navbar} navbar justify-content-between`}>
        <a href="/user" className="navbar-brand">
          udhaarKhata
        </a>
        <form className="form-inline">
          <input
            autoComplete={false}
            onChange={filterHandler}
            className="mr-sm-2"
            type="search"
            id="input"
            placeholder="Search"
            aria-label="Search"
          />
          {/* <div className={styles.searchContainer}>
            <div className={styles.search_container}>
              <input
                autoComplete={false}
                onChange={filterHandler}
                id="input"
                placeholder="Search"
                aria-label="Search"
                className={styles.input}
                type="text"
              />
              <svg viewBox="0 0 24 24" className={styles.search__icon}>
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
            </div>
          </div> */}
        </form>
        {/* <div onClick={darkMode}>Dark</div> */}
        {authCtx.isLoggedIn ? (
          <Link>
            <FontAwesomeIcon
              title="logout"
              onClick={logoutHandler}
              icon={faRightFromBracket}
              color="white"
              cursor="pointer"
            />
          </Link>
        ) : (
          <Link to={"/login"}>
            <FontAwesomeIcon
              color="white"
              title="login"
              icon={faRightToBracket}
            />
          </Link>
        )}
      </nav>
    </div>
  );
}
