import express, { RequestHandler } from "express";
import {
  addPayrollData,
  addPayrollDetailsData,
  loadPayrollData,
  loadPayrollDetailsData,
} from "../controllers/transactionController";

import {
  addEmployeeData,
  addGroupOfEmployee,
  loadGroupOfEmployee,
} from "../controllers/companyController";

const router = express.Router();

type RouteMethod = "get" | "post" | "put" | "delete";

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  action: RequestHandler;
};

const routes: RouteDefinition[] = [
  {
    method: "post",
    path: "/addPayrollData",
    action: addPayrollData,
  },
  {
    method: "get",
    path: "/loadPayrollData",
    action: loadPayrollData,
  },
  {
    method: "get",
    path: "/loadPayrollDetailsData",
    action: loadPayrollDetailsData,
  },
  {
    method: "post",
    path: "/addPayrollDetailsData",
    action: addPayrollDetailsData,
  },
  {
    method: "post",
    path: "/addEmployeeData",
    action: addEmployeeData,
  },
  {
    method: "post",
    path: "/addGroupOfEmployee",
    action: addGroupOfEmployee,
  },
  {
    method: "get",
    path: "/loadGroupOfEmployee",
    action: loadGroupOfEmployee,
  },
];

routes.forEach((route) => {
  router[route.method](route.path, route.action);
});

export default router;
