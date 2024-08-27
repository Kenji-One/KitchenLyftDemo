import connectDB from "@/utils/db";
import Order from "@/models/Order";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { projectId, userId, totalAmount } = req.body;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const newOrder = new Order({
        projectId,
        userId,
        totalAmount,
        firstPayment: {
          amount: totalAmount * 0.5,
          status: "Pending",
        },
        secondPayment: {
          amount: totalAmount * 0.5,
          status: "Pending",
        },
      });

      await newOrder.save();

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
