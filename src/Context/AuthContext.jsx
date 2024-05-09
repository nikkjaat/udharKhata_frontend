import { jwtDecode } from "jwt-decode";
import { createContext, useMemo, useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";

const AuthContext = createContext({
  token: "",
  userId: "",
  refresh: false,
  isLoggedIn: false,
  loginHandler: () => {},
  logoutHandler: () => {},
  refreshHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const [account, setAccount] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // const socket = io("http://localhost:4000");
  const socket = useRef();

  // useEffect(() => {
  //   socket.current = io("ws://localhost:9000");
  // }, []);

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  const loginHandler = (authToken) => {
    // console.log(authToken);
    localStorage.setItem("authToken", authToken);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  const token = useMemo(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
      return localStorage.getItem("authToken");
    }
  }, [isLoggedIn]);

  // console.log(token);

  const userId = useMemo(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(localStorage.getItem("authToken"));
      // console.log(decodedToken);
      return decodedToken.userId;
    }
  }, [isLoggedIn]);

  // console.log(userId);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginHandler,
        logoutHandler,
        token,
        userId,
        refreshHandler,
        refresh,
        account,
        setAccount,
        socket,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
