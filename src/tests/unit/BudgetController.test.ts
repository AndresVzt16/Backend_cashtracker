import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budget";
import Budget from "../../models/Budget";
import { BudgetController } from "../../controllers/BudgetControllers";

jest.mock("../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy:jest.fn()
}));
describe("BudgetController.getAll", () => {
  /* 
  beforeEach: permite ejecutar una implementacion previa al cada test
  beforeAll: permite ejecutar una implementacion previa durante todos los test
  afterAll: Ejecucion unica para todos los tests.
  afterEach: Ejecucion despues de cada test.
  */
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const listBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId,
      );
      return Promise.resolve(listBudgets);
    });
  });

  it("Should retrieve 2 budgets for user with id 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/v1/budgets",
      User: {
        id: "1",
      },
    });

    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
  });

  it("Should retrieve 1 budget for user with id 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/v1/budgets",
      User: {
        id: "2",
      },
    });

    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("Should retrive 0 budgets for user whit id 10", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/v1/budgets",
      User: {
        id: "10",
      },
    });
    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data).toHaveLength(0);
  });

  it("Should handle errors with fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/v1/budgets",
      User: {
        id: "10",
      },
    });
    const res = createResponse();
    (Budget.findAll as jest.Mock).mockRejectedValue(new Error());
    await BudgetController.getAll(req, res);
    expect(res.statusCode).toBe(500);
  });
});

describe("BudgetController.create", () => {
  it("Shuld create  a new  budget and  respond with statusCode 201", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/v1/budgets",
      User: {
        id: 1,
      },
      body: {
        name: "Pesupuesto test",
        ammount: 1000,
      },
    });
    const res = createResponse();
    await BudgetController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
  });

  it("Should  handle errors with fetching create Budgets", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/v1/budgets",
      User: {
        id: 1,
      },
      body: {
        name: "Pesupuesto test",
        ammount: 1000,
      },
    });
    const res = createResponse();
    (Budget.create as jest.Mock).mockRejectedValue(new Error());
    await BudgetController.create(req, res);
    expect(res.statusCode).toBe(500);
  });
});

describe("BudgetsController.getById", () => {
  it("Should retrive a budget by id", async () => {
    const budgetTest = budgets[0];
    const req = createRequest({
      method: "GET",
      baseUrl: `/api/v1/budget/${budgetTest.id}`,
      budget: budgetTest,
      params: {
        budgetId: budgetTest.id,
      },
    });
    const res = createResponse();
    await BudgetController.getById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual(budgetTest);
  });
});

describe("BudgetController.updateById", () => {
  it("Should update budget by id", async () => {
    const budgetTest = {
      ...budgets[0],
      update: jest.fn().mockResolvedValue(true),
    };
    const req = createRequest({
      method: "PUT",
      baseUrl: `/api/v1/budgets/${budgetTest.id}`,
      budget:budgetTest,
      params: {
        budgetId: budgetTest.id,
      },
      body: {
        name: "test",
        amount: 100,
      },
    });
    const res = createResponse();
    await BudgetController.updateById(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe("BudgetController.deleteById", () => {
  it("Should delete budget by id", async() => {
    const budgetTest = {
      ...budgets[0],
      destroy: jest.fn().mockResolvedValue(true),
    };
     const req = createRequest({
      method: "DELETE",
      baseUrl: `/api/v1/budgets/${budgetTest.id}`,
      budget:budgetTest,
      params: {
        budgetId: budgetTest.id,
      },
    });
    const res = createResponse()
    await BudgetController.deleteById(req, res)
    expect(res.statusCode).toBe(200)
  })
})