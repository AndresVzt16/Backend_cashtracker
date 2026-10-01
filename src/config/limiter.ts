import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: Number(process.env.TIMEOUT_LIMIT_REQUEST) * 1000,
  limit: Number(process.env.LIMIT_HTTP_REQUEST),
  message: { error: "Haz alcanzado el limite de peticiones." },
});
