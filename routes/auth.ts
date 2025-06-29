import express, { Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  CompanyDataModel,
  LoginSessionTokenModel,
} from "../models/companyModel";
import { generateToken } from "../config/generateToken";
import { verifyToken } from "../middleware/checkTokenAuthentication";
import { checkSession } from "../config/checkSession";

const router: Router = express.Router();

// CHECK AUTH STATUS
// check auth

router.get("/check-auth", verifyToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    authenticated: true,
    user: {
      id: user._id,
      email: user.email,
      companyName: user.companyName || null,
      profilePicture: user.profilePicture || null,
    },
  });
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
            companyName: profile.displayName,
            profilePicture: profile.photos?.[0]?.value || "",
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

router.get("/me", checkSession, async (req, res) => {
  const user = req.user as any;
  console.log("user", user);
  const payload = {
    _id: user.id?.toString(),
    email: user.email,
    name: user.companyName || user.name || user.displayName,
    profilePicture: user.profilePicture || "",
  };
  // console.log("Payload being sent to frontend:", payload);
  res.json(payload);
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
        companyName:
          userToUse.companyName || userToUse.name || userToUse.displayName,
        profilePicture: userToUse.profilePicture || "",
      });
      const tokenSession = new LoginSessionTokenModel({
        email,
        token,
      });

      await tokenSession.save();
      res.cookie("user_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 hari
      });

      res.redirect(`${process.env.FRONTEND_URL}/transfer`);
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
