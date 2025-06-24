import { Request, Response } from "express";
import { EmployeeModel, GroupOfEmployeeData } from "../models/employeeModel"; // Pastikan path-nya benar

export async function addEmployeeData(req: Request, res: Response) {
  // bankCode dari FE harus bisa nge enum sesuai dengan bankAccountnya
  const {
    companyId,
    companyName,
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
      companyId,
      companyName,
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

// nek ada yang di delete ntar masuknya juga ke handler editEmployeeData ini
export async function editEmployeeData(req: Request, res: Response) {
  const {
    _id,
    name,
    bankCode,
    bankAccount,
    bankAccountName,
    walletAddress,
    networkChainId,
    amountTransfer,
  } = req.body;

  try {
    const employeeData = await EmployeeModel.findByIdAndUpdate(
      _id,
      {
        name,
        bankCode,
        bankAccount,
        bankAccountName,
        walletAddress,
        networkChainId,
        amountTransfer,
      },
      { new: true }
    );

    if (!employeeData) {
      res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(201).json({
      message: "Employee data successfully edited",
      payroll: employeeData,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error editing employee data",
      error: err.message,
    });
  }
}

export async function loadEmployeeData(req: Request, res: Response) {
  const { companyId } = req.body;

  try {
    const latestGroupOfEmployee = await EmployeeModel.find({
      companyId,
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

export async function addGroupOfEmployee(req: Request, res: Response) {
  const { companyId, companyName, nameOfGroup, employees } = req.body;

  try {
    // minta FE buat ngirimin employeesNamenya juga (ketimbang backend harus ngefind satu satu name dari Id)
    const newGroupOfEmployee = new GroupOfEmployeeData({
      companyId,
      companyName,
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

// nek ada yang di delete ntar masuknya juga ke
// handler editGroupOfEmployee ini
export async function editGroupOfEmployee(req: Request, res: Response) {
  const { _id, nameOfGroup, employees } = req.body;

  try {
    // minta FE buat ngirimin employeesNamenya juga (ketimbang backend harus ngefind satu satu name dari Id)
    const groupOfEmployee = await GroupOfEmployeeData.findByIdAndUpdate(
      _id,
      {
        nameOfGroup,
        employees,
      },
      { new: true }
    );
    if (!groupOfEmployee) {
      res.status(404).json({
        message: "Group of employee not found",
      });
    }
    res.status(201).json({
      message: "Group of employee successfully edited",
      payroll: groupOfEmployee,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error editing group of employee",
      error: err.message,
    });
  }
}

export async function loadGroupOfEmployee(req: Request, res: Response) {
  const { companyId } = req.body;

  try {
    const latestGroupOfEmployee = await GroupOfEmployeeData.find({
      companyId,
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
