import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { TextField } from "@mui/material";

import axios from "axios";
import AuthContext from "../../Context/AuthContext";
import CustomContext from "../../Context/CustomContext";
import { useAlert } from "../../Context/AlertContext";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function PayBill({
  userId,
  getPaidAmount,
  setOpen,
  open,
  id,
  setId,
  getCustomer,
}) {
  // const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(null);
  const [paidBy, setPaidBy] = React.useState("");
  // const [userId, setUserId] = React.useState(id);
  const authCtx = React.useContext(AuthContext);
  const customCtx = React.useContext(CustomContext);

  const { showAlert } = useAlert();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount("");
    setPaidBy("");
    setId("");
  };

  const handleChange = (event, value) => {
    if (event === "amount") {
      setAmount(value);
    } else {
      setPaidBy(value);
    }
  };

  const getAmountById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/getpaidamountbyid?id=${id}`
      );
      if (response.status === 200) {
        setAmount(response.data.amount);
        0;
        setPaidBy(response.data.paidBy);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response);
        } else {
          console.log(error.response);
        }
      }
    }
  };

  React.useEffect(() => {
    if (id) {
      getAmountById();
    }
  }, [id]);

  const handleSubmit = async () => {
    const finalPaidBy = paidBy && paidBy.trim() !== "" ? paidBy : "Cash"; // <<-- 👈 magic here

    if (!id) {
      // POST request
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/paidamount`,
          {
            amount,
            paidBy: finalPaidBy, // <<-- using finalPaidBy
            customerId: userId,
            adminId: authCtx.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.status === 200) {
          handleClose();
          getPaidAmount();
          customCtx.getItems();
          customCtx.getPaidAmount();
          getCustomer();
          showAlert(response.data.message, "success");
        }
      } catch (error) {
        console.log(error.response);
        showAlert(error.message, "error");
      }
    } else {
      // PUT request (update)
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/updatepaidamount?id=${id}`,
          {
            amount,
            paidBy: finalPaidBy, // <<-- using finalPaidBy
            customerId: userId,
            adminId: authCtx.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.status === 200) {
          handleClose();
          setId("");
          getPaidAmount();
          customCtx.getItems();
          customCtx.getPaidAmount();
          getCustomer();
          showAlert(response.data.message, "success");
        }
      } catch (error) {
        console.log(error.response);
        showAlert(error.message, "error");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <React.Fragment>
      <Button
        disableRipple
        disableElevation
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          m: 0,
          p: 0,
          textTransform: "none",
          fontSize: 14,
          width: "100%",
          backgroundColor: "transparent",
          color: "inherit",
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
        onClick={handleClickOpen}
      >
        Pay &nbsp; <i className="bi bi-wallet2"></i>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <b>Pay Bill</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Paid Amount"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => {
                handleChange("amount", e.target.value);
              }}
              value={amount}
              onKeyDown={handleKeyDown}
            />
            <TextField
              required
              margin="dense"
              id="paidBy"
              name="paidBy"
              label="Paid by ( e.g - cash , gpay , phonepe , paytm )"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                handleChange("paidBy", e.target.value);
              }}
              value={paidBy}
              onKeyDown={handleKeyDown}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
