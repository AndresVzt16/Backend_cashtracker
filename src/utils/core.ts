import { randomUUID, randomInt } from "crypto";

export class CoreHelpers {
  static getUUID = (): string => {
    return randomUUID();
  };
  static getOTP = (): string => {
    return randomInt(100000, 1000000).toString();
  };
}
