import Ably from "ably";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const clientId = req.body.clientId || null;
  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

  try {
    const tokenRequest = await ably.auth.createTokenRequest({ clientId });
    res.status(200).json(tokenRequest);
  } catch (error) {
    console.error("Failed to create token request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
