import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useAlert } from "../../Context/AlertContext";

const Error = () => {
  const { isVisible, alertMessage, alertType } = useAlert();

  return (
    <Stack
      sx={{
        width: "100%",
        zIndex: "1500",
        position: "fixed",
        top: isVisible ? "0" : "-100px", // animate in from top
        left: "50%",
        transform: "translateX(-50%)",
        opacity: isVisible ? 1 : 0, // animate fade
        transition: "all 0.5s ease", // smooth transition
        pointerEvents: "none", // click-through
      }}
      spacing={2}
    >
      <Alert
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          boxShadow: 3,
          borderRadius: 2,
          width: "fit-content", // optional: fit to text
          minWidth: "100%", // optional: consistent size
          mx: "auto",
        }}
        severity={alertType}
      >
        {alertMessage}
      </Alert>
    </Stack>
  );
};

export default Error;
