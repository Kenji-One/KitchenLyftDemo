import connectDB from "@/utils/db";
import Chat from "@/models/Chat";
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
          // Adjust the query to correctly find chats associated with the user
          const query = session.user.role.startsWith("Corporate")
            ? {}
            : {
                projectId: {
                  $in: await Project.find({ user_id: session.user.id }).select(
                    "_id"
                  ),
                },
              };

          // console.log("Query used:", query);

          const chats = await Chat.find(query)
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
        const { projectId, text } = req.body;
        const chat = await Chat.findOne({ projectId });
        if (!chat) {
          return res.status(404).json({ message: "Chat not found" });
        }
        chat.messages.push({ sender: session.user.id, text });
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
