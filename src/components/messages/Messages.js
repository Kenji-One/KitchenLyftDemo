"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";
import Loader from "@/utils/Loader";
import ChatsList from "./ChatsList";
import ProjectStatusChip from "../projects/ProjectStatusChip";

const Messages = ({ selectedChat, setSelectedChat, chats, setChats }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMessages = async (projectId) => {
    setLoading(true);
    const response = await fetch(`/api/messages?projectId=${projectId}`);
    const data = await response.json();
    setSelectedChat(data);
    setLoading(false);
  };

  const handleSend = async (text) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: selectedChat.projectId, text }),
    });

    if (response.ok) {
      const data = await response.json();
      setSelectedChat(data);

      // Update the corresponding chat in the chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === data._id ? { ...chat, messages: data.messages } : chat
        )
      );
    }
  };

  return (
    <>
      <Loader open={loading} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(390px, 1.6fr) 3.4fr",
          height: "100vh",
        }}
      >
        <ChatsList chats={chats} fetchMessages={fetchMessages} />

        <Box
          sx={{
            width: "100%",
            pt: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedChat ? (
            <>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "#32374033",
                  paddingBottom: "24px",
                  paddingLeft: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt={selectedChat.projectId.user_id.username}
                    src={selectedChat.projectId.user_id.image}
                    sx={{
                      borderRadius: "3px",
                      width: 48,
                      height: 48,
                      transform: "rotate(-4deg)",
                    }}
                  />
                  <Avatar
                    alt={selectedChat.projectId.title}
                    src={selectedChat.projectId?.images[0]}
                    sx={{
                      borderRadius: "4px",
                      width: 56,
                      height: 35,
                      transform: "rotate(4deg) translateX(-7px)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "800",
                      lineHeight: "19.2px",
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {selectedChat.projectId.user_id.username}{" "}
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#323740",
                        marginBottom: "1px",
                      }}
                    ></Box>
                    {selectedChat.projectId.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <ProjectStatusChip status={selectedChat.projectId.status} />
                  </Box>
                </Box>
              </Box>
              <MessageList messages={selectedChat.messages} />
              <MessageInput onSend={handleSend} />
            </>
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", my: "auto" }}>
              Select a chat to start messaging
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Messages;
