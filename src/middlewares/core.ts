import { NextFunction, Request, Response } from "express";
import { isUiid } from "../validators/core.validator";
import { hanldeValidation } from "./validation";

const TypeIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: string,
  name: string,
) => {
  await isUiid(req, name);
  hanldeValidation(req, res, next);
};


export {TypeIdValidation}