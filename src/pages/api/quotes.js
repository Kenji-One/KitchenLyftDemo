import connectDB from "@/utils/db";
import Quote from "@/models/Quote";
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
        console.log(req.body);
        const newQuote = new Quote({ ...req.body, user_id: session.user.id });
        await newQuote.save();
        res.status(201).json(newQuote);
      } catch (error) {
        res.status(500).json({ message: "Error creating quote", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;
