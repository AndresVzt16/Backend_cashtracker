import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const isUiid = (req: Request) =>
  param("id").isUUID().withMessage("El ID ingresado no es valido.").run(req);
