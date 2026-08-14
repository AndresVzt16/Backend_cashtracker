import { Router } from "express";
import { BudgetController } from "../controllers/BudgetControllers";
import { hanldeValidation } from "../middlewares/validation";
import { createBudget } from "../validators/budget.validator";
import { validateExistBudget } from "../middlewares/budget";
import { TypeIdValidation } from "../middlewares/core";
const router = Router();

router.param("budgetId", TypeIdValidation);
router.param("budgetId", validateExistBudget);

router
  .route("/")
  .get(BudgetController.getAll)
  .post(createBudget, hanldeValidation, BudgetController.create);

router
  .route("/:budgetId")
  .get(BudgetController.getById)
  .put(BudgetController.updateById)
  .delete(BudgetController.deleteById);



export default router;
