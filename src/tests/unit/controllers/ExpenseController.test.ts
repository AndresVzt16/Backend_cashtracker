import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { budgets } from "../../mocks/budget";
import { ExpenseController } from "../../../controllers/ExpenseControllers";
import { expenses } from "../../mocks/expenses";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
}));

describe("ExpenseControllers-create", () => {
  it("Should create a new expense", async () => {
    (Expense.create as jest.Mock).mockResolvedValue(true);
    const req = createRequest({
      method: "POST",
      url: "/api/v1/:budgetId/expenses",
      params: {
        budgetId: 1,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    await ExpenseController.create(req, res);
    expect(res.statusCode).toBe(201);
  });
  it("Should handle errors with create a new expense", async () => {
    (Expense.create as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      method: "POST",
      url: "/api/v1/budgets/:budgetId/expenses",
      params: {
        budgetId: 1,
      },
      budget: {
        id: 1,
      },
    });
    const res = createResponse();
    await ExpenseController.create(req, res);
    expect(res.statusCode).toBe(500);
  });
});
describe("ExpenseController-getById", () => {
  const expenseTest = budgets[0].expenses[0];
  it("Should return expense by id", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/v1/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });
    const res = createResponse();
    await ExpenseController.getById(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenseTest);
  });
});

describe("ExpenseController-updateById", () => {
  const expenseMock = {
    update: jest.fn(),
  };
  it("Should update expense", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/v1/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: {
        id: 1,
        name: "Limosina",
        amount: 500,
        budgetId: 1,
        createdAt: "2030-06-17T17:20:57.138Z",
        updatedAt: "2030-06-17T17:20:57.138Z",
      },
    });
    const res = createResponse();
    await ExpenseController.updateById(req, res);
    expect(res.statusCode).toBe(200);
    expect(req.expense.update).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpenseController-deleteById", () => {
  const expenseMock = {
    destroy: jest.fn(),
  };
  it("Should delete expense", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/v1/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    });
    const res = createResponse();
    await ExpenseController.deleteById(req, res);
    expect(res.statusCode).toBe(200);
    expect(req.expense.destroy).toHaveBeenCalled();
  });
});
