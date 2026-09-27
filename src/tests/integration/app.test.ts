import request from "supertest";
import server from "../../server";
import { AuthController } from "../../controllers/AuthControllers";

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
      .post("/api/v1/confirm-account")
      .send({ 
        token: "" 
      });
  });
});
