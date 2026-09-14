import { createRequest, createResponse } from "node-mocks-http";
import User from "../../../models/User";
import { AuthController } from "../../../controllers/AuthControllers";
import { checkPassword, hashData } from "../../../utils/auth";
import { CoreHelpers } from "../../../utils/core";
import { Email } from "../../../services/Email.services";
import { generateJWT } from "../../../utils/jwt";
jest.mock("../../../models/User");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/jwt");
jest.mock("../../../utils/core");
jest.mock("../../../services/Email.services");

jest.mock("../../../services/Email.services", () => ({
  Email: {
    sendMailWelcome: jest.fn(),
  },
}));
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("AuthController-createAccount", () => {
  it("Should handle error with email already register", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);
    const req = createRequest({
      url: "api/v1/auth/create-account",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
        name: "Andres Vizuete",
      },
    });
    const res = createResponse();
    await AuthController.createAccount(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
  });
  it("Should handle on-error of server", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error());
    const req = createRequest({
      url: "api/v1/auth/create-account",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
        name: "Andres Vizuete",
      },
    });
    const res = createResponse();
    await AuthController.createAccount(req, res);
    expect(res.statusCode).toBe(500);
    expect(User.findOne).toHaveBeenCalled();
  });
  it("Should register a new User and return success status 201", async () => {
    const req = createRequest({
      url: "api/v1/auth/create-account",
      method: "POST",
      body: {
        email: "andresv0898@gmail.com",
        password: "12345678",
        name: "Andres Vizuete",
      },
    });
    const res = createResponse();
    const mockUser = {
      ...req.body,
      save: jest.fn(),
    };

    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (hashData as jest.Mock).mockResolvedValue("HashedPassword");
    (CoreHelpers.getUUID as jest.Mock).mockReturnValue("123456");
    (Email.sendMailWelcome as jest.Mock).mockResolvedValue({
      id: "test-id",
      message: "Queued",
    });
    await AuthController.createAccount(req, res);

    const data = res._getJSONData();
    console.log(data);
    expect(res.statusCode).toBe(201);
  });
});
describe("AuthController-login", () => {
  it("Should retutrn 404 error with not user exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(false);
    const req = createRequest({
      url: "api/v1/auth/login",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
      },
    });
    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
  });
  it("Should retutrn 403 if the account has  not been confirmed", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: "f80252dc-27c1-40e9-8580-0d39d01d04e3",
      email: "andresv0807@gmail.com",
      name: "Andres Vizuete",
      confirm: false,
    });
    const req = createRequest({
      url: "api/v1/auth/login",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
      },
    });
    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(403);
  });
  it("Should retutrn 401 if the password is incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: "f80252dc-27c1-40e9-8580-0d39d01d04e3",
      email: "andresv0807@gmail.com",
      password: "awdadafno2i3en2",
      confirm: true,
    });
    const req = createRequest({
      url: "api/v1/auth/login",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
      },
    });
    const res = createResponse();
    (checkPassword as jest.Mock).mockResolvedValue(false);
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
  });
  it("Should return a JWT if authentication is successfull", async () => {
    const testJWT = "ADWQD9182G41RRWBD7782GQWD98H2HQ9D";
    (User.findOne as jest.Mock).mockResolvedValue({
      id: "f80252dc-27c1-40e9-8580-0d39d01d04e3",
      email: "andresv0807@gmail.com",
      password: "awdadafno2i3en2",
      confirm: true,
    });
    const req = createRequest({
      url: "api/v1/auth/login",
      method: "POST",
      body: {
        email: "andresv0807@gmail.com",
        password: "12345678",
      },
    });
    const res = createResponse();
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(testJWT);
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(testJWT)
  });
});
