import { Router } from "express";
import { AuthController } from "../controllers/AuthControllers";
import {
  confirmAccount,
  createAccount,
  forgotPassword,
  login,
  resetPassword,
  validationOTP,
} from "../validators/auth.validator";
import { hanldeValidation } from "../middlewares/validation";
import { limiter } from "../config/limiter";
import { authenticate, validateTransactionJWT } from "../middlewares/auth";

const router = Router();

router.use(limiter);

router.post(
  "/create-account",
  createAccount,
  hanldeValidation,
  AuthController.createAccount,
);

router.post(
  "/confirm-account",
  confirmAccount,
  hanldeValidation,
  AuthController.confirmAccount,
);

router.post("/login", login, hanldeValidation, AuthController.login);

router.post(
  "/forgot-password",
  forgotPassword,
  hanldeValidation,
  AuthController.forgotPassword,
);

router.post(
  "/validate-otp",
  validationOTP,
  hanldeValidation,
  AuthController.validateOTP,
);

router.put(
  "/reset-password",
  resetPassword,
  hanldeValidation,
  validateTransactionJWT,
  AuthController.resetPassword,
);

router.get("/user", authenticate, AuthController.getUser);
router.put("/update-password", authenticate, AuthController.updatePassword);
router.post("/check-password", authenticate, AuthController.checkPassword);
export default router;
