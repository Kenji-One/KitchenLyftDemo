// pages/api/projects/[id].js
import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        const { id } = req.query;
        const project = await Project.findById(id).populate(
          "user_id",
          "username image"
        );
        const quote = await Quote.findOne({ projectId: id });

        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project, quote });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error fetching project details", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
