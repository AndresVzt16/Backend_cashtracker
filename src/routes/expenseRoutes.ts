import { Router } from "express";
import { BudgetController } from "../controllers/BudgetControllers";
import { hanldeValidation } from "../middlewares/validation";
import { createBudget } from "../validators/budget.validator";
import { validateExistBudget } from "../middlewares/budget";
import { TypeIdValidation } from "../middlewares/core";
import { ExpenseController } from "../controllers/ExpenseControllers";
const router = Router();

router.param("budgetId", TypeIdValidation);
router.param("budgetId", validateExistBudget);
router.param("expenseId", TypeIdValidation);
router.param("expenseId", validateExistBudget);

router
  .route("/:bugetId/expenses")
  .get(ExpenseController.getAll)
  .post(createBudget, hanldeValidation, ExpenseController.create);

router
  .route("/:budgetId/expenses/:expenseId")
  .get(ExpenseController.getById)
  .put(ExpenseController.updateById)
  .delete(ExpenseController.deleteById);

export default router;
