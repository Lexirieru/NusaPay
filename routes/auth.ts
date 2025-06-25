import express, { Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { CompanyDataModel } from "../models/companyModel";
import { generateToken } from "../config/generateToken";

const router: Router = express.Router();

// CHECK AUTH STATUS
router.get("/check-auth", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.CALLBACK_URL || "/google/callback",
      passReqToCallback: true,
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) {
      try {
        const existingCompany = await CompanyDataModel.findOne({
          companyId: profile.id,
        });

        if (existingCompany) {
          return done(null, existingCompany);
        } else {
          const newCompany = await CompanyDataModel.create({
            companyId: profile.id,
            email: profile.emails?.[0]?.value,
            // companyName: profile.displayName,
          });
          return done(null, newCompany);
        }
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user!);
});

// GOOGLE AUTH ENDPOINT
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { session: true }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const email = user?.email ?? user?.emails?.[0]?.value;

    if (email) {
      // ambil user terbaru
      const found = await CompanyDataModel.findOne({ email });

      const userToUse = found ?? user;

      const token = generateToken({
        id: userToUse._id?.toString(),
        email: userToUse.email,
      });

      res.cookie("user_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 hari
      });

      res.redirect(`${process.env.FRONTEND_URL}/`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  }
);

// LOGOUT
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout gagal" });

    req.session.destroy(() => {
      res.clearCookie("user_session");
      res.status(200).json({ message: "Logout sukses" });
    });
  });
});
export default router;
