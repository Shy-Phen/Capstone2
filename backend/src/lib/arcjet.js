import arcjet, { tokenBucket, shield } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 2,
      interval: "1m",
      capacity: 2,
    }),
  ],
});
