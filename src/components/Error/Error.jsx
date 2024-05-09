import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import styles from "./Error.module.css";

const Error = ({ alert, alertMessage, setAlert, alertType }) => {
  // const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    if (alert) {
      // Hide the alert after 2 seconds
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  }, [alert]);

  return (
    <Stack
      sx={{ width: "100%", zIndex: "1500", position: "fixed", top: "0" }}
      spacing={2}>
      {alert && (
        <Alert
          className={styles.alert + " " + (alert ? styles.show : "")}
          severity={alertType}>
          {alertMessage}
        </Alert>
      )}
    </Stack>
  );
};

export default Error;
