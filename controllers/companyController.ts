import { Request, Response } from "express";
import { EmployeeModel, GroupOfEmployeeData } from "../models/employeeModel"; // Pastikan path-nya benar

export async function addEmployeeData(req: Request, res: Response) {
  // bankCode dari FE harus bisa nge enum sesuai dengan bankAccountnya
  const {
    companyAccount,
    name,
    bankCode,
    bankAccount,
    bankAccountName,
    walletAddress,
    networkChainId,
    amountTransfer,
  } = req.body;

  try {
    const newEmployeeData = new EmployeeModel({
      companyAccount,
      name,
      bankCode,
      bankAccount,
      bankAccountName,
      walletAddress,
      networkChainId,
      amountTransfer,
    });

    const saved = await newEmployeeData.save();
    res.status(201).json({
      message: "Employee data successfully added",
      payroll: saved,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error adding employee data",
      error: err.message,
    });
  }
}

export async function addGroupOfEmployee(req: Request, res: Response) {
  const { companyAccount, nameOfGroup, employees } = req.body;

  try {
    // minta FE buat ngirimin employeesNamenya juga (ketimbang backend harus ngefind satu satu name dari Id)
    const newGroupOfEmployee = new GroupOfEmployeeData({
      companyAccount,
      nameOfGroup,
      employees,
    });

    const saved = await newGroupOfEmployee.save();
    res.status(201).json({
      message: "Group of employee successfully added",
      payroll: saved,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error adding group of employee",
      error: err.message,
    });
  }
}
export async function loadGroupOfEmployee(req: Request, res: Response) {
  const { companyAccount } = req.body;

  try {
    const latestGroupOfEmployee = await GroupOfEmployeeData.find({
      companyAccount,
    })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(201).json({
      message: "Group of employee successfully sended",
      data: latestGroupOfEmployee,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error sending group of employee",
      error: err.message,
    });
  }
}
