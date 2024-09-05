import stripe from "@/utils/ourStripe";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getExchangeRates } from "@/utils/email";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { projectId, totalAmount, projectLocation } = req.body;

      const exchangeRates = await getExchangeRates();
      const canadianCities = ["Montreal", "Toronto"];
      const usCities = ["Miami", "New York", "New Jersey"];

      let currency = "cad";
      let amount = Math.round((totalAmount / 2) * 100); // default to CAD

      if (usCities.includes(projectLocation)) {
        currency = "usd";
        const conversionRate = exchangeRates.USD;
        amount = Math.round(((totalAmount * conversionRate) / 2) * 100);
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // Continue using the payment mode
        customer_creation: "always",
        payment_intent_data: {
          setup_future_usage: "off_session", // Save the payment method for future use
        },
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Payment for project #${projectId} - First payment`,
              },
              unit_amount: amount, // 50% of the total amount
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelled`,
        metadata: {
          userId: session.user.id,
          projectId: projectId,
          paymentType: "first",
          totalAmount: Math.round(totalAmount * conversionRate * 100),
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
