import type { Request, Response } from "express";
import Expense from "../models/Expense";
import { CreatedAt } from "sequelize-typescript";
import { CreateExpenseDto } from "../dto/expense.dto";
import Budget from "../models/Budget";


export class ExpenseController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budget = await Budget.findByPk(req.budget.id, {
        include: [Expense],
      });

      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error." });
    }
  };
  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create({
        ...req.body,
        budgetId: req.budget.id,
      });

      res.status(201).json("El gasto se creó correctamente.");
    } catch (error) {
      const e = new Error("Ocurrio un error al crear el gasto.");
      res.status(500).json({ error: e.message });
    }
  };
  static getById = async (req: Request, res: Response) => {
    res.json(req.expense);
  };
  static updateById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.json("Gasto actualizado correctamente.");
  };
  static deleteById = async (req: Request, res: Response) => {
    await req.expense.destroy();
    res.json("Gasto eliminado correctamente.");
  };
}
