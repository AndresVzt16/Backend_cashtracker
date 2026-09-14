import { createRequest, createResponse } from "node-mocks-http";
import Budget from "../../../models/Budget";
import { hasAccess } from "../../../middlewares/auth";
import { budgets } from "../../mocks/budget";

describe("auth-hasAccess", () => {
  it("Should hanlde error with not user to equal budget.idUser", () => {
    const req = createRequest({
      User: {
        id: "2",
      },
      budget: budgets[0],
    });
    const res = createResponse();
    const next = jest.fn();
    hasAccess(req, res, next);
    expect(res.statusCode).toBe(401)
    expect(next).not.toHaveBeenCalled()

  });
  it("Should hanlde hassAcces Budgets", () => {
    const req = createRequest({
      User: {
        id: "1",
      },
      budget: budgets[0],
    });
    const res = createResponse();
    const next = jest.fn();
    hasAccess(req, res, next);

    expect(next).toHaveBeenCalled()

  });
});
