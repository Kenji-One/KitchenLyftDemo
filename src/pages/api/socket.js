import Ably from "ably";
import connectDB from "@/utils/db";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
const subscriptions = new Map(); // To keep track of subscriptions

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const channel = ably.channels.get("chat");
  const userId = session.user.id;

  if (!subscriptions.has(userId)) {
    subscriptions.set(userId, true);

    channel.subscribe("new_message", async (message) => {
      const { id, projectId, text, senderId } = message.data;
      await connectDB();

      const existingMessage = await Chat.findOne({ "messages.uniqueId": id });
      if (existingMessage) {
        return;
      }

      try {
        const chat = await Chat.findOne({ projectId });

        if (chat) {
          const newMessage = {
            uniqueId: id,
            sender: senderId,
            text,
            readBy: [senderId],
          };

          chat.messages.push(newMessage);
          await chat.save();

          const populatedChat = await Chat.findOne({ projectId }).populate(
            "messages.sender",
            "username image"
          );

          // console.log("Publishing new message to channel:", populatedChat); // Debugging
          channel.publish("message", populatedChat);
          channel.publish("update_unread_count", { projectId });
        } else {
          console.log("Chat not found for projectId:", projectId); // Debugging
        }
      } catch (error) {
        console.error("Error processing message:", error); // Debugging
      }
    });

    channel.subscribe("join_project", (projectId) => {
      channel.publish("update_unread_count", { projectId });
    });
  }

  res.end();
}
