import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { CustomContextProvider } from "./Context/CustomContext.jsx";
import { AlertProvider } from "./Context/AlertContext.jsx";
import Error from "./components/Error/Error.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <CustomContextProvider>
      <AlertProvider>
        <Error />
        <App />
      </AlertProvider>
    </CustomContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
