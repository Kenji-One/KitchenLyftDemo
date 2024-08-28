// components/messages/MessageInput.js
import React, { useState } from "react";
import { Box, TextareaAutosize, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        // mt: "auto",
        borderTop: 1,
        width: "100%",
        borderColor: "#3237401A",
        py: "16px",
        paddingRight: { xs: "16px", sm2: "24px" },
        paddingBottom: { xs: "0", md: "16px" },

        backgroundColor: "white", // Ensure the background color matches the container's background
        zIndex: 1,
      }}
    >
      <TextareaAutosize
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write here..."
        minRows={1}
        className="messagesTextArea"
        style={{
          width: "100%",
          resize: "none",
          border: "none",
          outline: "none",
          padding: "8px 0 0 24px",
          fontSize: "16px",
          color: "#32374099",
          backgroundColor: "transparent",
        }}
      />
      <Button
        startIcon={<SendIcon sx={{ m: "0", color: "#323740" }} />}
        type="submit"
        variant="contained"
        sx={{
          ml: 2,
          width: "48px",
          minWidth: "48px",
          height: "48px",
          p: "0",
          borderRadius: 0,
          backgroundColor: "rgba(50, 55, 64, 0.102)",
          "& .MuiButton-icon": { margin: 0 },
          "&:hover": { backgroundColor: "rgba(50, 55, 64, 0.2)" },
        }}
        disabled={!text}
      ></Button>
    </Box>
  );
};

export default MessageInput;
