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

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function PayBill({ userId, getPaidAmount, customerData }) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(null);
  const [paidBy, setPaidBy] = React.useState("");
  // const [userId, setUserId] = React.useState(id);
  const authCtx = React.useContext(AuthContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, value) => {
    if (event === "amount") {
      setAmount(value);
    } else {
      setPaidBy(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/paidamount`,
        {
          amount,
          paidBy,
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
        // console.log(response.data);

        handleClose();
        getPaidAmount();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log(error.response);
        }
      }
    }
  };

  return (
    <React.Fragment>
      <Button
        sx={{ background: "black", color: "white" }}
        variant="outlined"
        onClick={handleClickOpen}>
        Pay &nbsp; <i class="bi bi-wallet2"></i>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Pay
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
            />
            <TextField
              autoFocus
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
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Pay</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
