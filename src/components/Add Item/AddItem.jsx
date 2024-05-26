import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import AuthContext from "../../Context/AuthContext";

export default function AddItem(props) {
  //   const [open,setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState(null);
  const authCtx = React.useContext(AuthContext);

  //   console.log(props.productId);

  const editHandler = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/admin/getsingleproduct?productId=${
        props.productId
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response);
    setName(response.data.product.name);
    setPrice(response.data.product.price);
  };

  React.useEffect(() => {
    if (props.productId) {
      editHandler();
    }
  }, [props.productId]);

  // Open the dialog
  const handleClickOpen = () => {
    props.setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    props.setOpen(false);
    setName("");
    setPrice("");
    props.setProductId("");
  };

  // Handle input changes
  const inputHandler = (event, value) => {
    if (event === "name") {
      setName(value);
    } else {
      setPrice(value);
    }
  };

  //

  const unreadNotifications = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/unreadnotification?userId=${
        props.customerData._id
      }`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    console.log(response);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (props.productId === "") {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/addproduct`,
          {
            name,
            price,
            userId: props.customerData._id,
          },
          {
            headers: {
              "Content-Type": "application/json", // Correct content type for FormData
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );

        if (response.status === 200) {
          authCtx.refreshHandler();
          unreadNotifications();
          handleClose();
        }
      } else {
        // Handle the case where productId is not empty
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/admin/updateproduct?productId=${
            props.productId
          }`,
          {
            name,
            price,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.status === 200) {
          authCtx.refreshHandler();
          handleClose();
          unreadNotifications();
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  return (
    <React.Fragment>
      <Button sx={{ background: "black" }} variant="" onClick={handleClickOpen}>
        Add Item
      </Button>
      <Dialog
        open={props.open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}>
        <DialogTitle>
          <b>Add Item</b>
        </DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => inputHandler("name", e.target.value)}
            value={name}
            autoFocus
            required
            margin="dense"
            id="name"
            name="itemName"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={(e) => inputHandler("price", e.target.value)}
            value={price}
            required
            margin="dense"
            id="price"
            name="itemPrice"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
