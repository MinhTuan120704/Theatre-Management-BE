import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import Order from "./order.model";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare passwordHash: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dob: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  declare identifyCode: string;

  @Column({
    type: DataType.ENUM("customer", "admin", "employee"),
    allowNull: false,
    defaultValue: "customer",
  })
  declare role: "customer" | "admin" | "employee";

  // Associations
  @HasMany(() => Order)
  orders?: Order[];
}
