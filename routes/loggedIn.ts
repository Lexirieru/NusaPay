import express, { RequestHandler } from "express";
import { checkAuth } from "../middleware/checkAuth";

import {
  addPayrollData,
  addPayrollDetailsData,
  loadPayrollData,
  loadPayrollDetailsData,
} from "../controllers/transactionController";

import {
  addEmployeeData,
  editEmployeeData,
  loadEmployeeData,
  addGroupOfEmployee,
  editGroupOfEmployee,
  loadGroupOfEmployee,
} from "../controllers/companyController";

const router = express.Router();

router.use(checkAuth.isAuthenticated);

type RouteMethod = "get" | "post" | "put" | "delete";

type RouteDefinition = {
  method: RouteMethod;
  path: string;
  action: RequestHandler;
};

const routes: RouteDefinition[] = [
  // Payroll data
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

  // Payroll details data
  {
    method: "post",
    path: "/addPayrollDetailsData",
    action: addPayrollDetailsData,
  },
  {
    method: "get",
    path: "/loadPayrollDetailsData",
    action: loadPayrollDetailsData,
  },
  // Employee Data
  {
    method: "post",
    path: "/addEmployeeData",
    action: addEmployeeData,
  },

  {
    method: "post",
    path: "/editEmployeeData",
    action: editEmployeeData,
  },

  {
    method: "get",
    path: "/loadEmployeeData",
    action: loadEmployeeData,
  },

  // Group of employee data
  {
    method: "post",
    path: "/addGroupOfEmployee",
    action: addGroupOfEmployee,
  },
  {
    method: "post",
    path: "/editGroupOfEmployee",
    action: editGroupOfEmployee,
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
