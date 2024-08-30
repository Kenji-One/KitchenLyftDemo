"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Tabs,
  Tab,
  Container,
  IconButton,
  Popover,
  MenuItem,
  Divider,
  Menu,
} from "@mui/material";

const Carousel = dynamic(() => import("react-slick"), { ssr: false });

import ProjectCard from "@/components/projects/ProjectCard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Projects from "@/components/projects/Projects";
import Orders from "@/components/orders/Orders";
import Messages from "@/components/messages/Messages";
import UserTable from "@/components/users/UserTable";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import GenerateQuoteForm from "@/components/qoutes/GenerateQuoteForm";
import ProjectDetails from "@/components/projects/ProjectDetails";
import Profile from "@/components/profile/Profile";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InventoryIcon from "@mui/icons-material/Inventory";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import Loader from "@/utils/Loader";
import EastIcon from "@mui/icons-material/East";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChatsList from "@/components/messages/ChatsList";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";

const Dashboard = ({ session2, ably }) => {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [thereIsClickForQoute, setThereIsClickForQoute] = useState(false);
  const [quote, setQuote] = useState(null);
  const [chat, setChat] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Listen for incoming messages and update unread messages count
  useEffect(() => {
    if (ably) {
      const channel = ably.channels.get("chat");

      // To track online users
      // const updateOnlineUsers = () => {
      //   console.log("updateOnlineUsers called");
      //   channel.presence.get((err, members) => {
      //     if (err) {
      //       console.error("Error fetching presence members:", err);
      //       return;
      //     }
      //     if (members.length === 0) {
      //       console.log("No members found in presence.");
      //     } else {
      //       console.log("membeeeeeeeers:", members);
      //     }
      //     // Update the onlineUserIds state with the clientIds of online users
      //     setOnlineUserIds(members.map((member) => member.clientId));
      //   });
      // };

      // /// Check for presence updates (when someone joins or leaves)
      // channel.presence.subscribe("enter", (presenceMessage) => {
      //   const { action, clientId } = presenceMessage;
      //   console.log("Presence update:", action, "from:", clientId);
      //   // Update the list of channel members when the presence set changes
      //   channel.presence.get((err, members) => {
      //     if (err) {
      //       return console.error(`Error retrieving presence data: ${err}`);
      //     }
      //     members.map((member) => {
      //       console.log("memberaaa:", member);
      //     });
      //   });
      //   updateOnlineUsers();
      // });
      // channel.presence.subscribe("leave", () => {
      //   console.log("A user left the channel"); // Check if this logs
      //   updateOnlineUsers();
      // });

      // // Initialize presence
      // updateOnlineUsers();

      const handleMessage = (message) => {
        const updatedChat = message.data;

        // Mark message as read by adding the user's ID to the readBy array
        if (
          selectedChatRef.current &&
          selectedChatRef.current._id === updatedChat._id
        ) {
          updatedChat.messages[updatedChat.messages.length - 1].readBy.push(
            session2.user.id
          );
        }

        setSelectedChat((prevChat) => {
          if (prevChat && prevChat._id === updatedChat._id) {
            return {
              ...prevChat,
              messages: [
                ...prevChat.messages,
                updatedChat.messages[updatedChat.messages.length - 1],
              ],
            };
          }
          return prevChat;
        });

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === updatedChat._id
              ? { ...chat, messages: updatedChat.messages }
              : chat
          )
        );

        chat &&
          setChat((chat) =>
            chat._id === updatedChat._id
              ? { ...chat, messages: updatedChat.messages }
              : chat
          );
      };

      const handleJoinProject = async () => {
        try {
          const res = await fetch("/api/unread-messages");
          if (res.ok) {
            const data = await res.json();
            // console.log("i was called:", data);
            setUnreadMessagesCount(data.unreadCount);
          } else {
            console.error("Failed to fetch unread messages count");
          }
        } catch (error) {
          console.error("Error fetching unread messages count:", error);
        }
      };

      channel.subscribe("new_message", handleMessage);
      channel.subscribe("join_project", handleJoinProject);

      channel.presence.enter();
      // Clean up the subscription when the component unmounts or when selectedChat changes
      return () => {
        channel.unsubscribe("new_message", handleMessage);
        channel.unsubscribe("join_project", handleJoinProject);
        // channel.presence.unsubscribe("enter", updateOnlineUsers);
        // channel.presence.unsubscribe("leave", updateOnlineUsers);
        channel.presence.leave();
      };
    }
  }, [ably, selectedChat]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => handleChange(null, 0)}>
        <IconButton color="inherit">
          <DashboardIcon />
        </IconButton>
        <p>Dashboard</p>
      </MenuItem>
      <MenuItem onClick={() => handleChange(null, 1)}>
        <IconButton color="inherit">
          <EventNoteIcon />
        </IconButton>
        <p>Projects</p>
      </MenuItem>
      <MenuItem onClick={() => handleChange(null, 2)}>
        <IconButton color="inherit">
          <InventoryIcon />
        </IconButton>
        <p>Orders</p>
      </MenuItem>
      <MenuItem onClick={() => handleChange(null, 3)}>
        <Box
          sx={{
            position: "relative",
            margin: "0 !important",
            display: "flex",
          }}
        >
          <IconButton color="inherit">
            <TextsmsIcon />
          </IconButton>
          {unreadMessagesCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                fontSize: "0.75rem",
              }}
            >
              {unreadMessagesCount >= 10 ? "9+" : unreadMessagesCount}
            </Box>
          )}
        </Box>
        <p>Messages</p>
      </MenuItem>
      {(session2.user.role === "CorporateAdmin" ||
        session2.user.role === "FranchiseAdmin") && (
        <MenuItem onClick={() => handleChange(null, 4)}>
          <IconButton color="inherit">
            <GroupIcon />
          </IconButton>
          <p>Users</p>
        </MenuItem>
      )}
    </Menu>
  );

  const handleChange = (event, newValue) => {
    selectedProject !== null && setSelectedProject(null);
    thereIsClickForQoute && setThereIsClickForQoute(false);
    setValue(newValue);
    mobileMoreAnchorEl && setMobileMoreAnchorEl(null);
  };
  const letsGenerateQuote = (event, newValue) => {
    setThereIsClickForQoute(true);
  };

  const handleAddProject = () => {
    router.push("/create-project");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    selectedProject !== null && setSelectedProject(null);
    setValue(5);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        const projects = await response.json();

        const projectQuotes = await Promise.all(
          projects.map(async (project) => {
            try {
              const response = await fetch(
                `/api/quotes?projectId=${project._id}`
              );
              const quote = await response.json();
              return { ...project, quote: quote.price };
            } catch (error) {
              console.error(
                `Failed to fetch quote for project ${project._id}`,
                error
              );
              return { ...project, quote: "N/A" }; // or handle as needed
            }
          })
        );
        setProjects(projectQuotes);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (
      session2.user.role === "CorporateAdmin" ||
      session2.user.role === "FranchiseAdmin"
    ) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/users");
          const data = await response.json();
          setUsers(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Failed to fetch users", error);
        }
      };
      fetchUsers();
    }
  }, [session2.user.role]);

  const handleProjectClick = async (projectId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?id=${projectId}`);
      const data = await response.json();
      setSelectedProject(data.project);
      setQuote(data.quote);
      setChat(data.chat); // Fetch and set the chat data
      setSelectedChat(data.chat);
      setValue(1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        `Failed to fetch project details for project ${projectId}`,
        error
      );
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmation = confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmation) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/project/${projectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Project deleted successfully.");
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId)
        );
        router.refresh();
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to delete the project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setLoading(true);

      await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user._id !== userId));
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error(`Failed to remove user ${userId}`, error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      setLoading(true);
      // console.log("newUser:", newUser);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setUsers([...users, data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to add new user", error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <EastIcon />,
    prevArrow: <KeyboardBackspaceIcon />,
    responsive: [
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const fetchMessages = async (projectId) => {
    setLoading(true);
    const response = await fetch(`/api/messages?projectId=${projectId}`);
    const data = await response.json();
    setValue(3);
    setSelectedChat(data);
    if (ably) {
      ably.channels.get("chat").publish("join_project", data.projectId);
    }
    setLoading(false);
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const res = await fetch("/api/unread-messages");
      if (res.ok) {
        const data = await res.json();
        console.log("Unread messages:", data.unreadCount);
        setUnreadMessagesCount(data.unreadCount);
      } else {
        console.error("Failed to fetch unread messages count");
      }
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  };

  const fetchChats = async () => {
    setLoading(true);
    const response = await fetch("/api/messages");
    const data = await response.json();
    setChats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUnreadMessagesCount();
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat && ably) {
      ably.channels
        .get("chat")
        .publish(
          "join_project",
          selectedChat.projectId?._id || selectedChat.projectId
        );
      return () => {
        ably.channels.get("chat").unsubscribe();
      };
    }
  }, [selectedChat, ably]);

  const handleSend = async (text) => {
    if (ably && selectedChat) {
      const channel = ably.channels.get("chat");

      try {
        // Subscribe to the presence set to receive updates
        // await channel.presence.subscribe((presenceMessage) => {
        //   const { action, clientId } = presenceMessage;
        //   console.log("Presence update:", action, "from:", clientId);

        //   // Update the list of channel members when the presence set changes
        //   channel.presence.get((err, members) => {
        //     if (err) {
        //       return console.error(`Error retrieving presence data: ${err}`);
        //     }
        //     members.map((member) => {
        //       console.log(member.clientId);
        //     });
        //   });
        // });
        // console.log("onlineUserIds shshshshs", onlineUserIds);

        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: selectedChat.projectId._id || selectedChat.projectId,
            text,
            senderId: session2.user.id,
          }),
        });

        if (response.ok) {
          const populatedChat = await response.json();

          // Retry logic if the channel is in a suspended state
          const publishMessage = async () => {
            try {
              await channel.publish("new_message", populatedChat);
              await channel.publish("join_project", selectedChat.projectId);
            } catch (error) {
              console.error("Error publishing message:", error);
              setTimeout(publishMessage, 2000); // Retry after 2 seconds
            }
          };

          publishMessage();
        } else {
          console.error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.error("Ably is not initialized or selectedChat is null");
    }
  };

  return (
    <>
      <Loader open={loading} />

      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          mb: value || selectedProject === 3 || value === 0 ? 0 : 2,
          boxShadow: "none",
          borderBottom: 1,
          borderColor: "#32374033",
          overflow: "hidden",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            gap: { xs: "8px", sm: "16px", md: "12px", lg: "32px" },
            px: { xs: "16px", sm3: "24px" },
            flexWrap: "nowrap",
          }}
        >
          <Button
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              display: { xs: "flex", md: "none" },
              backgroundColor: "#3237401A",
              "&:hover": {
                backgroundColor: "rgba(50, 55, 64, 0.2)",
              },
              minWidth: "unset",
              maxHeight: "43px",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
            }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "8px", sm: "16px", md: "24px", lg: "32px" },
              flex: { xs: "unset", md: "1 0 auto" },
            }}
          >
            <img
              src={"/logo 1.svg"}
              alt="Logo of the Company"
              className="kitchen-logo"
              // style={{ width: "auto", height: "34px" }}
            />
            <span
              className="MuiBoxBorderSpan"
              style={{
                height: "43px",
                width: "1px",
                backgroundColor: "#32374033",
              }}
            ></span>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="header scrollable tabs"
              sx={{
                "& .MuiTabs-scroller": {
                  maxWidth: { md: "300px", lg2: "916px" },
                },
                "& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary": {
                  padding: "24px 0",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                  flexShrink: 0,
                },
                "& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary, .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary > svg":
                  {
                    transition: "all 0.2s",
                  },
                "& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.Mui-selected, .Mui-selected > svg":
                  {
                    color: "#9A7F49",
                  },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#9A7F49",
                },
                "& .MuiTabs-flexContainer": {
                  gap: { xs: "4px", sm: "12px", md: "32px" },
                },
                display: { xs: "none", md: "flex" },
              }}
            >
              <Tab
                icon={
                  <DashboardIcon
                    sx={{ color: "#323740", margin: "0 !important" }}
                  />
                }
                label="Dashboard"
              />
              <Tab
                icon={
                  <EventNoteIcon
                    sx={{ color: "#323740", margin: "0 !important" }}
                  />
                }
                label="Projects"
              />
              <Tab
                icon={
                  <InventoryIcon
                    sx={{ color: "#323740", margin: "0 !important" }}
                  />
                }
                label="Orders"
              />
              <Tab
                sx={{ margin: "0 !important" }}
                icon={
                  <Box
                    sx={{
                      position: "relative",
                      margin: "0 !important",
                      display: "flex",
                    }}
                  >
                    <TextsmsIcon
                      sx={{ color: "#323740", margin: "0 !important" }}
                    />
                    {unreadMessagesCount > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "-7px",
                          right: "-8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      >
                        {unreadMessagesCount >= 10 ? "9+" : unreadMessagesCount}
                      </Box>
                    )}
                  </Box>
                }
                label="Messages"
              />

              {(session2.user.role === "CorporateAdmin" ||
                session2.user.role === "FranchiseAdmin") && (
                <Tab
                  icon={
                    <GroupIcon
                      sx={{ color: "#323740", margin: "0 !important" }}
                    />
                  }
                  label="Users"
                />
              )}
            </Tabs>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Button
              startIcon={<AddBoxIcon />}
              onClick={handleAddProject}
              sx={{
                bgcolor: "rgba(208, 180, 123, 0.2)",
                color: "#9A7F49",
                textTransform: "none",
                maxHeight: { xs: "43px", sm: "unset" },
                lineHeight: "19.2px",
                padding: { xs: "12px", sm: "12px 16px" },
                minWidth: "unset",
                marginRight: { xs: 1, sm: 2, lg: 3 },
                "&:hover": { bgcolor: "rgba(208, 180, 123, 0.4)" },
                "& .MuiButton-startIcon": {
                  // Ensures the icon is still displayed
                  marginRight: { xs: "0 !important", sm: "8px !important" }, // Remove margin right on small screens
                  marginLeft: { xs: "0 !important", sm: "-4px !important" }, // Remove margin right on small screens
                },
                // Responsive visibility for the button text
                "& span.MuiButtonText": {
                  fontSize: { xs: 0, sm: "16px" }, // Hide text on xs, show on sm and above
                  visibility: { xs: "hidden", sm: "visible" }, // Ensure text is not only reduced in size but also hidden
                },
              }}
            >
              <span className="MuiButtonText">Create Project</span>
            </Button>
            <Box
              sx={{
                borderRadius: "3px",
                border: 1,
                borderColor: "#32374033",
                padding: "4px",
                width: "43px",
                minWidth: "43px",
                height: "43px",
                cursor: "pointer",
              }}
              onClick={handleProfileClick}
            >
              <Avatar
                alt={session2.user.name}
                src={session2.user?.image || "/static/images/avatar/1.jpg"}
                sx={{
                  borderRadius: "3px",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Box>
        </Toolbar>
        {renderMobileMenu}
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          padding: value === 3 ? "0 !important" : "",
          paddingRight: selectedProject || value === 0 ? "0 !important" : "",
          paddingTop: selectedProject || value === 0 ? "0 !important" : "",
          paddingBottom: selectedProject || value === 0 ? "0 !important" : "",
          minHeight:
            selectedProject ||
            thereIsClickForQoute ||
            value !== 0 ||
            value !== 3
              ? "unset"
              : "calc(100vh - 74px) !important",
        }}
      >
        <Box
          sx={{
            minHeight:
              selectedProject || thereIsClickForQoute || value !== 0
                ? "unset"
                : "calc(100vh - 74px) !important",
          }}
        >
          {selectedProject ? (
            <>
              {!thereIsClickForQoute ? (
                <ProjectDetails
                  project={selectedProject}
                  quote={quote}
                  chat={chat}
                  setSelectedProject={setSelectedProject}
                  letsGenerateQuote={letsGenerateQuote}
                  handleSend={handleSend}
                  setLoading={setLoading}
                />
              ) : (
                <GenerateQuoteForm
                  selectedProject={selectedProject}
                  setThereIsClickForQoute={setThereIsClickForQoute}
                  handleProjectClick={handleProjectClick}
                />
              )}
            </>
          ) : (
            <>
              {value === 0 && (
                <Box
                  sx={{
                    minHeight:
                      selectedProject || thereIsClickForQoute || value !== 0
                        ? "unset"
                        : "calc(100vh - 72px) !important",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "unset",
                      sm2: "3.4fr minmax(390px, 1.6fr)",
                    },
                    gap: { xs: "16px", md: "24px", lg2: "38px" },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        paddingRight: "16px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          my: "32px",
                          fontSize: "24px",
                          textTransform: "uppercase",
                        }}
                      >
                        Welcome, {session2.user.name}
                      </Typography>
                      <Box
                        sx={{
                          display: { xs: "flex", sm2: "none" },
                          alignItems: "center",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onClick={() => handleChange(null, 3)} // This will switch to the Messages tab
                      >
                        <ForumIcon sx={{ color: "#323740" }} />
                        {unreadMessagesCount > 0 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "-7px",
                              right: "-8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              backgroundColor: "red",
                              color: "white",
                              fontSize: "0.75rem",
                            }}
                          >
                            {unreadMessagesCount >= 10
                              ? "9+"
                              : unreadMessagesCount}
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "24px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ mb: 2, textTransform: "uppercase" }}
                      >
                        Projects
                      </Typography>
                    </Box>

                    {projects.length > 0 ? (
                      <Carousel {...settings}>
                        {projects.map((project, index) => (
                          <ProjectCard
                            key={index}
                            project={project}
                            onClick={() => handleProjectClick(project._id)}
                          />
                        ))}
                      </Carousel>
                    ) : (
                      <Typography variant="h6">No projects</Typography>
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "600",
                        color: "#32374099",
                        marginTop: "auto",
                        marginBottom: { xs: "24px", sm: "44px" },
                      }}
                    >
                      2024 © Kitchen Lyft, All rights reserved
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      borderLeft: 1,
                      borderColor: "#32374033",
                      display: { xs: "none", sm2: "block" },
                    }}
                  >
                    <ChatsList
                      chats={chats}
                      fetchMessages={(projectId) => {
                        if (ably) {
                          fetchMessages(projectId);
                          ably.channels
                            .get("chat")
                            .publish("join_project", projectId);
                        } else {
                          console.error("Ably is not initialized");
                        }
                      }}
                      tabValue={0}
                    />
                  </Box>
                </Box>
              )}
              {value === 1 && (
                <Projects
                  projects={projects}
                  onProjectClick={handleProjectClick}
                  userRole={session2.user.role}
                  handleDeleteProject={handleDeleteProject}
                />
              )}
              {value === 2 && (
                <Box sx={{ mt: "16px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h2">Orders</Typography>
                  </Box>
                  {orders.length > 0 ? (
                    <Orders orders={orders} />
                  ) : (
                    <Typography sx={{ pt: 2 }}>No orders available</Typography>
                  )}
                </Box>
              )}
              {value === 3 && (
                <Messages
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  chats={chats}
                  setChats={setChats}
                  fetchMessages={fetchMessages}
                  handleSend={handleSend}
                />
              )}

              {value === 4 && (
                <UserTable
                  users={users}
                  handleRemoveUser={handleRemoveUser}
                  handleAddUser={handleAddUser}
                />
              )}
              {value === 5 && <Profile />}
            </>
          )}
        </Box>
      </Container>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          marginTop: "14px",
          "& .MuiPaper-elevation.MuiPaper-rounded": {
            borderRadius: "4px",
            boxShadow: "-1px 2px 5px 0px rgba(0,0,0,0.26)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <MenuItem
            sx={{
              minWidth: "110px",
              padding: "0.5em 1em",
              width: "100%",
              justifyContent: "left",
            }}
            onClick={handleProfile}
          >
            <PersonIcon sx={{ marginRight: "12px" }} />
            Profile
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem
            sx={{
              minWidth: "110px",
              padding: "0.5em 1em",
              width: "100%",
              justifyContent: "left",
            }}
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ marginRight: "12px" }} />
            Logout
          </MenuItem>
        </Box>
      </Popover>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session2 = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session2 || !session2.user.role) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session2 },
  };
};

export default Dashboard;
