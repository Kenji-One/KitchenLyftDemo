"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Carousel = dynamic(() => import("react-slick"), { ssr: false });
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
} from "@mui/material";
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
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import Loader from "@/utils/Loader";
import EastIcon from "@mui/icons-material/East";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChatsList from "@/components/messages/ChatsList";

const Dashboard = ({ session2 }) => {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [thereIsClickForQoute, setThereIsClickForQoute] = useState(false);
  const [quote, setQuote] = useState(null);
  const [chat, setChat] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChange = (event, newValue) => {
    selectedProject !== null && setSelectedProject(null);
    thereIsClickForQoute && setThereIsClickForQoute(false);
    setValue(newValue);
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

  useEffect(() => {
    if (session2.user.role === "CorporateAdmin") {
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
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
    setLoading(false);
  };

  const fetchChats = async () => {
    setLoading(true);
    const response = await fetch("/api/messages");
    const data = await response.json();
    setChats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

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
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", gap: "32px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <img
              src={"/logo 1.svg"}
              alt="Logo of the Company"
              className="kitchen-logo"
            />
            <span
              style={{
                height: "43px",
                width: "1px",
                backgroundColor: "#32374033",
              }}
            ></span>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="header tabs"
              sx={{
                "& .MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary": {
                  padding: "24px 0",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
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
                  gap: "32px",
                },
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
                icon={
                  <TextsmsIcon
                    sx={{ color: "#323740", margin: "0 !important" }}
                  />
                }
                label="Messages"
              />

              {session2.user.role === "CorporateAdmin" && (
                <Tab
                  icon={
                    <GroupIcon
                      sx={{ color: "#323740", margin: "0 !important" }}
                    />
                  }
                  label="Corporate Users"
                />
              )}
            </Tabs>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<AddBoxIcon />}
              onClick={handleAddProject}
              sx={{
                bgcolor: "rgba(208, 180, 123, 0.2)",
                color: "#9A7F49",
                textTransform: "none",
                lineHeight: "19.2px",
                padding: "12px 16px",
                mx: 3,
                "&:hover": { bgcolor: "rgba(208, 180, 123, 0.4)" },
              }}
            >
              Create Project
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
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          padding: value === 3 ? "0 !important" : "",
          paddingRight: selectedProject || value === 0 ? "0 !important" : "",
          paddingTop: selectedProject || value === 0 ? "0 !important" : "",
          paddingBottom: selectedProject || value === 0 ? "0 !important" : "",
          height:
            selectedProject || thereIsClickForQoute || value !== 0
              ? "unset"
              : "calc(100vh - 72px) !important",
        }}
      >
        <Box sx={{ height: "100%" }}>
          {selectedProject ? (
            <>
              {!thereIsClickForQoute ? (
                <ProjectDetails
                  project={selectedProject}
                  quote={quote}
                  chat={chat}
                  setSelectedProject={setSelectedProject}
                  letsGenerateQuote={letsGenerateQuote}
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
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "3.4fr minmax(390px, 1.6fr)",
                    gap: "54px",
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

                    <Carousel {...settings}>
                      {projects.map((project, index) => (
                        <ProjectCard
                          key={index}
                          project={project}
                          onClick={() => handleProjectClick(project._id)}
                        />
                      ))}
                    </Carousel>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "600",
                        color: "#32374099",
                        marginTop: "auto",
                        marginBottom: "44px",
                      }}
                    >
                      2024 © Kitchen Lyft, All rights reserved
                    </Typography>
                  </Box>
                  <Box sx={{ borderLeft: 1, borderColor: "#32374033" }}>
                    <ChatsList
                      chats={chats}
                      fetchMessages={fetchMessages}
                      tabValue={0}
                    />
                  </Box>
                </Box>
              )}
              {value === 1 && (
                <Projects
                  projects={projects}
                  onProjectClick={handleProjectClick}
                />
              )}
              {value === 2 && <Orders />}
              {value === 3 && (
                <Messages
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  chats={chats}
                  setChats={setChats}
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
