import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (id) {
        const order = await Order.findById(id)
          .populate("projectId", "title")
          .populate("userId", "username email")
          .lean();

        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
      }

      const query = session.user.role.startsWith("Corporate")
        ? {}
        : { userId: session.user.id };
      const orders = await Order.find(query)
        .populate("projectId", "title")
        .populate("userId", "username email")
        .lean();

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
