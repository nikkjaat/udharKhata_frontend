import * as React from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputBase, styled, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cached, Send } from "@mui/icons-material";
import AuthContext from "../../Context/AuthContext";
import { faCircleDot } from "@fortawesome/free-solid-svg-icons";


// import { makeStyles } from "@mui/";

const SendButton = styled(Button)`
  &:focus {
    outline: none;
  }
`;

export default function Chat(props) {
  const authCtx = React.useContext(AuthContext);
  const scrollRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [refreshing, setRefreshing] = React.useState(false);

  const scrollbarToBotttom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  // console.log(props.message);
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
    props.readMessage();
    props.getMessage();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendText = async (e) => {
    if (e.key === "Enter") {
      const data = await props.sendText();
      // console.log(data);
      if (data) {
        props.getMessage();
      }
    }
  };

  React.useEffect(() => {
    scrollbarToBotttom();
  }, [props.message]);

  const handleSend = async () => {
    if (props.value.length > 0) {
      // scrollbarToBotttom();
      const data = await props.sendText();
      if (data) {
        props.getMessage();
      }
    }
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleRefreshClick = () => {
    setRefreshing(true); // Start the rotation animation
    props.readMessage();
    props.getMessage();
    setTimeout(() => {
      setRefreshing(false); // Stop the rotation animation after 400ms
    }, 300);
  };

  return (
    <React.Fragment>
      <div sx={{ position: "relative" }} onClick={handleClickOpen("paper")}>
        {props.newMessage && (
          <FontAwesomeIcon
            className={props.className}
            color="red"
            width={"9px"}
            icon={faCircleDot}
          />
        )}
        {/* <FontAwesomeIcon width={".7em"} icon={faRocketchat} /> */}
        Message
      </div>

      <Dialog
        id="container"
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle id="scroll-dialog-title">Chat</DialogTitle>
          <Cached
            onClick={handleRefreshClick}
            id="refresh"
            titleAccess="Refresh"
            sx={{
              marginRight: "1em",
              cursor: "pointer",
              transition: "transform .4s ease",
              transform: refreshing ? "rotate(360deg)" : "none",
            }}
          />
        </Box>
        <DialogContent
          ref={scrollRef}
          style={{
            maxWidth: "50%em",
            height: "30em",
          }}
          dividers={scroll === "paper"}
        >
          {props.message.map((message) => {
            return (
              <>
                {message.senderId === authCtx.userId ? (
                  <DialogContentText
                    style={{
                      width: "fit-content",
                      background: "var(---mainColor)",
                      color: "white",
                      padding: ".2em .7em",
                      borderRadius: "5px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      margin: ".8em 0 .8em auto",
                    }}
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                  >
                    {message.text}
                  </DialogContentText>
                ) : (
                  <DialogContentText
                    style={{
                      width: "fit-content",
                      color: "black",
                      padding: ".2em .7em",
                      background: "var(---lightCardColor)",
                      borderRadius: "5px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      margin: ".8em 0",
                    }}
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                  >
                    {message.text}
                  </DialogContentText>
                )}
              </>
            );
          })}
        </DialogContent>
        <DialogActions style={{ background: "var(---mainColor)" }}>
          <InputBase
            onKeyDown={(e) => {
              sendText(e);
            }}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
            style={{
              color: "var(---textColor)",
              width: "100%",
              background: "transparent",
              boxShadow:
                "inset 3px 3px 9px -5px rgba(0, 0, 0, 0.4),inset 2px 2px 5px -4px rgba(0, 0, 0, 0.4), 2px 3px 5px -4px rgba(0, 0, 0, 0.6)",
              borderRadius: "1em",
              padding: ".2em 1em",
            }}
            value={props.value}
            placeholder="Type a message"
          />
          <SendButton
            sx={{ border: "none" }}
            title="Send"
            style={{ color: "white" }}
            onClick={handleSend}
          >
            <Send />
          </SendButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
