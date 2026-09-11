import { createRequest, createResponse } from "node-mocks-http";
import { validateExistBudget } from "../../../middlewares/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Budget", () => ({
  findByPk: jest.fn(),
}));
describe("budget - validateExistBudget", () => {
  it("Should handle not exist budget", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);
    const req = createRequest({
      params: {
        budgetId: "1",
      },
    });
    const res = createResponse();
    const next = jest.fn();

    await validateExistBudget(req, res, next);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(next).not.toHaveBeenCalled();
  });
  it("should proceed to next middleware if budget exists ", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);
    const req = createRequest({
      params: {
        budgetId: "1",
      }
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExistBudget(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.budget).toEqual(budgets[0]);
  });
  it("Should handle error with not exist budget", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      params: {
        budgetId: "1",
      }
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExistBudget(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("budget- hasAcces", () => {

});
