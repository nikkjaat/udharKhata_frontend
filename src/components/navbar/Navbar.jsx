import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar(props) {
  const [customers, setCustomers] = useState([]);
  const authCtx = useContext(AuthContext);
  const inputRef = useRef(null);

  const input = inputRef.current;
  useEffect(() => {
    // Function to handle click events outside the input field and customers list
    const handleClickOutside = (event) => {
      if (
        input &&
        !input.contains(event.target) &&
        event.target.id !== "input"
      ) {
        setCustomers([]);
      }
    };

    // Add click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [customers]);

  const logoutHandler = () => {
    authCtx.logoutHandler();
  };

  const filterHandler = async (e) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/admin/filtercustomer?filter=${
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
      setCustomers(response.data);
    } else if (response.status === 201) {
      setCustomers([]);
    } else {
      setCustomers({ data: [{ name: "Not Found" }] });
    }
  };

  const userHandler = (id) => {
    props.userHandler(id);
    input.value = "";
    setCustomers([]);
  };

  const darkMode = () => {
    document.documentElement.style.setProperty("---lightBodyColor", "#212121");
    document.documentElement.style.setProperty("---lightCardColor", "#212121");
    document.documentElement.style.setProperty(
      "---boxShadow",
      "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)"
    );
  };

  return (
    <div className={styles.container}>
      <nav className={`${styles.navbar} navbar justify-content-between`}>
        <a href="/" className="navbar-brand">
          udhaarKhata
        </a>
        <form className="form-inline">
          <input
            autoComplete={false}
            ref={inputRef}
            onChange={filterHandler}
            className="mr-sm-2"
            type="search"
            id="input"
            placeholder="Search"
            aria-label="Search"
          />
          {customers.data && (
            <div>
              {customers.data.map((customer) => {
                return (
                  <div
                    onClick={() => {
                      userHandler(customer._id);
                    }}
                    key={customer._id}>
                    {customer.name}
                  </div>
                );
              })}
            </div>
          )}
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
