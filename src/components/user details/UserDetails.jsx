import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ShopkeeprDetails(props) {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editedCustomer, setEditedCustomer] = React.useState({
    ...props.customer,
  });

  const [otp, setOtp] = React.useState("");
  const [expectedOtp] = React.useState("123456"); // Simulated OTP
  const [numberEditable, setNumberEditable] = React.useState(false);
  const [showOTPField, setShowOTPField] = React.useState(false);
  const [verifyingNewNumber, setVerifyingNewNumber] = React.useState(false);
  const [originalNumber, setOriginalNumber] = React.useState("");
  const authCtx = React.useContext(AuthContext);

  const handleClickOpen = () => {
    setOpen(true);
    setEditMode(false);
    setNumberEditable(false);
    setShowOTPField(false);
    setOtp("");
    setVerifyingNewNumber(false);
    setEditedCustomer({ ...props.customer });
    setOriginalNumber(props.customer.number);
    props.getItems();
    props.getPaidAmount();
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    setEditedCustomer((prev) => {
      const updated = { ...prev, [field]: newValue };

      if (field === "number") {
        if (numberEditable && newValue !== originalNumber) {
          setVerifyingNewNumber(true);
          setShowOTPField(false);
          setOtp("");
        }
      }

      return updated;
    });
  };

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleSendOTP = async () => {
    try {
      const isNewNumber = verifyingNewNumber;

      const url = !isNewNumber
        ? `${import.meta.env.VITE_BACKEND_URL}/admin/changenumber?number=${
            editedCustomer.number
          }`
        : `${import.meta.env.VITE_BACKEND_URL}/admin/getotp?number=${
            editedCustomer.number
          }`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (response.status === 200) {
        setShowOTPField(true);
        alert(
          `"Twilio is Inactive in India." Use this OTP: ${response.data.otp}`
        );
      }
    } catch (error) {
      console.error("OTP sending failed:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (editMode) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/verifyotp?number`,
          {
            number: editedCustomer.number,
            otp: otp,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        console.log(response);
        // Assuming OTP verification is successful
        if (response.status === 200) {
          setNumberEditable(true);
          setVerifyingNewNumber(false);
          // setShowOTPField(false);
          alert("OTP verified successfully!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSave = async () => {
    // if (verifyingNewNumber) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/updatecustomer?customerId=${
          editedCustomer._id
        }`,
        {
          name: editedCustomer.name,
          number: editedCustomer.number,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        setEditMode(false);
        authCtx.refreshHandler();
        props.setAlert(true);
        props.setAlertType("success");
        props.setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
    // } else {
    //   setEditMode(false);
    // }

    setNumberEditable(false);
    setShowOTPField(false);
    setOtp("");
  };

  const renderAmountField = (label, value, color) => (
    <Box sx={BoxStyle}>
      <Typography sx={TypographyStyle}>{label}</Typography>
      <Typography sx={TypographyStyle}>
        <b style={{ color, display: "flex", alignItems: "center" }}>
          <RupeeIcon /> {value}
        </b>
      </Typography>
    </Box>
  );

  return (
    <>
      <div
        style={{
          all: "unset",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          width: "100%",
          display: "flex",
        }}
        className="flex items-center justify-center"
        onClick={handleClickOpen}
      >
        Profile
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* Name */}
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Shopkeeper Name :</Typography>
              <Box sx={FixedInputStyle}>
                {editMode ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editedCustomer.name}
                    onChange={handleChange("name")}
                  />
                ) : (
                  <Typography>
                    <b>{props.customer.name}</b>
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Number */}
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Mobile Number :</Typography>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={FixedInputStyle}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={editedCustomer.number}
                      onChange={handleChange("number")}
                      disabled={!numberEditable}
                    />
                  ) : (
                    <Typography>
                      <b>{props.customer.number}</b>
                    </Typography>
                  )}
                </Box>

                {editMode && !numberEditable && !showOTPField && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1, width: "fit-content" }}
                    onClick={handleSendOTP}
                  >
                    Verify
                  </Button>
                )}

                {editMode && showOTPField && !numberEditable && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <TextField
                      label="Enter OTP"
                      variant="outlined"
                      size="small"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleVerifyOTP}>
                      Submit
                    </Button>
                  </Box>
                )}

                {editMode &&
                  numberEditable &&
                  verifyingNewNumber &&
                  !showOTPField && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, width: "fit-content" }}
                      onClick={handleSendOTP}
                    >
                      Get OTP
                    </Button>
                  )}

                {editMode &&
                  numberEditable &&
                  verifyingNewNumber &&
                  showOTPField && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        label="Enter OTP"
                        variant="outlined"
                        size="small"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <Button variant="contained" onClick={handleVerifyOTP}>
                        Verify
                      </Button>
                    </Box>
                  )}
              </Box>
            </Box>

            {/* Amounts */}
            {renderAmountField(
              "Total Amount :",
              props.customer.totalAmount,
              "red"
            )}
            {renderAmountField(
              "Paid Amount :",
              props.customer.paidAmount,
              "green"
            )}
            {renderAmountField(
              "Due Amount :",
              props.customer.totalAmount - props.customer.paidAmount,
              "blue"
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {editMode ? (
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="contained" onClick={handleUpdateClick}>
              Update
            </Button>
          )}
          <Button variant="contained" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const RupeeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={{ marginRight: "4px" }}
  >
    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
  </svg>
);

const BoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "1em",
  marginTop: "1em",
};

const TypographyStyle = {
  flex: 1,
  minWidth: "10em",
  paddingTop: "8px",
};

const FixedInputStyle = {
  flex: 1,
  minHeight: 40,
  display: "flex",
  alignItems: "center",
};
