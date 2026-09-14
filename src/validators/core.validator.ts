import { Request } from "express";
import { param, body } from "express-validator";

export const isUiid = (req: Request, paramName: string) =>
  param(paramName)
    .isUUID()
    .withMessage(`El ${paramName} ingresado no es válido.`)
    .run(req);

export const isEmail = body("email")
  .notEmpty()
  .withMessage("El email no puede estar vacío.")
  .bail()
  .isEmail()
  .withMessage("El email ingresado no es válido.");
