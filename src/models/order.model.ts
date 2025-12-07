import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import Discount from "./discount.model";

@Table({
  tableName: "order",
  timestamps: true,
})
export default class Order extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare userId: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare totalPrice: number;

  @Column({
    type: DataType.ENUM("credit_card", "paypal", "cash"),
    allowNull: false,
  })
  declare paymentMethod: "credit_card" | "paypal" | "cash";

  @Column({
    type: DataType.ENUM("pending", "completed", "failed", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  })
  declare status: "pending" | "completed" | "failed" | "cancelled";

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  declare paidAt: Date;

  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  declare discountId: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare orderedAt: Date;
}
