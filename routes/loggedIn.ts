import express, { RequestHandler } from "express";
import { isAuthenticated } from "../middleware/checkAuth";

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
  addOrUpdateCompanyStats,
  addOrUpdateCompanyData,
} from "../controllers/companyController";

const router = express.Router();

// router.use("/user", isAuthenticated);

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

  {
    method: "post",
    path: "/addOrUpdateCompanyStats",
    action: addOrUpdateCompanyStats,
  },
  {
    method: "post",
    path: "/addOrUpdateCompanyData",
    action: addOrUpdateCompanyData,
  },
];

routes.forEach((route) => {
  router[route.method](route.path, route.action);
});

export default router;
