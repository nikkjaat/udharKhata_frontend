import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import RazorPay from "./RazorPay";

export default function ConfirmAmountModal({
  open,
  onClose,
  onConfirm,
  maxAmount,
  shopkeeperName,
  number,
  data,
  getItems,
  getPaidAmount,
}) {
  const [amount, setAmount] = useState("");

  // console.log(shopkeeperName, number, data, getItems, getPaidAmount);

  const handleConfirm = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > maxAmount) {
      alert(`Enter a valid amount between 1 and ₹${maxAmount}`);
      return;
    }
    onConfirm(num); // Immediately triggers Razorpay
    setAmount("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Amount to Pay</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Amount (₹)"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>
          <RazorPay
            shopkeeperName={shopkeeperName}
            amount={amount}
            number={number}
            data={data}
            getItems={getItems}
            getPaidAmount={getPaidAmount}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
