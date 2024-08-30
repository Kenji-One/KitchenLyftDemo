import stripe from "@/utils/ourStripe";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sendPaymentEmail } from "@/utils/email";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { projectId, totalAmount } = req.body;

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Payment for project #${projectId} - First payment`,
              },
              unit_amount: Math.round((totalAmount / 2) * 100), // 50%
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_creation: "always",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelled`,
        metadata: {
          userId: session.user.id,
          projectId: projectId,
          paymentType: "first",
          totalAmount: totalAmount,
        },
        customer_email: session.user.email,
      });

      res.status(200).json(stripeSession);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create checkout session", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
