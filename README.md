# CashTracker - Backend

API REST para administración de gastos y presupuestos. Node.js + Express + TypeScript + Sequelize (PostgreSQL).

## Stack

- **Express 5** — servidor HTTP y ruteo
- **TypeScript** — tipado estático
- **Sequelize-TypeScript** — ORM sobre PostgreSQL (driver `pg`)
- **express-validator** — validación de datos de entrada
- **morgan** — logging de requests HTTP
- **colors** — output coloreado en consola
- **dotenv** — variables de entorno
- **nodemon / ts-node** — desarrollo con recarga automática
- **jest** — testing

## Arquitectura

Patrón MVC con capas de middleware para validación, separadas por recurso (`budgets`, `expenses`).

```
src/
├── index.ts              # punto de entrada, levanta el servidor
├── server.ts              # configuración de Express, conexión a BD, montaje de rutas
├── config/
│   └── db.ts               # instancia de Sequelize, carga modelos, conexión a PostgreSQL
├── models/
│   ├── Budget.ts            # modelo Presupuesto (tabla `budgets`)
│   └── Expense.ts           # modelo Gasto (tabla `expenses`)
├── controllers/
│   ├── BudgetControllers.ts # lógica CRUD de presupuestos
│   └── ExpenseControllers.ts# lógica CRUD de gastos (pendiente de implementar)
├── routes/
│   ├── budgetRoutes.ts      # define endpoints /api/v1/budgets
│   └── expenseRoutes.ts     # endpoints de gastos (pendiente de implementar)
├── middlewares/
│   ├── core.ts               # valida que un parámetro de ruta sea un UUID válido
│   ├── budget.ts              # valida que el presupuesto exista antes de operar sobre él
│   └── validation.ts          # centraliza el manejo de errores de express-validator
└── validators/
    ├── core.validator.ts      # regla de validación reutilizable para IDs (UUID)
    └── budget.validator.ts    # reglas de validación del body al crear un presupuesto
```

### Para qué se usa cada módulo

| Módulo | Uso |
|---|---|
| `index.ts` | Arranca el servidor Express en el puerto definido por `PORT` (default 4000). |
| `server.ts` | Configura la app Express: conecta a la base de datos (`connectDB`), registra `morgan` y `express.json()`, monta el router de presupuestos en `/api/v1/budgets`. |
| `config/db.ts` | Crea la instancia de Sequelize a partir de `DATABASE_URL`, apuntando al directorio de modelos para el auto-registro. |
| `models/Budget.ts` | Define la entidad Presupuesto (`id`, `name`, `amount`) y su relación `HasMany` con Expense (con cascada en update/delete). |
| `models/Expense.ts` | Define la entidad Gasto (`id`, `name`, `ammount`, `budgetId`) y su relación `BelongsTo` con Budget. |
| `controllers/BudgetControllers.ts` | Implementa las operaciones CRUD de presupuestos: `getAll`, `create`, `getById`, `updateById`, `deleteById`. |
| `controllers/ExpenseControllers.ts` | Reservado para la lógica CRUD de gastos — archivo aún vacío. |
| `routes/budgetRoutes.ts` | Declara los endpoints de presupuestos y encadena middlewares de validación antes de llegar al controller. |
| `routes/expenseRoutes.ts` | Reservado para los endpoints de gastos — archivo aún vacío. |
| `middlewares/core.ts` | `TypeIdValidation`: valida que el parámetro de ruta sea un UUID antes de continuar. |
| `middlewares/budget.ts` | `validateExistBudget`: busca el presupuesto por ID y lo adjunta a `req.budget`, o responde 404 si no existe. |
| `middlewares/validation.ts` | `hanldeValidation`: revisa el resultado de `express-validator` y corta la petición con 400 si hay errores. |
| `validators/core.validator.ts` | Regla `isUiid`: valida que el parámetro `id` sea un UUID (usada por `core.ts`). |
| `validators/budget.validator.ts` | Reglas `createBudget`: valida que `name` no esté vacío y `amount` sea numérico y mayor a 0. |

## Endpoints actuales

Base: `/api/v1/budgets`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista todos los presupuestos (orden por fecha de creación desc). |
| POST | `/` | Crea un presupuesto (valida `name` y `amount`). |
| GET | `/:budgetId` | Obtiene un presupuesto por ID (valida UUID y existencia). |
| PUT | `/:budgetId` | Actualiza un presupuesto existente. |
| DELETE | `/:budgetId` | Elimina un presupuesto existente. |

Los endpoints de gastos (`expenses`) todavía no están implementados (rutas y controller vacíos).

## Variables de entorno

- `DATABASE_URL` — cadena de conexión a PostgreSQL.
- `PORT` — puerto del servidor (default 4000).

## Scripts

- `npm run dev` — levanta el servidor en modo desarrollo (nodemon).
- `npm run build` — compila TypeScript a `dist/`.
- `npm start` — corre el build compilado.
- `npm test` — corre los tests con Jest.
