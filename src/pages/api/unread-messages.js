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

  if (req.method === "GET") {
    try {
      let userChatsQuery = {};

      if (session.user.role.startsWith("Corporate")) {
        // CorporateAdmin and CorporateUser can access all project chats
        userChatsQuery = {};
      } else if (session.user.role === "FranchiseAdmin") {
        // FranchiseAdmin can access their own projects and those created by FranchiseUsers under them
        const userProjects = await Project.find({
          $or: [
            { user_id: session.user.id }, // Projects created by the FranchiseAdmin
            { user_id: { $in: session.user.subordinates } }, // Projects created by their FranchiseUsers
          ],
        }).select("_id");

        userChatsQuery = { projectId: { $in: userProjects.map((p) => p._id) } };
      } else if (session.user.role === "FranchiseUser") {
        // FranchiseUser can access only their created projects' chats
        userChatsQuery = { "projectId.user_id": session.user.id };
      }

      // Fetch chats with messages where the current user has not marked as read
      const chats = await Chat.find(userChatsQuery).populate({
        path: "messages.sender",
        match: { readBy: { $ne: session.user.id } }, // Fetch only messages that haven't been read by the user
        select: "readBy", // Fetch only the readBy field to optimize performance
      });

      // Count unread messages
      const unreadCount = chats.reduce((count, chat) => {
        const unreadMessages = chat.messages.filter(
          (message) => !message.readBy.includes(session.user.id)
        );
        return count + unreadMessages.length;
      }, 0);

      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error("Error fetching unread message count", error);
      res.status(500).json({
        message: "Error fetching unread message count",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
