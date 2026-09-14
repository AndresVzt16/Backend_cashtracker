import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      User?: User;
    }
  }
}
const validateTransactionJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("Token no valido");
    return res.status(401).json({ error: error.message });
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ error: error.message });
  }
  try {
    const result = jwt.verify(token, process.env.SECRET_JWT_KWY);
    if (typeof result === "object" && result.data) {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("No autorizado");
        return res.status(404).json({ error: error.message });
      }
      req.User = user;
      return next();
    }
    const error = new Error("Token no valido");
    return res.status(401).json({ error: error.message });
  } catch (error) {
    return res.status(500).json({ error: "Token no valido" });
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("Token no valido");
    return res.status(401).json({ error: error.message });
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ error: error.message });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KWY);
    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "email", "name"],
      });
      req.User = user;
      next();
    }
  } catch (error) {
    const e = new Error("Token no valido");
    return res.status(500).json({ error: e.message });
  }
};

const hasAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.User.id !== req.budget.userId) {
    const error = new Error("No autorizado.");
    return res.status(401).json({ error: error.message });
  }
  next();
};

export { validateTransactionJWT, authenticate, hasAccess };
