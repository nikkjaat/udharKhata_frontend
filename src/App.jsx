import React, { useContext } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./util/ProtectedRoute";
import User from "./user/User";
import UserItems from "./user/UserItems";
import AdminPanel from "./admin/AdminPanel";
import AdminDashboard from "./admin/AdminDashboard";
import AuthContext from "./Context/AuthContext";

export default function App() {
  const authCtx = useContext(AuthContext);

  console.log(authCtx.isAdmin);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {authCtx.isAdmin ? <AdminPanel /> : <User />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
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
