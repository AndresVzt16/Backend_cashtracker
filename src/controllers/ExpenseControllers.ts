import type { Request, Response } from "express";
import Expense from "../models/Expense";
import { CreatedAt } from "sequelize-typescript";

interface ExpenseParams {
  id: string;
}

export class ExpenseController {
  static getAll = async(req: Request, res: Response) => {
    try {
        const expensives = await Expense.findAll({
            order:[["createdAt", "DESC"]]
        })
        res.json(expensives)
    } catch (error) {
         res.status(500).json({ error: "Hubo un error." })
    }
  };
  static create = async (req: Request, res: Response) => {};
  static getById = async (req: Request<ExpenseParams>, res: Response) => {};
  static updateById = async (req: Request<ExpenseParams>, res: Response) => {};
  static deleteById = async (req: Request<ExpenseParams>, res: Response) => {};
}
