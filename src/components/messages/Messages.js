"use client";

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Box, Typography, Avatar, Button } from "@mui/material";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";
import Loader from "@/utils/Loader";
import ChatsList from "./ChatsList";
import ProjectStatusChip from "../projects/ProjectStatusChip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Messages = ({
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
  fetchMessages,
  handleSend,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <Loader open={loading} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "unset",
            sm3: "minmax(390px, 1.6fr) 3.4fr",
          },
          maxHeight: { xs: "unset", sm3: "calc(100vh - 74px)" },
        }}
      >
        <ChatsList
          chats={chats}
          // fetchMessages={fetchMessages}
          fetchMessages={(projectId) => {
            fetchMessages(projectId);
          }}
          chatslistSX={{
            display: { xs: selectedChat ? "none" : "block", sm3: "block" },
          }}
        />

        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxHeight: "calc(100vh - 74px)",

            pt: { xs: 2, sm: 3, sm3: 4 },
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
                  paddingLeft: { xs: "16px", sm3: "24px" },
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{
                    display: { xs: "flex", sm3: "none" },
                    backgroundColor: "#3237401A",
                    "&:hover": {
                      backgroundColor: "rgba(50, 55, 64, 0.2)",
                    },
                    minWidth: "unset",
                    maxHeight: "43px",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    marginRight: "24px",
                  }}
                  onClick={() => {
                    setSelectedChat(null);
                  }}
                >
                  <ArrowBackIcon />
                </Button>

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
                    {selectedChat.projectId.user_id.username}
                    <span
                      style={{
                        width: "6px",
                        minWidth: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#323740",
                        marginBottom: "1px",
                      }}
                    ></span>
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
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                my: "auto",
                display: { xs: "none", sm3: "block" },
              }}
            >
              Select a chat to start messaging
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Messages;
