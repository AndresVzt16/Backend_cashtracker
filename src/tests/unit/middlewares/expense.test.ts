import { createRequest, createResponse } from "node-mocks-http";
import { validateExistExpense } from "../../../middlewares/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { budgets } from "../../mocks/budget";
import { hasAccess } from "../../../middlewares/auth";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));
describe("expense-validateExistExpense", () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter((e) => e.id === id)[0] ?? null;
      return Promise.resolve(expense);
    });
  });
  it("Should handle a non-existent expense", async () => {
    const req = createRequest({
      params: {
        expenseId: 120,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExistExpense(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(next).not.toHaveBeenCalled();
  });
  it("Should call next middleware if expense exists", async () => {
    const req = createRequest({
      params: {
        expenseId: 1,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExistExpense(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalled();
  });
  it("Should handle error on server", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      params: {
        expenseId: 1,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    await validateExistExpense(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(next).not.toHaveBeenCalled();
  });

  it("Should prevent unauthorized users from adding expenses", async () => {
    const req = createRequest({
      method: "POST",
      url: "api/v1/budgets/:budgetId/expenses",
      User: {
        id: "20",
      },
      budget: budgets[0],
      body: {
        name: "Expense test",
        ammount: 200,
      },
    });
    const res = createResponse();
    const next = jest.fn();
    hasAccess(req, res, next)
    const data = res._getJSONData()
    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
  });
});
