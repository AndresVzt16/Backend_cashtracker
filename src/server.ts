import express from "express";
import morgan from "morgan";
import colors from "colors";
import { db } from "./config/db";
import budgetRouter from "./routes/budgetRoutes";
import expenseRouter from "./routes/expenseRoutes";
import authRouter from './routes/authRoutes'

//conexion a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
  } catch (error) {
    console.log(
      colors.red.bold("Error al intentar conectarse a la Base de datos"),
    );
  }
}

connectDB();

//inicializar servidor
const app = express();

app.use(morgan("dev"));

// lecturad de datos POST
app.use(express.json());

app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/budgets", expenseRouter);
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Test OK")

})


export default app;
