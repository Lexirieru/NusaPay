import { Request, Response } from "express";
import { EmployeeModel, GroupOfEmployeeData } from "../models/employeeModel"; // Pastikan path-nya benar
import { CompanyDataModel, CompanyStatsModel } from "../models/companyModel";

// untuk form ngemasukkin companyName, nyambungin wallet dan networkchainnya setelah berhasil login pake googleoauth20
export async function addOrUpdateCompanyData(req: Request, res: Response) {
  const { companyId, companyName, walletAddress, networkChainId } = req.body;

  try {
    const companyData = await CompanyDataModel.findByIdAndUpdate(
      companyId,
      {
        companyName,
        walletAddress,
        networkChainId,
      },
      { new: true }
    );

    if (!companyData) {
      res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(201).json({
      message: "Company data successfully edited",
      payroll: companyData,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error editing company data",
      error: err.message,
    });
  }
}

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

export async function addOrUpdateCompanyStats(req: Request, res: Response) {
  const {
    companyId,
    totalPayrollExecuted,
    totalBurnExecuted,
    totalRedeemed,
    totalEmployeeRegistered,
    totalGroups,
    totalIDRXBurned,
    totalIDRXRedeemed,
    averageEmployeesPerGroup,
  } = req.body;

  try {
    // Cek apakah stats sudah ada untuk companyId tersebut
    let stats = await CompanyStatsModel.findOne({ companyId });

    if (!stats) {
      // Buat baru jika belum ada
      stats = new CompanyStatsModel({
        companyId,
        totalPayrollExecuted: totalPayrollExecuted || 0,
        totalBurnExecuted: totalBurnExecuted || 0,
        totalRedeemed: totalRedeemed || 0,
        totalEmployeeRegistered: totalEmployeeRegistered || 0,
        totalGroups: totalGroups || 0,
        totalIDRXBurned: totalIDRXBurned || 0,
        totalIDRXRedeemed: totalIDRXRedeemed || 0,
        averageEmployeesPerGroup: averageEmployeesPerGroup || 0,
      });
    } else {
      // Update data yang dikirim (jika ada)
      if (typeof totalPayrollExecuted === "number") {
        stats.totalPayrollExecuted =
          (stats.totalPayrollExecuted || 0) + totalPayrollExecuted;
      }

      if (typeof totalBurnExecuted === "number") {
        stats.totalBurnExecuted =
          (stats.totalBurnExecuted || 0) + totalBurnExecuted;
      }

      if (typeof totalRedeemed === "number") {
        stats.totalRedeemed = (stats.totalRedeemed || 0) + totalRedeemed;
      }

      if (typeof totalEmployeeRegistered === "number") {
        stats.totalEmployeeRegistered =
          (stats.totalEmployeeRegistered || 0) + totalEmployeeRegistered;
      }

      if (typeof totalGroups === "number") {
        stats.totalGroups = (stats.totalGroups || 0) + totalGroups;
      }

      if (typeof totalIDRXBurned === "number") {
        stats.totalIDRXBurned = (stats.totalIDRXBurned || 0) + totalIDRXBurned;
      }

      if (typeof totalIDRXRedeemed === "number") {
        stats.totalIDRXRedeemed =
          (stats.totalIDRXRedeemed || 0) + totalIDRXRedeemed;
      }

      if (typeof averageEmployeesPerGroup === "number") {
        stats.averageEmployeesPerGroup = averageEmployeesPerGroup;
      }
    }

    await stats.save();

    res.status(200).json({
      message: "Company stats successfully updated",
      stats,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error updating company stats",
      error: err.message,
    });
  }
}
