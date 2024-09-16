import connectDB from "@/utils/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import mongoose from "mongoose";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        const { projectId } = req.query;
        if (projectId) {
          const chat = await Chat.findOne({ projectId }).populate(
            "messages.sender",
            "username image"
          );
          if (chat) {
            const project = await Project.findById(projectId).populate(
              "user_id",
              "username image"
            );
            chat.projectId = project;
            // Mark messages as read if they haven't been read by the current user
            chat.messages.forEach((message) => {
              if (!message.readBy.includes(session.user.id)) {
                message.readBy.push(session.user.id);
              }
            });
            await chat.save(); // Save the chat document with updated read statuses
          }
          return res.status(200).json(chat);
        } else {
          let projectQuery = {};

          // Adjust projectQuery based on user role
          if (session.user.role.startsWith("Corporate")) {
            // CorporateAdmin can access all projects
            projectQuery = {};
          } else if (session.user.role === "FranchiseAdmin") {
            // FranchiseAdmin should see projects created by themselves and their FranchiseUsers
            const franchiseUsers = await User.find({
              createdBy: session.user.id,
            }).select("_id");
            const franchiseUserIds = franchiseUsers.map((user) => user._id);
            projectQuery = {
              user_id: { $in: [session.user.id, ...franchiseUserIds] },
            };
          } else if (session.user.role === "FranchiseUser") {
            const currentUser = await User.findById(session.user.id).select(
              "createdBy"
            );
            const createdByAdmin = currentUser.createdBy;
            projectQuery = {
              user_id: { $in: [session.user.id, createdByAdmin] },
            };
          } else {
            // Default to only showing the user's own projects for other roles
            projectQuery = { user_id: session.user.id };
          }

          // Find projects based on projectQuery
          const projects = await Project.find(projectQuery).select("_id");
          const projectIds = projects.map((project) => project._id);

          const chats = await Chat.find({ projectId: { $in: projectIds } })
            .populate({
              path: "projectId",
              populate: {
                path: "user_id",
                select: "username image",
              },
            })
            .populate("messages.sender", "username image");

          // Add unread messages count
          const chatsWithUnread = chats.map((chat) => {
            const unreadMessages = chat.messages.filter(
              (msg) => !msg.readBy.includes(session.user.id)
            ).length;
            return {
              ...chat.toObject(), // Convert document to plain object
              unreadCount: unreadMessages,
            };
          });

          return res.status(200).json(chatsWithUnread);
        }
      } catch (error) {
        console.error("MongoDB operation failed", error);
        res.status(500).json({
          message: "Error fetching messages",
          error: error.message || error.toString(),
        });
      }
      break;
    case "POST":
      try {
        const { projectId, text, senderId } = req.body;
        const chat = await Chat.findOne({ projectId });
        if (!chat) {
          return res.status(404).json({ message: "Chat not found" });
        }
        const newMessage = {
          sender: senderId,
          text,
          readBy: [senderId],
        };
        chat.messages.push(newMessage);
        await chat.save();

        // Populate the chat object after saving the message
        const populatedChat = await Chat.findOne({ projectId })
          .populate({
            path: "projectId",
            populate: {
              path: "user_id",
              select: "username image",
            },
          })
          .populate("messages.sender", "username image");

        res.status(201).json(populatedChat);
      } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
