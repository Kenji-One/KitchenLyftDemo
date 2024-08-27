import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import Chat from "@/models/Chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";
import cloudinary from "@/utils/cloudinary";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  switch (req.method) {
    case "GET":
      try {
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
    case "DELETE":
      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        if (!["CorporateAdmin", "FranchiseAdmin"].includes(session.user.role)) {
          return res
            .status(403)
            .json({ message: "Access Denied: Insufficient permissions" });
        }

        if (project.images && project.images.length > 0) {
          const deletePromises = project.images.map((imgUrl) => {
            const publicId = imgUrl.split("/").pop().split(".")[0];
            return cloudinary.uploader.destroy(publicId);
          });
          await Promise.all(deletePromises);
        }

        await Chat.findOneAndDelete({ projectId: id });
        await Quote.findOneAndDelete({ projectId: id });
        await Project.deleteOne({ _id: id });

        res
          .status(200)
          .json({ message: "Project and its images deleted successfully" });
      } catch (error) {
        console.error("Error deleting project:", error);
        res
          .status(500)
          .json({ message: "Error deleting project", error: error.toString() });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
