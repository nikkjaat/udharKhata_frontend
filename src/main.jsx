import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import { CustomContextProvider } from "./Context/CustomContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <CustomContextProvider>
      <App />
    </CustomContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
