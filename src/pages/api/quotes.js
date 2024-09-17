import connectDB from "@/utils/db";
import Quote from "@/models/Quote";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { projectId } = req.query;

  switch (req.method) {
    case "GET":
      try {
        if (projectId) {
          const quote = await Quote.findOne({ projectId }).lean();
          if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
          }
          return res.status(200).json(quote);
        }
        const quotes = await Quote.find({ user_id: session.user.id });
        res.status(200).json(quotes);
      } catch (error) {
        res.status(500).json({ message: "Error fetching quotes", error });
      }
      break;

    case "POST":
      try {
        const existingQuote = await Quote.findOne({
          projectId: req.body.projectId,
        });
        if (existingQuote) {
          await Quote.deleteOne({ _id: existingQuote._id });
        }

        const newQuote = new Quote({ ...req.body, user_id: session.user.id });
        await newQuote.save();

        const project = await Project.findById(req.body.projectId);
        if (project) {
          project.status = "Awaiting Payment";

          await project.save();
        }
        res.status(201).json(newQuote);
      } catch (error) {
        console.error("Error in creating or replacing a quote:", error);
        res.status(500).json({ message: "Error creating quote", error });
      }
      break;
    case "PUT":
      try {
        const { quoteId, ...updateData } = req.body;

        const quote = await Quote.findById(quoteId);
        if (!quote) {
          return res.status(404).json({ message: "Quote not found" });
        }

        // Check if the user is the creator of the quote or has CorporateAdmin role
        if (
          quote.user_id.toString() !== session.user.id &&
          session.user.role !== "CorporateAdmin"
        ) {
          return res.status(403).json({ message: "Forbidden" });
        }

        Object.assign(quote, updateData);
        await quote.save();

        // const project = await Project.findById(quote.projectId);
        // if (project && updateData.price) {
        //   project.status = "Awaiting Payment";
        //   await project.save();
        // }

        res.status(200).json(quote);
      } catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ message: "Error updating quote", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;
