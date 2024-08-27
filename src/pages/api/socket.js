import { Server } from "socket.io";
import connectDB from "@/utils/db";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const SocketHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("join_project", (projectId) => {
        socket.join(projectId);
        io.emit("update_unread_count", { projectId });
        console.log(`Socket ${socket.id} joined room: ${projectId}`);
      });

      socket.on("new_message", async (message) => {
        console.log("messagee:", message);
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return;
        }
        const { projectId, text, senderId } = message;
        await connectDB();
        const chat = await Chat.findOne({ projectId });

        if (chat) {
          const newMessage = {
            sender: senderId,
            text,
            readBy: [senderId],
          };
          console.log("newMessage:", newMessage);
          chat.messages.push(newMessage);
          await chat.save();

          const populatedChat = await Chat.findOne({ projectId }).populate(
            "messages.sender",
            "username image"
          );
          console.log("projectId:", projectId?._id || projectId);
          io.to(projectId?._id || projectId).emit("message", populatedChat);
          io.emit("update_unread_count", { projectId });
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }

  res.end();
};

export default SocketHandler;
