import { aj } from "../lib/arcjet.js";

export const rateLimit = async (req, res, next) => {
  console.log("HUH");
  try {
    const decision = await aj.protect(req, { requested: 1 });

    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }
    next();
  } catch (error) {
    console.error("Arcjet error:", error.message);
  }
};
