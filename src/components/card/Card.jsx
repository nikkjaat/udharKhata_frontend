import React, { useContext, useEffect, useState } from "react";
import styles from "./Card.module.css";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  faSquareWhatsapp,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card(props) {
  //   console.log(props.customers);
  const authCtx = useContext(AuthContext);
  const [myProduct, setMyProduct] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState();
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

  let totalPrice = 0;

  useEffect(() => {
    if (props.customers) {
      const userId = props.customers._id;
      const getMyProduct = async () => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/getmyproducts?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        setMyProduct(response.data.data);
      };
      getMyProduct();
    }
  }, [props.customers]);

  // console.log(myProduct);
  myProduct.forEach((product) => {
    // console.log(product);
    totalPrice += product.price;
  });

  // console.log(totalPrice);

  const getItemDetails = async (userId) => {
    sessionStorage.setItem("userId", userId);
    const res = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/user/readnotification?userId=${userId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    if (res.status === 200) {
      authCtx.refreshHandler();
      navigate("/useritems");
    }
  };

  const handleLinkClick = (event) => {
    event.stopPropagation(); // Stop the propagation of the click event
  };

  // console.log(number);

  useEffect(() => {
    const checkNewNotification = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/checknotification?number=${
          props.customers._id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response.data.data.notification);
      setNotification(response.data.data.notification);
    };
    checkNewNotification();
  }, [props.customers]);

  // console.log(props.customers._id);

  useEffect(() => {
    const getAdmin = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/getshopkeeper?adminId=${
          props.customers.userId
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
        setWhatsappNumber(response.data.data.number);
      }
    };
    getAdmin();
  }, [props.customers]);

  return (
    <div
      onClick={() => {
        getItemDetails(props.customers._id);
      }}
      className={styles.card}>
      {notification && <div className={styles.notificationDot}></div>}

      <div className={styles.card_info}>
        <div className={styles.card_avatar}></div>
        <div className={styles.card_title}>
          {props.customers.shopkeeperName}
        </div>
        <div className="card-subtitle">Total Item - {myProduct.length}</div>
        <div className="card-subtitle">Due Amount - Rs. {totalPrice}</div>
      </div>
      <ul className={styles.card_social}>
        <li className={styles.card_social__item}>
          <Link>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 9h3l-.375 3H14v9h-3.89v-9H8V9h2.11V6.984c0-1.312.327-2.304.984-2.976C11.75 3.336 12.844 3 14.375 3H17v3h-1.594c-.594 0-.976.094-1.148.281-.172.188-.258.5-.258.938V9z"></path>
            </svg>
          </Link>
        </li>
        <li className={styles.card_social__item}>
          <Link
            onClick={handleLinkClick}
            target="blank"
            to={`https://wa.me/+91${whatsappNumber}`}>
            {" "}
            {/* <FontAwesomeIcon color="black" icon={faWhatsapp} /> */}
            {/* <FontAwesomeIcon icon={faSquareWhatsapp} /> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M92.1 254.6c0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6L152 365.2l4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8c0-35.2-15.2-68.3-40.1-93.2c-25-25-58-38.7-93.2-38.7c-72.7 0-131.8 59.1-131.9 131.8zM274.8 330c-12.6 1.9-22.4 .9-47.5-9.9c-36.8-15.9-61.8-51.5-66.9-58.7c-.4-.6-.7-.9-.8-1.1c-2-2.6-16.2-21.5-16.2-41c0-18.4 9-27.9 13.2-32.3c.3-.3 .5-.5 .7-.8c3.6-4 7.9-5 10.6-5c2.6 0 5.3 0 7.6 .1c.3 0 .5 0 .8 0c2.3 0 5.2 0 8.1 6.8c1.2 2.9 3 7.3 4.9 11.8c3.3 8 6.7 16.3 7.3 17.6c1 2 1.7 4.3 .3 6.9c-3.4 6.8-6.9 10.4-9.3 13c-3.1 3.2-4.5 4.7-2.3 8.6c15.3 26.3 30.6 35.4 53.9 47.1c4 2 6.3 1.7 8.6-1c2.3-2.6 9.9-11.6 12.5-15.5c2.6-4 5.3-3.3 8.9-2s23.1 10.9 27.1 12.9c.8 .4 1.5 .7 2.1 1c2.8 1.4 4.7 2.3 5.5 3.6c.9 1.9 .9 9.9-2.4 19.1c-3.3 9.3-19.1 17.7-26.7 18.8zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM148.1 393.9L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5c29.9 30 47.9 69.8 47.9 112.2c0 87.4-72.7 158.5-160.1 158.5c-26.6 0-52.7-6.7-75.8-19.3z" />
            </svg>
          </Link>
        </li>
        <li className={styles.card_social__item}>
          <Link>
            {" "}
            {/* <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.547 3c.406 0 .75.133 1.031.398.281.266.422.602.422 1.008v15.047c0 .406-.14.766-.422 1.078a1.335 1.335 0 0 1-1.031.469h-15c-.406 0-.766-.156-1.078-.469C3.156 20.22 3 19.86 3 19.453V4.406c0-.406.148-.742.445-1.008C3.742 3.133 4.11 3 4.547 3h15zM8.578 18V9.984H6V18h2.578zM7.36 8.766c.407 0 .743-.133 1.008-.399a1.31 1.31 0 0 0 .399-.96c0-.407-.125-.743-.375-1.009C8.14 6.133 7.813 6 7.406 6c-.406 0-.742.133-1.008.398C6.133 6.664 6 7 6 7.406c0 .375.125.696.375.961.25.266.578.399.984.399zM18 18v-4.688c0-1.156-.273-2.03-.82-2.624-.547-.594-1.258-.891-2.133-.891-.938 0-1.719.437-2.344 1.312V9.984h-2.578V18h2.578v-4.547c0-.312.031-.531.094-.656.25-.625.687-.938 1.312-.938.875 0 1.313.578 1.313 1.735V18H18z"></path>
            </svg> */}
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.875 7.5v.563c0 3.28-1.18 6.257-3.54 8.93C14.978 19.663 11.845 21 7.938 21c-2.5 0-4.812-.687-6.937-2.063.5.063.86.094 1.078.094 2.094 0 3.969-.656 5.625-1.968a4.563 4.563 0 0 1-2.625-.915 4.294 4.294 0 0 1-1.594-2.226c.375.062.657.094.844.094.313 0 .719-.063 1.219-.188-1.031-.219-1.899-.742-2.602-1.57a4.32 4.32 0 0 1-1.054-2.883c.687.328 1.375.516 2.062.516C2.61 9.016 1.938 7.75 1.938 6.094c0-.782.203-1.531.609-2.25 2.406 2.969 5.515 4.547 9.328 4.734-.063-.219-.094-.562-.094-1.031 0-1.281.438-2.36 1.313-3.234C13.969 3.437 15.047 3 16.328 3s2.375.484 3.281 1.453c.938-.156 1.907-.531 2.907-1.125-.313 1.094-.985 1.938-2.016 2.531.969-.093 1.844-.328 2.625-.703-.563.875-1.312 1.656-2.25 2.344z"></path>
            </svg>
          </Link>
        </li>
      </ul>
    </div>
  );
}
