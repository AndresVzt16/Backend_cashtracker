import { NextFunction, Request, Response } from "express";
import { isUiid } from "../validators/core.validator";
import { hanldeValidation } from "./validation";

const TypeIdValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await isUiid(req);
  hanldeValidation(req, res, next);
};


export {TypeIdValidation}