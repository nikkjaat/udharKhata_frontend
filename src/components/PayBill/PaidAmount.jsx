import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Box, Divider } from "@mui/material";
import MenuOnClick from "../Menu/MenuOnClick";
// import MenuOnClick from "../Menu/MenuOnClick";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PaidAmount(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    props.getPaidAmount();
    props.getItems();
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          background: `${props.customer ? "rgb(0, 0, 0, .2)" : "black"}`,
          color: "white",
        }}
        variant=""
        onClick={handleClickOpen}>
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
        <b>{props.price}</b>
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center" }}
          id="customized-dialog-title">
          {props.customer ? "Amount paid by you" : "Amount paid by customer"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          {/* <CloseIcon /> */}
        </IconButton>
        <DialogContent dividers>
          {props.paidData.length > 0 ? (
            props.paidData.map((data) => {
              const formattedDate = moment(data.updatedAt).format("DD/MM/YYYY");
              return (
                <>
                  <Box
                    // onContextMenu={handleRightClick}
                    sx={BoxStyle}
                    gutterBottom>
                    <Typography sx={TypographyStyle}>
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
                      &nbsp;
                      {data.amount}
                    </Typography>{" "}
                    <Typography sx={TypographyStyle}>{data.paidBy}</Typography>
                    <Typography sx={TypographyStyle}>
                      {" "}
                      {formattedDate}
                    </Typography>
                    {!props.customer && (
                      <Typography>
                        <MenuOnClick
                          admin={props.admin}
                          getPaidAmount={props.getPaidAmount}
                          setId={props.setId}
                          id={data._id}
                          open={props.open}
                          setOpen={props.setOpen}
                        />
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                </>
              );
            })
          ) : (
            <>
              <Box
                // onContextMenu={handleRightClick}
                sx={BoxStyle}
                gutterBottom>
                <Typography sx={TypographyStyle}>
                  <b>No amount paid by you</b>
                </Typography>{" "}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

const BoxStyle = {
  display: "flex",
  alignItems: "center",
  height: "3em",
};

const TypographyStyle = {
  flexGrow: 1,
  minWidth: "6em",
  display: "flex",
  alignItems: "center",
};
