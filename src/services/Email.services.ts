import FormData from "form-data";
import Mailgun from "mailgun.js";
import { EmailDto } from "../dto/email.dto";
import User from "../models/User";

export class Email {
  private static mg = new Mailgun(FormData).client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "",
  });

  static sendMailWelcome = async (user: EmailDto) => {
    try {
      const data = await Email.mg.messages.create("codeinfinity.me", {
        from: "Cashtracker<cashtracker@codeinfinity.me>",
        to: user.email,
        subject: `Cashtracker confirmar-cuenta`,
        template: "welcome_user",
        "h:X-Mailgun-Variables": JSON.stringify({
          name: user.name,
          link: `${process.env.FRONTEND_URL}/confirm-account/${user.token}`,
          user: user.name,
        }),
      });

      return data;
    } catch (error) {
      console.error("Error enviando email:", error);
      throw error;
    }
  };
  static sendMailForgotPassword = async (user: EmailDto) => {
    try {
      const data = await Email.mg.messages.create("codeinfinity.me", {
        from: "Cashtracker<cashtracker@codeinfinity.me>",
        to: user.email,
        subject: `Cashtracker recuperar contraseña`,
        template: "forgot-password",
        "h:X-Mailgun-Variables": JSON.stringify({
          name: user.name,
          otp: user.token,
        }),
      });

      return data;
    } catch (error) {
      console.error("Error enviando email:", error);
      throw error;
    }
  };
}
