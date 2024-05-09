import React, { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  const authCtx = useContext(AuthContext);
  if (!authCtx.isLoggedIn) {
    return <Navigate to={"/login"}></Navigate>;
  }
  return props.children;
}
