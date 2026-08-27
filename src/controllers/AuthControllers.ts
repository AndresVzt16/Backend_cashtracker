import { Request, Response } from "express";
import User from "../models/User";
import { CoreHelpers } from "../utils/core";
import { checkOTP, checkPassword, hashData } from "../utils/auth";
import { Email } from "../services/Email.services";
import { generateJWT, generateTransactionalJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        const error = new Error(
          "Ya existe una cuenta asociada al correo ingresado.",
        );
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);
      user.password = await hashData(password);
      user.token = CoreHelpers.getUUID();
      (await user.save()) && (await Email.sendMailWelcome(user));

      res.status(201).json("Usuario creado exitosamente.");
    } catch (error) {
      console.log(error);
      const e = new Error("Hubo un error al crear el usuario.");
      return res.status(409).json({ error: e.message });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("Token no valido");
        return res.status(401).json({ error: error.message });
      }
      user.confirm = true;
      user.token = null;
      await user.save();
      res.json("Cuenta confirmada correctamente");
    } catch (error) {
      const e = new Error("Token no valido");
      return res.status(401).json({ error: e.message });
    }
  };
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("Las credenciales ingresadas no son validas.");
        return res.status(409).json({ error: error.message });
      }

      if (!user.confirm) {
        const error = new Error("Las credenciales ingresadas no son validas.");
        return res.status(403).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Las credenciales ingresadas no son validas.");
        return res.status(403).json({ error: error.message });
      }
      const token = generateJWT(user.id);
      res.json(token);
    } catch (error) {
      console.log(error);
      const e = new Error("Hubo un error al realizar la autenticación.");
      return res.status(409).json({ error: e.message });
    }
  };
  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("Las credenciales ingresadas no son validas.");
        return res.status(409).json({ error: error.message });
      }

      if (!user.confirm) {
        const error = new Error("Las credenciales ingresadas no son validas.");
        return res.status(403).json({ error: error.message });
      }
      user.token = CoreHelpers.getOTP();
      user.dateToken = new Date();
      await user.save();
      await Email.sendMailForgotPassword(user);
      res.json("El codigo de recuperacion fue enviado al correo.");
    } catch (error) {
      console.log(error);
      const e = new Error("Hubo un error al realizar la autenticación.");
      return res.status(409).json({ error: e.message });
    }
  };
  static validateOTP = async (req: Request, res: Response) => {
    const token = req.body.otp;
    try {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("El código ingresado no es válido.");
        return res.status(404).json({ error: error.message });
      }
      const isValidOTP = await checkOTP(10, user.dateToken);
      if (!isValidOTP) {
        const error = new Error("El código ingresado no es válido.");
        return res.status(409).json({ error: error.message });
      }
      const transactionToken = generateTransactionalJWT(user.id);
      user.token = transactionToken;
      user.dateToken = null;
      await user.save();
      res.json(transactionToken);
    } catch (error) {
      const e = new Error("Error al generar la transacción.");
      return res.status(404).json({ error: e.message });
    }
  };
  static resetPassword = async (req: Request, res: Response) => {
    const user = req.User;
    const { password } = req.body;
    try {
      user.password = await hashData(password);
      user.token = null;
      await user.save();
      res.json("Contraseña actualizada correctamente.");
    } catch (error) {
      const e = new Error("Hubo un error al realizar la transacción.");
      return res.status(500).json({ error: e.message });
    }
  };
  static getUser = async (req: Request, res: Response) => {
    res.json(req.User);
  };
  static updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.User;
    try {
      const user = await User.findByPk(id);
      const isPasswordCorrect = await checkPassword(oldPassword, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("No autorizado.");
        return res.status(401).json({ error: error.message });
      }
      user.password = await hashData(newPassword);
      await user.save();
      res.json("Se actualizaron correctamente los datos.");
    } catch (error) {
      const e = new Error("Error al actualizar el password.");
      res.status(500).json({ error: e.message });
    }
  };
  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.User;
    try {
      const user = await User.findByPk(id);
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("No autorizado.");
        return res.status(401).json({ error: error.message });
      }
      
      
      res.json("Password correcto.");
    } catch (error) {
      const e = new Error("Error al actualizar el password.");
      res.status(500).json({ error: e.message });
    }
  };
}
