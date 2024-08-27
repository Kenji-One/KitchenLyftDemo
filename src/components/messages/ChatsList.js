"use client";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import ProjectStatusChip from "../projects/ProjectStatusChip";
const ChatsList = ({ chats, fetchMessages, tabValue, chatslistSX }) => {
  return (
    <Box
      sx={{
        borderRight: tabValue !== 0 ? 1 : "none",
        borderColor: "divider",
        height: "100%",
        maxHeight: { xs: "unset", sm3: "calc(100vh - 74px)" }, // Set your desired max height
        overflowY: "auto", // Make it scrollabl
        ...chatslistSX,
      }}
    >
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
      {!chats || chats.length === 0 ? (
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
                  src={chat.projectId?.images[0]}
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
                    {chat.projectId.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography>
                      {chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].text.length >
                          44
                          ? chat.messages[chat.messages.length - 1].text.slice(
                              0,
                              44
                            ) + "..."
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
                      <ProjectStatusChip status={chat.projectId.status} />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatsList;
