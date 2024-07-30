import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import Chat from "@/models/Chat";
import multer from "multer";
import cloudinary from "@/utils/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

        if (id) {
          const project = await Project.findById(id)
            .populate("user_id", "username image")
            .lean();

          const quote = await Quote.findOne({ projectId: id }).lean();
          const chat = await Chat.findOne({ projectId: id })
            .lean()
            .populate("messages.sender", "username image");

          if (!project) {
            return res.status(404).json({ message: "Project not found" });
          }

          return res.status(200).json({ project, quote, chat });
        }

        const query = session.user.role.startsWith("Corporate")
          ? {}
          : { user_id: session.user.id };
        const projects = await Project.find(query).populate(
          "user_id",
          "username"
        );
        // console.log("projectssss:", projects);
        res.status(200).json(projects);
      } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
      }
      break;

    case "POST":
      upload.array("images")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(500)
            .json({ message: "File upload error", error: err });
        } else if (err) {
          return res.status(500).json({ message: "Unknown error", error: err });
        }

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
          try {
            // const result = await new Promise((resolve, reject) => {
            //   const uploadStream = cloudinary.uploader.upload_stream(
            //     (error, result) => {
            //       if (error) reject(error);
            //       resolve(result);
            //     }
            //   );
            //   uploadStream.end(req.file.buffer);
            // });
            // imageUrl = result.secure_url;
            const uploadPromises = req.files.map((file) => {
              return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (error) reject(error);
                    resolve(result.secure_url);
                  }
                );
                uploadStream.end(file.buffer);
              });
            });

            imageUrls = await Promise.all(uploadPromises);
          } catch (uploadError) {
            return res
              .status(500)
              .json({ message: "Failed to upload image", error: uploadError });
          }
        }

        try {
          const location = req.body.location;
          const projectCount = await Project.countDocuments({ location });
          const title = `${location} Kitchen #${String(
            projectCount + 1
          ).padStart(3, "0")}`;

          const newProject = new Project({
            title,
            image: imageUrls[0] || null,
            additionalImages: imageUrls.slice(1),
            description: req.body.description,
            location: req.body.location,
            priority: req.body.priority,
            status: req.body.status,
            user_id: session.user.id,
          });

          const savedProject = await newProject.save();
          // console.log("savedProject:", savedProject);
          const newChat = new Chat({
            projectId: savedProject._id,
            messages: [],
          });

          await newChat.save();

          res.status(201).json(savedProject);
        } catch (error) {
          res.status(500).json({ message: "Failed to create project", error });
        }
      });
      break;

    case "PUT":
      upload.array("images")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res
            .status(500)
            .json({ message: "File upload error", error: err });
        } else if (err) {
          return res.status(500).json({ message: "Unknown error", error: err });
        }

        const { id, title, description, location, priority } = req.body;
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
          try {
            const uploadPromises = req.files.map((file) => {
              return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (error) reject(error);
                    resolve(result.secure_url);
                  }
                );
                uploadStream.end(file.buffer);
              });
            });

            imageUrls = await Promise.all(uploadPromises);
          } catch (uploadError) {
            return res
              .status(500)
              .json({ message: "Failed to upload images", error: uploadError });
          }
        }

        try {
          const project = await Project.findById(id);
          if (!project) {
            return res.status(404).json({ message: "Project not found" });
          }
          if (project.user_id.toString() !== session.user.id) {
            return res.status(403).json({ message: "Forbidden" });
          }

          if (imageUrls.length > 0) {
            // Remove existing images from Cloudinary
            if (project.image) {
              const publicId = project.image.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            }
            if (
              project.additionalImages &&
              project.additionalImages.length > 0
            ) {
              const deletePromises = project.additionalImages.map((imgUrl) => {
                const publicId = imgUrl.split("/").pop().split(".")[0];
                return cloudinary.uploader.destroy(publicId);
              });
              await Promise.all(deletePromises);
            }
            project.image = imageUrls[0] || null;
            project.additionalImages = imageUrls.slice(1);
          }

          project.title = title;
          project.description = description;
          project.location = location;
          project.priority = priority;

          const updatedProject = await project.save();
          res.status(200).json(updatedProject);
        } catch (error) {
          res.status(500).json({ message: "Error updating project", error });
        }
      });
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
        if (project.user_id.toString() !== session.user.id) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // Remove the images from Cloudinary if they exist
        if (project.image) {
          const publicId = project.image.split("/").pop().split(".")[0]; // Extract publicId from URL
          await cloudinary.uploader.destroy(publicId);
        }
        if (project.additionalImages && project.additionalImages.length > 0) {
          const deletePromises = project.additionalImages.map((imgUrl) => {
            const publicId = imgUrl.split("/").pop().split(".")[0]; // Extract publicId from URL
            return cloudinary.uploader.destroy(publicId);
          });
          await Promise.all(deletePromises);
        }

        // Delete the chat associated with the project
        await Chat.findOneAndDelete({ projectId: id });

        // Delete the quote associated with the project
        await Quote.findOneAndDelete({ projectId: id });

        await project.remove();
        res.status(200).json({ message: "Project and its image deleted" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
