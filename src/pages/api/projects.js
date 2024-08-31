import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import Chat from "@/models/Chat";
import Order from "@/models/Order";
import stripe from "@/utils/ourStripe";
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
            .populate({
              path: "projectId",
              populate: { path: "user_id", select: "username image" },
            })
            .populate("messages.sender", "username image")
            .lean();

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
            images: imageUrls,
            description: req.body.description,
            location: req.body.location,
            priority: req.body.priority,
            startDate: req.body.startDate,
            // status: req.body.status,
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

        const {
          id,
          description,
          location,
          priority,
          startDate,
          status,
          removedImages,
          existingImages,
        } = req.body;

        const removedImagesArray = JSON.parse(removedImages || "[]");
        const existingImagesArray = JSON.parse(existingImages || "[]");
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
          if (
            project.user_id.toString() !== session.user.id &&
            session.user.role !== "CorporateAdmin"
          ) {
            return res.status(403).json({ message: "Forbidden" });
          }

          // Update the title if the location has changed
          if (location && location !== project.location) {
            const titleParts = project.title.split(" ");
            const kitchenNumber = titleParts[titleParts.length - 1];
            project.title = `${location} Kitchen ${kitchenNumber}`;
          }

          // Remove additional images from Cloudinary and the database
          if (removedImagesArray.length > 0) {
            const deletePromises = removedImagesArray.map((imgUrl) => {
              const publicId = imgUrl.split("/").pop().split(".")[0];
              return cloudinary.uploader.destroy(publicId);
            });
            await Promise.all(deletePromises);

            project.images = project.images.filter(
              (image) => !removedImagesArray.includes(image)
            );
          }

          // Add new images
          project.images = [...existingImagesArray, ...imageUrls];

          project.description = description ?? project.description;
          project.location = location ?? project.location;
          project.priority = priority ?? project.priority;
          project.status = status ?? project.status;
          project.startDate = startDate ?? project.startDate;

          const updatedProject = await project.save();
          // If the status is changed to "Shipped," capture the second payment
          const order = await Order.findOne({ projectId: id });
          let paymentMessage = "";
          if (
            status === "Shipped" &&
            order.secondPayment.status !== "Completed"
          ) {
            if (!order) {
              return res.status(404).json({ message: "Order not found" });
            }

            if (order.secondPayment.status === "Completed") {
              return res.status(400).json({
                message: "Second payment already completed or not required.",
              });
            }

            try {
              // Retrieve the first PaymentIntent
              const firstPaymentIntent = await stripe.paymentIntents.retrieve(
                order.firstPayment.paymentIntentId
              );

              if (!firstPaymentIntent.payment_method) {
                return res.status(400).json({
                  message: "No payment method found for the first payment.",
                });
              }

              const paymentMethodId = firstPaymentIntent.payment_method;

              const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(order.secondPayment.amount * 100), // amount in cents
                currency: "usd",
                customer: order.stripeCustomerId, // Use stored Stripe customer ID
                payment_method: paymentMethodId,
                off_session: true,
                confirm: true,
                metadata: {
                  orderId: order._id.toString(),
                  paymentType: "second",
                },
              });
              // Update order status to Completed after successful payment
              order.secondPayment.paymentIntentId = paymentIntent.id;
              order.secondPayment.status = "Completed";
              order.status = "Completed";
              await order.save();

              paymentMessage =
                "Second Payment was successful, product is ready for shipping!";
            } catch (paymentError) {
              console.error("Error capturing second payment:", paymentError);
              return res.status(500).json({
                message: "Failed to capture second payment",
                error: paymentError.message,
              });
            }
          }

          const responseMessage =
            paymentMessage || "Project was updated successfully";

          res.status(200).json({ updatedProject, message: responseMessage });
        } catch (error) {
          console.error("Error updating project:", error);
          res.status(500).json({ message: "Error updating project", error });
        }
      });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
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
