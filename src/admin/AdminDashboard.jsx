import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navbar from "../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import AddItem from "../components/Add Item/AddItem";
import PayBill from "../components/PayBill/PayBill";
import PaidAmount from "../components/PayBill/PaidAmount";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Chat from "../components/chat/Chat";
import styles from "./AdminDashboard.module.css";
import { useAlert } from "../Context/AlertContext";
import UserDetails from "../components/user details/UserDetails";
import { fontGrid } from "@mui/material/styles/cssUtils";
import Error from "../components/Error/Error";

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const authCtx = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [productId, setProductId] = useState("");
  const [paidData, setPaidData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [paidAmountId, setPaidAmountId] = useState("");
  const [payBill, setPayBill] = useState(false);
  const [message, setMessage] = useState([]);
  const [value, setValue] = useState("");
  const [newMessage, setNewMessage] = useState(false);
  const [ring, setRing] = useState(false);
  const { showAlert } = useAlert();

  const [summary, setSummary] = useState([
    { label: "Total Items", value: 0 },
    { label: "Total Amount", value: 0 },
    { label: "Paid Amount", value: 0 },
    { label: "Due Amount", value: 0 },
  ]);

  useEffect(() => {
    setSummary((prevSummary) =>
      prevSummary.map((item) =>
        item.label === "Total Items" ? { ...item, value: items.length } : item
      )
    );
  }, [items]);

  useEffect(() => {
    getUserData();
  }, [authCtx.refresh]);

  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/getitemsdetails?userId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (res.status === 200) {
        // console.log(res);
        setItems(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [authCtx.refresh]);

  const getPaidAmount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getpaidamount?customerId=${
          customer._id
        }&adminId=${authCtx.userId}`
      );
      // console.log(response);
      if (response.status === 200) {
        setPaidData(response.data);
        let price = 0;
        response.data.forEach((item) => {
          price += item.amount;
        });
      } else if (response.status === 204) {
        setPaidData([]);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
        } else {
          console.log(error.response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    getPaidAmount();
  }, [authCtx.refresh, customer]);

  const getCustomer = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/getsinglecustomer?userId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (res.status === 200) {
        // console.log(res.data);
        setCustomer(res.data.data);
        setSummary((prevSummary) =>
          prevSummary.map((item) =>
            item.label === "Total Amount"
              ? { ...item, value: `₹ ${res.data.data.totalAmount}` }
              : item.label === "Paid Amount"
              ? { ...item, value: res.data.data.paidAmount } // just the raw amount
              : item.label === "Due Amount"
              ? {
                  ...item,
                  value: `₹ ${
                    res.data.data.totalAmount - res.data.data.paidAmount
                  }`,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const deleteHandler = async (productId) => {
    console.log(productId);
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/admin/deleteproduct?productId=${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        setProductId("");
        showAlert(response.data.message, "success");
        authCtx.refreshHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const readMessage = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/message/readmessage`,
      {
        senderId: authCtx.userId,
        receiverId: customer.number,
        admin: true,
      }
    );
    // console.log(response);
    if (response.status === 200) {
      getNewMessage();
    }
  };

  const getMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/get?conversationId=${
        authCtx.userId + "?" + customer.number
      }`
    );
    // console.log(response);
    if (response.status === 200) {
      setMessage(response.data);
    } else if (response.status === 404) {
      setMessage([]);
    }
  };

  React.useEffect(() => {
    getMessage();
  }, [customer.number]);

  const sendText = async () => {
    let message = {
      senderId: authCtx.userId,
      receiverId: customer.number,
      text: value,
      conversationId: authCtx.userId + "?" + customer.number,
      admin: true,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/message/send`,
      {
        message,
      }
    );
    if (response.status === 200) {
      setValue("");
      return response;
    }
  };

  const getNewMessage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/message/newmessage?userId=${
        customer.userId
      }&number=${customer.number}`
    );
    setNewMessage(response.data.newShopkeeperMessage);
  };
  useEffect(() => {
    getNewMessage();
  }, [customer._id]);

  const remindForPayment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/reminderforpayment`,
        {
          customerId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if(response.status === 200) {
        showAlert(response.data.message, "success");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        height="100vh"
        bgcolor="#f5f5f5"
        paddingTop={isMobile ? 6 : 6.2}
      >
        {/* Sidebar */}
        <Box
          width={isMobile ? "100%" : 240}
          bgcolor="white"
          p={2}
          boxShadow={2}
          sx={{ flexShrink: 0 }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Admin Panel
          </Typography>
          <List>
            {[
              "Dashboard",
              <AddItem
                productId={productId}
                customerData={customer}
                setProductId={setProductId}
              />,
              <PayBill
                open={payBill}
                setOpen={setPayBill}
                id={paidAmountId}
                setId={setPaidAmountId}
                getPaidAmount={getPaidAmount}
                userId={id}
                getCustomer={getCustomer}
              />,
              <Chat
                readMessage={readMessage}
                getMessage={getMessage}
                message={message}
                value={value}
                setValue={setValue}
                sendText={sendText}
                newMessage={newMessage}
              />,
              "Reminder",
              <UserDetails customer={customer} />,
            ].map((text, index) => (
              <ListItem key={index} disablePadding>
                {text === "Reminder" ? (
                  <ListItemText
                    onClick={() => {
                      setRing(true); // New state to start ringing
                      setTimeout(() => setRing(false), 1000); // Stop after 1 second
                    }}
                    primary={
                      <Box
                        onClick={remindForPayment}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        Reminder
                        <NotificationsActiveIcon
                          className={ring ? `${styles.ringing}` : ""}
                          style={{ color: "orange" }}
                        />
                      </Box>
                    }
                    sx={{
                      pl: 0,
                      color: "gray",
                      cursor: "pointer",
                      margin: "0.7em 1em",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={text}
                    sx={{
                      pl: 0,
                      color: text === "Dashboard" ? "black" : "gray",
                      cursor: "pointer",
                      margin: "0.7em 1em",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          flex={1}
          p={isMobile ? 2 : 4}
          sx={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Goods Borrowing
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={2} mb={4}>
              {summary.map((item, index) => (
                <Grid
                  sx={{ cursor: "pointer" }}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                >
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {item.label === "Paid Amount" ? (
                        <PaidAmount
                          buttonSx={{
                            background: "transparent",
                            color: "black",
                            fontSize: ".9em",
                            padding: 0,
                            margin: 0,
                            minWidth: "auto",
                            lineHeight: 1,
                            display: "inline-flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                            "&:focus": {
                              backgroundColor: "transparent",
                            },
                            "&:active": {
                              backgroundColor: "transparent",
                            },
                          }}
                          price={item.value}
                          paidData={paidData}
                          getPaidAmount={getPaidAmount}
                          open={open}
                          setOpen={setOpen}
                          setPaidAmountId={setPaidAmountId}
                          setPayBill={setPayBill}
                          getCustomer={getCustomer}
                          userId={id}
                        />
                      ) : (
                        item.value
                      )}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Borrowed Items Table */}
          <Typography variant="h6" gutterBottom>
            Borrowed Items
          </Typography>
          <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell align="start" style={{ width: "20%" }}>
                    Item
                  </TableCell>
                  <TableCell align="start" style={{ width: "20%" }}>
                    Price
                  </TableCell>
                  <TableCell align="start" style={{ width: "20%" }}>
                    Date
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "10%" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .slice()
                  .reverse()
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="start">{row.name}</TableCell>
                      <TableCell align="start">{row.price}</TableCell>
                      <TableCell align="start">
                        {formatDate(row.date)}
                      </TableCell>

                      <TableCell
                        sx={{ display: "flex", gap: "1em" }}
                        align="center"
                      >
                        <button
                          onClick={() => {
                            setProductId(row._id);
                          }}
                          style={{ background: "var(---mainColor)" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteHandler(row._id);
                          }}
                          style={{ background: "#a80d1a" }}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
