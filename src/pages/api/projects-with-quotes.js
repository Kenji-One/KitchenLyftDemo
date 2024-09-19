// /pages/api/projects-with-quotes.js
import connectDB from "@/utils/db";
import Project from "@/models/Project";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
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

    // Fetch projects based on the query
    const projects = await Project.find(query)
      .populate("user_id", "username")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch quotes for each project
    const projectQuotes = await Promise.all(
      projects.map(async (project) => {
        const quote = await Quote.findOne({ projectId: project._id }).lean();
        return { ...project, quote: quote?.price || "N/A" };
      })
    );

    res.status(200).json(projectQuotes);
  } catch (error) {
    console.error("Error fetching projects with quotes:", error);
    res
      .status(500)
      .json({ message: "Error fetching projects with quotes", error });
  }
};

export default handler;
