import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "CorporateAdmin") {
    return res
      .status(403)
      .json({ error: "You do not have access to this resource" });
  }

  switch (req.method) {
    case "POST":
      const { username, password, email, role } = req.body;
      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = new User({ username, passwordHash, email, role });
      try {
        await newUser.save();
        res.status(201).json(newUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case "DELETE":
      const { id } = req.query;
      try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case "GET":
      const users = await User.find();
      res.status(200).json(users);
      break;

    default:
      res.setHeader("Allow", ["POST", "DELETE", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
