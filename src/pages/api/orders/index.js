import connectDB from "@/utils/db";
import Order from "@/models/Order";
import User from "@/models/User";
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

      let query = {};

      // Adjust query based on user role
      if (session.user.role.startsWith("Corporate")) {
        // CorporateAdmin can access all orders
        query = {};
      } else if (session.user.role === "FranchiseAdmin") {
        // FranchiseAdmin should see orders created by themselves and their FranchiseUsers
        const franchiseUsers = await User.find({
          createdBy: session.user.id,
        }).select("_id");
        const franchiseUserIds = franchiseUsers.map((user) => user._id);
        query = { userId: { $in: [session.user.id, ...franchiseUserIds] } };
      } else if (session.user.role === "FranchiseUser") {
        const currentUser = await User.findById(session.user.id).select(
          "createdBy"
        );
        const createdByAdmin = currentUser.createdBy;
        query = { userId: { $in: [session.user.id, createdByAdmin] } };
      } else {
        // Default to only showing the user's own orders for other roles
        query = { userId: session.user.id };
      }

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
