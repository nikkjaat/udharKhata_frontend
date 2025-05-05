import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <AlertContext.Provider
      value={{ alertMessage, alertType, isVisible, showAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
