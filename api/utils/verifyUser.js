import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "Unauthorized"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, "Forbidden || Invalid Token"));
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
