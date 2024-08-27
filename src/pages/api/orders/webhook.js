import { buffer } from "micro";
import stripe from "@/utils/ourStripe";
import connectDB from "@/utils/db";
import Order from "@/models/Order";
import Project from "@/models/Project";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendPaymentConfirmationEmail = async (order, project, isFirstPayment) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = isFirstPayment
    ? `Kitchen Lyft Order Confirmation #${order._id} [1/2]`
    : `Kitchen Lyft Order Confirmation #${order._id} [2/2]`;

  const text = isFirstPayment
    ? `We are pleased to confirm that we have received the first 50% payment for ${project.title}, ${project.location}. We are now moving forward with production.`
    : `We are pleased to confirm that we have completed the production of materials for ${project.title} and have shipped them to you. The second payment has been charged.`;

  const mailOptions = {
    to: project.user_id.email,
    from: process.env.EMAIL_USER,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default async function handler(req, res) {
  await connectDB();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Find the order using the payment intent ID
      const order = await Order.findOne({
        $or: [
          { "firstPayment.paymentIntentId": session.payment_intent },
          { "secondPayment.paymentIntentId": session.payment_intent },
        ],
      }).populate("projectId");

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const project = await Project.findById(order.projectId);

      if (order.firstPayment.paymentIntentId === session.payment_intent) {
        order.firstPayment.status = "Completed";
        order.status = "Paid";
        project.status = "Paid";
        await sendPaymentConfirmationEmail(order, project, true);
      } else if (
        order.secondPayment.paymentIntentId === session.payment_intent
      ) {
        order.secondPayment.status = "Completed";
        order.status = "Shipped";
        project.status = "Shipped";
        await sendPaymentConfirmationEmail(order, project, false);
      }

      await order.save();
      await project.save();

      break;

    // case "payment_intent.succeeded":
    //   // Handle second payment if applicable
    //   const paymentIntent = event.data.object;
    //   const orderForSecondPayment = await Order.findOne({
    //     "secondPayment.paymentIntentId": paymentIntent.id,
    //   });

    //   if (orderForSecondPayment) {
    //     orderForSecondPayment.secondPayment.status = "Completed";
    //     orderForSecondPayment.status = "Shipped";
    //     await orderForSecondPayment.save();
    //   }

    //   break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
