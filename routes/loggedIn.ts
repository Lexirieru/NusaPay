import express, { RequestHandler } from "express";
import { listenToPayrollEvents } from "../controllers/eventListenerController";

const router = express.Router();

type RouteMethod = "get" | "post" | "put" | "delete";

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  action: RequestHandler;
};

const routes: RouteDefinition[] = [
  {
    method: "get",
    path: "/listenToPayrollEvents",
    action: listenToPayrollEvents,
  }, //V // ngeshow semua task yang ada dan blom completed
  // { method: 'post', path: '/uploadPhotoAndFoodComponent', middlewares : [upload.single('photo')], action: uploadPhotoAndFoodComponentToDatabase}, //V // ngeshow semua task yang ada dan blom completed
  // { method: 'post', path: '/sendScannedPhotoResult', middlewares : [upload.single('photo')], action: sendScannedPhotoResult}, //V // ngeshow semua task yang ada dan blom completed
];

routes.forEach((route) => {
  router[route.method](route.path, route.action);
});

export default router;
