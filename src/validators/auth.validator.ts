import { body } from "express-validator";
import { NotEmpty } from "sequelize-typescript";
import { isEmail } from "./core.validator";

export const createAccount = [
  body("name").notEmpty().withMessage("El nombre no puede estar vacio.").bail(),
  isEmail,
  body("password")
    .notEmpty()
    .withMessage("El password no puede estar vacio.")
    .bail()
    .isLength({
      min: 6,
      max: 40,
    }),
];

export const confirmAccount = [
  body("token")
    .notEmpty()
    .withMessage("Token no valido.")
    .bail()
    .isUUID()
    .withMessage("Token no valido."),
];

export const login = [
  isEmail,
  body("password").notEmpty().withMessage("El password no puede ir vacio."),
];

export const forgotPassword = [isEmail];

export const validationOTP = [
  body("otp")
    .notEmpty()
    .withMessage("El codigo no puede ir vacio")
    .bail()
    .isNumeric()
    .withMessage("El codigo no es valido"),
];

export const resetPassword = [
  body("password")
    .notEmpty()
    .withMessage("El password no puede ir vacio")
    .bail(),
];
