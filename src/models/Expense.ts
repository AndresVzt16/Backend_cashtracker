import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({
  tableName: "expenses",
})
class Expense extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({type: DataType.STRING})
  declare name: string

  @Column({type:DataType.DECIMAL})
  declare ammount:number

  @ForeignKey(() => Budget)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare budgetId: string;

  @BelongsTo(() => Budget)
  declare budget:Budget

}

export default Expense