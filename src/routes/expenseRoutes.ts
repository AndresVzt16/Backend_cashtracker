import { Router } from "express";
import { BudgetController } from "../controllers/BudgetControllers";
import { hanldeValidation } from "../middlewares/validation";
import { createBudget } from "../validators/budget.validator";
import { validateExistBudget } from "../middlewares/budget";
import { TypeIdValidation } from "../middlewares/core";
import { ExpenseController } from "../controllers/ExpenseControllers";
import { validateExistExpense } from "../middlewares/expense";
import { createExpensive } from "../validators/expense.validator";
import { authenticate, hasAccess } from "../middlewares/auth";
const router = Router();

router.use(authenticate);

router.param("budgetId", TypeIdValidation);
router.param("budgetId", validateExistBudget);
router.param("budgetId", hasAccess);
router.param("expenseId", TypeIdValidation);
router.param("expenseId", validateExistExpense);


router
  .route("/:budgetId/expenses")
  .get(ExpenseController.getAll)
  .post(createExpensive, hanldeValidation, ExpenseController.create);

router
  .route("/:budgetId/expenses/:expenseId")
  .get(ExpenseController.getById)
  .put(ExpenseController.updateById)
  .delete(ExpenseController.deleteById);

export default router;
