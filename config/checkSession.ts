import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.user_session;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    // Simpan data user hasil decode ke request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};
