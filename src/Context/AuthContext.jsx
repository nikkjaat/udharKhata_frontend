import { jwtDecode } from "jwt-decode";
import { createContext, useMemo, useState, useRef } from "react";

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

  const socket = useRef();

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  const loginHandler = (authToken) => {
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

  const userId = useMemo(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(localStorage.getItem("authToken"));
      return decodedToken.userId;
    }
  }, [isLoggedIn]);

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
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
