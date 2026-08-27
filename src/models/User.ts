import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  HasMany,
  AllowNull,
  Unique,
  Default,
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({
  tableName: "users",
})
class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare token: string;

  @Column({
    type: DataType.DATE,
  })
  declare dateToken: Date;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirm: boolean;

  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare budgets: Budget[];

  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.token;
    delete values.dateToken;
    return values;
  }
}

export default User;
