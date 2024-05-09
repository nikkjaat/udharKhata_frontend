import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./util/ProtectedRoute";
import User from "./user/User";
import UserItems from "./user/UserItems";
const { googlePayClient } = window;

export default function App() {
  const baseCardPaymentMethod = {
    type: "CARD",
    parameters: {
      allowedCardNetworks: ["VISA", "MASTERCARD"],
      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
    },
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/useritems"
          element={
            <ProtectedRoute>
              <UserItems />
            </ProtectedRoute>
          }
        />
        <Route path="*" />
      </Routes>
    </BrowserRouter>
  );
}
