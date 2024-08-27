// components/messages/MessageList.js
import React, { useEffect, useRef } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { useSession } from "next-auth/react";

const MessageList = ({ messages }) => {
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: "calc(100vh - 264px)", // Set your desired max height
        overflowY: "auto", // Make it scrollable
      }}
    >
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            alignItems="flex-start"
            sx={{
              gap: "12px",
            }}
          >
            <Avatar
              alt={message.sender.username}
              src={message.sender.image}
              sx={{
                marginTop: "4px",
                borderRadius: "3px",
                width: "40px",
                height: "40px",
                minWidth: "40px",
              }}
            />
            <ListItemText
              sx={{ margin: 0 }}
              primary={
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "800",
                    textTransform: "capitalize",
                  }}
                >
                  {message.sender.username}
                  {session &&
                    session.user.name === message.sender.username &&
                    " (YOU)"}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    sx={{
                      display: "inline",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    sx={{ display: "block" }}
                    component="span"
                    variant="caption"
                    color="textSecondary"
                  >
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  );
};

export default MessageList;
