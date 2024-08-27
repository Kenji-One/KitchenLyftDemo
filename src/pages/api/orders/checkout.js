import stripe from "@/utils/ourStripe";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
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
      const { orderId, paymentType } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      let amount;
      let paymentIntentId;

      if (paymentType === "first") {
        amount = order.firstPayment.amount;
        paymentIntentId = order.firstPayment.paymentIntentId;
      } else if (paymentType === "second") {
        amount = order.secondPayment.amount;
        paymentIntentId = order.secondPayment.paymentIntentId;
      } else {
        return res.status(400).json({ error: "Invalid payment type" });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Payment for Order #${order._id} - ${paymentType} payment`,
              },
              unit_amount: Math.round(amount * 100), // Stripe expects the amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelled`,
        metadata: {
          orderId: order._id.toString(),
          paymentType,
        },
      });
      // Save the payment intent ID
      if (paymentType === "first") {
        order.firstPayment.paymentIntentId = stripeSession.payment_intent;
      } else if (paymentType === "second") {
        order.secondPayment.paymentIntentId = stripeSession.payment_intent;
      }

      await order.save();
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
