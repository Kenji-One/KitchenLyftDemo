// pages/api/projects/[id].js
import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
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
    case "PUT":
      try {
        const {
          description,
          location,
          priority,
          status,
          deadline,
          removedImages,
        } = req.body;
        const project = await Project.findById(id);

        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        project.description = description ?? project.description;
        project.location = location ?? project.location;
        project.priority = priority ?? project.priority;
        project.status = status ?? project.status;
        project.deadline = deadline ? new Date(deadline) : project.deadline;

        // Remove main image if specified
        if (req.body.removedMainImage && project.image) {
          const publicId = project.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
          project.image = null;
        }

        // Remove additional images from Cloudinary and the database
        if (removedImages && removedImages.length > 0) {
          for (const image of removedImages) {
            const publicId = image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }
          project.additionalImages = project.additionalImages.filter(
            (image) => !removedImages.includes(image)
          );
        }
        // Handle new images
        if (req.files && req.files.newImages) {
          const newImages = Array.isArray(req.files.newImages)
            ? req.files.newImages
            : [req.files.newImages];

          for (const file of newImages) {
            const uploadResponse = await cloudinary.uploader.upload(file.path, {
              folder: "project_images",
            });

            if (!project.image) {
              project.image = uploadResponse.secure_url; // Set main image if it's missing
            } else {
              project.additionalImages.push(uploadResponse.secure_url);
            }
          }
        }
        await project.save();

        res
          .status(200)
          .json({ message: "Project updated successfully", project });
      } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
