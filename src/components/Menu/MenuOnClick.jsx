import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import CustomContext from "../../Context/CustomContext";
import AuthContext from "../../Context/AuthContext";
import Error from "../Error/Error";
import { useAlert } from "../../Context/AlertContext";

export default function MenuOnClick(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isHolding, setIsHolding] = React.useState(false);
  const holdTimeout = React.useRef(null);
  const open = Boolean(anchorEl);
  const customCtx = React.useContext(CustomContext);
  const authCtx = React.useContext(AuthContext);
  // const [alert, setAlert] = React.useState(false);
  // const [alertMessage, setAlertMessage] = React.useState("");
  // const [alertType, setAlertType] = React.useState("success");
  const { showAlert } = useAlert();

  const handleClick = (event) => {
    // Do nothing or handle left-click if needed
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const holdLeftMouse = (event) => {
    // event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      // Check if the left mouse button is pressed
      const currentTarget = event.currentTarget; // Capture the currentTarget
      holdTimeout.current = setTimeout(() => {
        setIsHolding(true);
        holdLeftMouse({ ...event, currentTarget });
      }, 500); // Adjust hold duration as needed
    }
  };

  const handleMouseUp = (event) => {
    if (event.button === 0) {
      // Check if the left mouse button is released
      clearTimeout(holdTimeout.current);
      if (isHolding) {
        // Perform any action needed when the mouse is held down long enough
        console.log("Mouse held down long enough");
        setIsHolding(false);
      }
    }
  };

  const openPayBill = () => {
    props.setPayBill(true);
    props.setPaidAmountId(props.id);
    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deletepaidamount?id=${id}`,
        {
          data: {
            adminId: authCtx.userId,
            customerId: props.userId,
          },
        }
      );
      if (response.status === 200) {
        props.getPaidAmount();
        customCtx.getPaidAmount();
        customCtx.getItems();
        handleClose();
        props.getCustomer();
        showAlert(response.data.message, "success");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          showAlert(error.response.data, "error");
        }
      }
    }
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <Button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onContextMenu={handleRightClick} // Prevent default context menu
          sx={{
            minWidth: "22em",
            minHeight: "2.8em",
            position: "absolute",
            backgroundColor: "rgb(0,0,0,.0)",
            top: "-1.4em",
            left: "-21.3em",
          }}
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {/* <MoreVertIcon /> */}
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem
            sx={{ padding: "0", margin: "0 1em" }}
            onClick={openPayBill}
          >
            <Button sx={{ minWidth: "100%" }} variant="contained">
              Edit
            </Button>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(props.id);
            }}
          >
            {" "}
            <Button sx={{ minWidth: "100%" }} variant="contained" color="error">
              Delete
            </Button>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}
