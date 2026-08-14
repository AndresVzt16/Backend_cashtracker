import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const createExpensive = [
  body("name").notEmpty().withMessage("El nombre no puede estar vacio."),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede ir vacia.")
    .isNumeric()
    .withMessage("La cantidad no es valida.")
    .custom((amount) => amount > 0)
    .withMessage("La cantidad debe ser mayor a 0."),
];

