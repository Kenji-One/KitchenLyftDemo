import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import Chat from "@/models/Chat";
import Order from "@/models/Order";
import User from "@/models/User";
import stripe from "@/utils/ourStripe";
import multer from "multer";
import cloudinary from "@/utils/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { sendPaymentEmail } from "@/utils/email";
import { getExchangeRates } from "@/utils/email";

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

        let query = {};

        // Adjust query based on user role
        if (session.user.role.startsWith("Corporate")) {
          // CorporateAdmin can access all projects
          query = {};
        } else if (session.user.role === "FranchiseAdmin") {
          // FranchiseAdmin should see projects created by themselves and their FranchiseUsers
          const franchiseUsers = await User.find({
            createdBy: session.user.id,
          }).select("_id");
          const franchiseUserIds = franchiseUsers.map((user) => user._id);
          query = { user_id: { $in: [session.user.id, ...franchiseUserIds] } };
        } else if (session.user.role === "FranchiseUser") {
          const currentUser = await User.findById(session.user.id).select(
            "createdBy"
          );
          const createdByAdmin = currentUser.createdBy;
          query = { user_id: { $in: [session.user.id, createdByAdmin] } };
        } else {
          // Default to only showing the user's own projects for other roles
          query = { user_id: session.user.id };
        }

        const projects = await Project.find(query)
          .populate("user_id", "username")
          .sort({ createdAt: -1 })
          .exec();

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
            customerName: req.body.customerName,
            customerPhoneNumber: req.body.customerPhoneNumber,
            customerAddress: req.body.customerAddress,
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
          customerName,
          customerPhoneNumber,
          customerAddress,
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
          project.customerName = customerName ?? project.customerName;
          project.customerPhoneNumber =
            customerPhoneNumber ?? project.customerPhoneNumber;
          project.customerAddress = customerAddress ?? project.customerAddress;

          const updatedProject = await project.save();
          // If the status is changed to "Shipped," capture the second payment
          const order = await Order.findOne({ projectId: id }).populate(
            "userId",
            "username email"
          );
          let paymentMessage = "";
          console.log(order);
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
            const subject = `Kitchen Lyft Order Confirmation #${order._id} [2/2]`;

            const text = `We are pleased to confirm that we have completed the production of materials for ${updatedProject.title} and have shipped them to you. The second payment has been charged.`;

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

              const exchangeRates = await getExchangeRates();
              const canadianCities = ["Montreal", "Toronto"];
              const usCities = ["Miami", "New York", "New Jersey"];

              let currency = "cad";
              let amount = Math.round(order.secondPayment.amount * 100); // default to CAD

              if (usCities.includes(project.location)) {
                currency = "usd";
                const conversionRate = exchangeRates.USD;
                amount = Math.round(
                  order.secondPayment.amount * conversionRate * 100
                );
              }

              const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // amount in cents
                currency: currency,
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
              sendPaymentEmail(order.userId.email, subject, text);
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
