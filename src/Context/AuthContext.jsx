import { jwtDecode } from "jwt-decode";
import { createContext, useMemo, useState, useRef } from "react";

const AuthContext = createContext({
  token: "",
  userId: "",
  isAdmin: false,
  refresh: false,
  isLoggedIn: false,
  loginHandler: () => {},
  logoutHandler: () => {},
  refreshHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const [account, setAccount] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const socket = useRef();

  const refreshHandler = () => {
    setRefresh(!refresh);
  };

  const loginHandler = (authToken, isAdmin) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("isAdmin", isAdmin.toString()); // Store as string
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const token = useMemo(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setIsLoggedIn(true);
      // Check both JWT and localStorage for consistency
      const adminStatus =
        decodedToken.admin || localStorage.getItem("isAdmin") === "true";
      setIsAdmin(adminStatus);
      return storedToken;
    }
    return null;
  }, [isLoggedIn, refresh]);

  const userId = useMemo(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      return decodedToken.userId;
    }
    return null;
  }, [isLoggedIn, refresh]);

  console.log(isAdmin);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
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
