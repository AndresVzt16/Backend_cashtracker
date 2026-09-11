import { NextFunction, Request, Response } from "express";
import Budget from "../models/Budget";
interface BudgetParams {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

const validateExistBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.budgetId;

  if (Array.isArray(id)) {
    return res.status(400).json({
      error: "El ID no es válido.",
    });
  }

  try {
    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json("No se encontro el presupuesto.");
    }

    req.budget = budget;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "No se pudo realizar la busqueda." });
  }
};

export { validateExistBudget };
