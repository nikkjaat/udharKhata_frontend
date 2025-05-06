import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ShopkeeprDetails(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    props.getItems();
    props.getPaidAmount();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          background: "rgb(0, 0, 0, .2)",
          color: "black",
        }}
        variant=""
        onClick={handleClickOpen}>
        <b>{props.shopkeeperName}</b>
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Shopkeeper Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Shopkeeper Name : </Typography>
              <Typography sx={TypographyStyle}>
                <b>{props.shopkeeperName}</b>
              </Typography>
            </Box>
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Mobile Number : </Typography>
              <Typography sx={TypographyStyle}>
                <b>{props.number}</b>
              </Typography>
            </Box>
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Total Amount : </Typography>
              <Typography sx={TypographyStyle}>
                <b
                  style={{
                    color: "red",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-currency-rupee"
                    viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                  </svg>{" "}
                  {props.totalAmount}
                </b>
              </Typography>
            </Box>
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Paid Amount : </Typography>
              <Typography sx={TypographyStyle}>
                <b
                  style={{
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-currency-rupee"
                    viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                  </svg>{" "}
                  {props.paidAmount}
                </b>
              </Typography>
            </Box>
            <Box sx={BoxStyle}>
              <Typography sx={TypographyStyle}>Due Amount : </Typography>
              <Typography sx={TypographyStyle}>
                <b
                  style={{
                    color: "blue",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-currency-rupee"
                    viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                  </svg>{" "}
                  {props.totalAmount - props.paidAmount}
                </b>
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const BoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1em",
  marginTop: "1em",
};

const TypographyStyle = {
  flex: 1,
  minWidth: "10em",
};
