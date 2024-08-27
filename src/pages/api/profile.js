import connectDB from "@/utils/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectDB();

  if (req.method === "POST") {
    const { name, email, image } = req.body;
    try {
      const user = await User.findById(session.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.username = name || user.username;
      user.email = email || user.email;
      user.image = image || user.image;
      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          name: user.username,
          email: user.email,
          image: user.image,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
