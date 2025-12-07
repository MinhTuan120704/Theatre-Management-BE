import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import Cinema from "./cinema.model";

@Table({
  tableName: "employee",
  timestamps: false,
})
export default class Employee extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  })
  declare employeeId: number;

  @ForeignKey(() => Cinema)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  declare cinemaId: number | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare position: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare shift: string;
}
