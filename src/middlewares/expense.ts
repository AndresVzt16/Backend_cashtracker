import Expense from "../models/Expense";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

const validateExistExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.expenseId;

  if (Array.isArray(id)) {
    return res.status(400).json({
      error: "El ID no es válido.",
    });
  }

  try {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      const error = new Error("No se pudo encontrar el gasto.");
      return res.status(404).json({ error: error.message });
    }
    if (expense.budgetId !== req.budget.id) {
      const error = new Error("No se puede realizar esta accion.");
      return res.status(401).json({ error: error.message });
    }
    req.expense = expense;
    next();
  } catch (error) {
    const e = new Error("No se pudo realizar la acción.");
    return res.status(500).json({ error: e.message });
  }
};

export { validateExistExpense };
