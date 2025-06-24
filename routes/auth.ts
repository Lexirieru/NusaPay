import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { validationResult } from "express-validator";
import { userModel } from "../models/userModel"; // pastikan path ini benar
import checkAuth from "../middleware/checkAuth"; // pastikan path ini benar

const router: Router = express.Router();

// ----------- CHECK AUTH -----------
router.get("/check-auth", (req: Request, res: Response) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (res.locals.isAuthenticated) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// ----------- REGISTER USER -----------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;

    const duplicate = await userModel.findOne({ email });
    if (duplicate) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hash = await bcrypt.hash(password, 13);
    const newUser = await userModel.create({ email, password: hash, ...rest });

    res.status(201).json({
      message: "Akun berhasil dibuat",
      user: newUser,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan saat registrasi",
        error: error.message,
      });
  }
});

// ----------- GOOGLE STRATEGY -----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.CALLBACK_URL || "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const existingUser = await userModel.findOne({ google_id: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const userData = {
          google_id: profile.id,
          nama: profile.displayName,
          email: profile.emails?.[0]?.value,
        };

        const createdUsers = await userModel.insertMany([userData]);
        return done(null, createdUsers[0]);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

// ----------- GOOGLE LOGIN ROUTES -----------
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: true }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    if (!user) return res.status(400).json({ message: "Login gagal" });

    res.status(200).json({
      message: "Berhasil login dengan Google",
      user,
    });
  }
);

// ----------- MANUAL LOGIN -----------
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userAccount = await userModel.findOne({ email });
  if (!userAccount) {
    return res
      .status(404)
      .json({ message: "Akun tidak ditemukan, silakan coba lagi" });
  }

  const isValid = await bcrypt.compare(password, userAccount.password);
  if (!isValid) {
    return res.status(400).json({ message: "Password salah" });
  }

  req.session.user = {
    id: crypto.randomUUID(),
    email,
  };

  res.status(200).json({
    message: "Berhasil masuk ke akun",
    user: userAccount,
  });
});

// ----------- LOGOUT USER -----------
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout gagal" });
    }

    res.clearCookie("connect.sid");
    res.locals.isAuthenticated = undefined;
    res.status(200).json({ message: "Logout sukses" });
  });
});

export default router;
