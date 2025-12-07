import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Order from "./order.model";
import ShowTime from "./showTime.model";
import Seat from "./seat.model";

@Table({
  tableName: "ticket",
  timestamps: true,
})
export default class Ticket extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare orderId: number;

  @ForeignKey(() => ShowTime)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare showtimeId: number;

  @ForeignKey(() => Seat)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare seatId: number;
}
