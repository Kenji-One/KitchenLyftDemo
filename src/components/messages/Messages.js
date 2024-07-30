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

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchChats = async () => {
    setLoading(true);
    const response = await fetch("/api/messages");
    const data = await response.json();
    // console.log("chatData:", data);
    setChats(data);
    setLoading(false);
  };

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

  useEffect(() => {
    fetchChats();
  }, []);

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
        <Box sx={{ borderRight: 1, borderColor: "divider" }}>
          <Typography
            variant="h5"
            sx={{
              paddingLeft: "16px",
              textTransform: "uppercase",
              marginTop: "32px",
              marginBottom: "4px",
            }}
          >
            Messages
          </Typography>
          {chats.length === 0 ? (
            <Typography sx={{ p: 2 }}>No chats available</Typography>
          ) : (
            <List>
              {chats.map((chat) => (
                <ListItem
                  button
                  key={chat._id}
                  onClick={() => fetchMessages(chat.projectId._id)}
                  sx={{
                    gap: "10px",
                    "&:hover": { backgroundColor: "#A5BD7A33" },
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
                      alt={chat.projectId.user_id.username}
                      src={chat.projectId.user_id.image}
                      sx={{
                        borderRadius: "3px",
                        width: 48,
                        height: 48,
                        transform: "rotate(-4deg)",
                      }}
                    />
                    <Avatar
                      alt={chat.projectId.title}
                      src={chat.projectId.image}
                      sx={{
                        borderRadius: "4px",
                        width: 56,
                        height: 35,
                        transform: "rotate(4deg) translateX(-7px)",
                      }}
                    />
                  </Box>
                  <ListItemText
                    primary={
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
                          marginBottom: "6px",
                        }}
                      >
                        {chat.projectId.user_id.username}{" "}
                        <Box
                          sx={{
                            width: "6px",
                            minWidth: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#323740",
                            marginBottom: "1px",
                          }}
                        ></Box>
                        {chat.projectId.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography>
                          {chat.messages.length > 0
                            ? chat.messages[chat.messages.length - 1].text
                                .length > 44
                              ? chat.messages[
                                  chat.messages.length - 1
                                ].text.slice(0, 44) + "..."
                              : chat.messages[chat.messages.length - 1].text
                            : "no messages yet"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mt: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            label={chat.projectId.overallStatus.status}
                            sx={{
                              height: "unset",
                              backgroundColor:
                                chat.projectId.overallStatus.bgColor,
                              color: chat.projectId.overallStatus.textColor,
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                              textTransform: "uppercase",
                              "& .MuiChip-label.MuiChip-labelMedium": {
                                padding: "4px 8px",
                              },
                            }}
                          />
                          <Chip
                            label={chat.projectId.franchiseStatus.status}
                            sx={{
                              height: "unset",
                              backgroundColor:
                                chat.projectId.franchiseStatus.bgColor,
                              color: chat.projectId.franchiseStatus.textColor,
                              fontSize: "12px",
                              fontWeight: "500",
                              textTransform: "uppercase",
                              borderRadius: "4px",
                              "& .MuiChip-label.MuiChip-labelMedium": {
                                padding: "4px 8px",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
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
                    src={selectedChat.projectId.image}
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
                    <Chip
                      label={selectedChat.projectId.overallStatus.status}
                      sx={{
                        height: "unset",
                        backgroundColor:
                          selectedChat.projectId.overallStatus.bgColor,
                        color: selectedChat.projectId.overallStatus.textColor,
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        "& .MuiChip-label.MuiChip-labelMedium": {
                          padding: "4px 8px",
                        },
                      }}
                    />
                    <Chip
                      label={selectedChat.projectId.franchiseStatus.status}
                      sx={{
                        height: "unset",
                        backgroundColor:
                          selectedChat.projectId.franchiseStatus.bgColor,
                        color: selectedChat.projectId.franchiseStatus.textColor,
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        borderRadius: "4px",
                        "& .MuiChip-label.MuiChip-labelMedium": {
                          padding: "4px 8px",
                        },
                      }}
                    />
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
