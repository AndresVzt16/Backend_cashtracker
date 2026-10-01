import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthControllers";
import { setHooks } from "sequelize-typescript";
import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";
import User from "../../models/User";

/* Auth controllers */

describe("auth-create-account", () => {
  it("Should display validation errors when form is empty", async () => {
    const response = await request(server)
      .post("/api/v1/auth/create-account")
      .send({});
    const createAccountMock = jest.spyOn(AuthController, "createAccount");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(3);
  });
  it("Should return 400 when the email is not valid.", async () => {
    const response = await request(server)
      .post("/api/v1/auth/create-account")
      .send({
        name: "Juan",
        password: "12345678",
        email: "juansdas",
      });
    const createAccountMock = jest.spyOn(AuthController, "createAccount");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
  });
  it("Should return 400 when the password is not valid.", async () => {
    const response = await request(server)
      .post("/api/v1/auth/create-account")
      .send({
        name: "Juan",
        password: "123456",
        email: "juan@test.com",
      });
    const createAccountMock = jest.spyOn(AuthController, "createAccount");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
  });
  it("Should return 201 and create account valid.", async () => {
    const response = await request(server)
      .post("/api/v1/auth/create-account")
      .send({
        name: "Juan",
        password: "12345623",
        email: "juan1@test.com",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).not.toHaveProperty("errors");
  });
  it("Should return 409 conflict when a user is already registered.", async () => {
    const response = await request(server)
      .post("/api/v1/auth/create-account")
      .send({
        name: "Juan",
        password: "12345623",
        email: "juan1@test.com",
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).not.toHaveProperty("errors");
    expect(response.body).toHaveProperty("error");
  });
});

describe("auth-confirmAccount", () => {
  it("Sould display error if token is empty", async () => {
    const response = await request(server)
      .post("/api/v1/auth/confirm-account")
      .send({
        token: "",
      });

    expect(response.body).toHaveProperty("errors");
    expect(response.statusCode).toBe(400);
  });
  it("Sould return 409 when the token is not valid", async () => {
    const response = await request(server)
      .post("/api/v1/auth/confirm-account")
      .send({
        token: "1f574b2a-943e-4c33-be58-26735b2b9d87",
      });

    expect(response.body).not.toHaveProperty("errors");
    expect(response.body).toHaveProperty("error");
    expect(response.statusCode).toBe(409);
  });
  it("Sould confirm account with token valid", async () => {
    const token = globalThis.cashtrackerConfirmationToken;
    const response = await request(server)
      .post("/api/v1/auth/confirm-account")
      .send({
        token,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("auth-login", () => {
  it("Should display validation error when form is empty", async () => {
    const response = await request(server).post("/api/v1/auth/login").send({
      email: "",
      password: "",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should 400 bad request when the email is not valid", async () => {
    const response = await request(server).post("/api/v1/auth/login").send({
      email: "test",
      password: "123",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should 404 bad request when the user is not exists", async () => {
    const response = await request(server).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "123",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should 403 bad request when the user is not confirm", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: "122",
      confirm: false,
      password: "21312312",
      email: "test@test.com",
    });

    const response = await request(server).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "21312312",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should return 401 when the password is incorrect", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: "",
      confirm: true,
      password: "21312312",
      email: "test@test.com",
    });
    jest.spyOn(authUtils, "checkPassword").mockResolvedValue(false);

    const response = await request(server).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "21312312",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should generate JWT when crendentials is success", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: "12312314325",
      confirm: true,
      password: "21312312",
      email: "test@test.com",
    });
    jest.spyOn(authUtils, "checkPassword").mockResolvedValue(true);
    jest
      .spyOn(jwtUtils, "generateJWT")
      .mockReturnValue("dawndowidn1onwe12n31o32in2ib3reboq2danw");
    const response = await request(server).post("/api/v1/auth/login").send({
      email: "test@test.com",
      password: "21312312",
    });
    const loginMock = jest.spyOn(AuthController, "login");
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("error");
    expect(findOne).toHaveBeenCalled();
  });
});

/* Budget Controllers */
describe("budgets-getAll", () => {
  it("Should reject unauthorized access to budgets without a jwt", async () => {
    const response = await request(server)
      .get('/api/v1/budgets')


    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('error')
  });
});
