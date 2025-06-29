// import express, { RequestHandler } from "express";
// import { recordTransactionToDB } from "../services/recordTransaction";


// const router = express.Router();

// // router.use("/user", isAuthenticated);

// type RouteMethod = "get" | "post" | "put" | "delete";

// type RouteDefinition = {
//   method: RouteMethod;
//   path: string;
//   action: RequestHandler;
// };

// const routes: RouteDefinition[] = [
//   // Payroll data
//   {
//     method: "post",
//     path: "/transaction-status/:txHash",
//     action: recordTransactionToDB,
//   },
  
// ];

// routes.forEach((route) => {
//   router[route.method](route.path, route.action);
// });

// export default router;
