import React from "react";
import styles from "./Button.module.css";

export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className={`${!props.className ? styles.btn_17 : styles.btn_18} btn_17`}>
      <span className={`${styles.text_container} text_container`}>
        <span className={`${styles.text} text`}>{props.children}</span>
      </span>
    </button>
  );
}
