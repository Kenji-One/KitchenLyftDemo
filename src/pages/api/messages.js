import connectDB from "@/utils/db";
import Chat from "@/models/Chat";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

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
          }
          return res.status(200).json(chat);
        } else {
          const query = session.user.role.startsWith("Corporate")
            ? {}
            : { "projectId.user_id": session.user.id };

          const chats = await Chat.find(query)
            .populate({
              path: "projectId",
              populate: {
                path: "user_id",
                select: "username image",
              },
            })
            .populate("messages.sender", "username image");

          return res.status(200).json(chats);
        }
      } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
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
