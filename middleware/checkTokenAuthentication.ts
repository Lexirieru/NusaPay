import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CompanyDataModel } from "../models/companyModel";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.user_session;

  if (!token) {
    res.status(401).json({ authenticated: false, message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      companyName?: string;
      profilePicture?: string;
    };

    // Validasi token dengan database
    const company = await CompanyDataModel.findOne({
      _id: decoded.id,
      email: decoded.email,
    });

    if (!company) {
      res.status(401).json({ authenticated: false, message: "Invalid token" });
    }

    // inject user ke req
    (req as any).user = company;
    next();
  } catch (err) {
    res.status(401).json({ authenticated: false, message: "Token error" });
  }
};
