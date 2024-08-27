import connectDB from "@/utils/db";
import User from "@/models/User"; // Assuming you have a User model

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.body;
  await connectDB();

  const user = await User.findOne({ email });

  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
};

export default handler;
