import type { Request, Response } from "express";
import Budget from "../models/Budget";
interface BudgetParams {
  id: string;
}
export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error." });
    }
  };
  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrio un error al generar el presupuesto." });
    }
  };
  static getById = async (req: Request<BudgetParams>, res: Response) => {
    res.json(req.budget);
  };
  static updateById = async (req: Request<BudgetParams>, res: Response) => {
    await req.budget.update(req.body);
    res.json("Presupuesto actualizado correctamente.");
  };
  static deleteById = async (req: Request<BudgetParams>, res: Response) => {
    await req.budget.destroy();
    res.status(200).json("El presupuesto fue eliminado exitosamente.");
  };
}
