import { Request, Response } from "express";
// middleware untuk ngeamanin halaman halaman yang user harus terautentikasi dlu untuk ngakses halaman-halamannya
export function isAuthenticated(req: Request, res: Response, next) {
  if (req.session.user) {
    next(); // User sudah login, lanjutkan ke handler berikutnya
  } else {
    res.redirect("/login");
  }
}
