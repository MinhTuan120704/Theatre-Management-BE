import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import Discount from "./discount.model";
import Ticket from "./ticket.model";
import OrderProductDetails from "./orderProductDetails.model";

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
  })
  declare reservationExpiresAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
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

  // Associations
  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Discount)
  discount?: Discount;

  @HasMany(() => Ticket)
  tickets?: Ticket[];

  @HasMany(() => OrderProductDetails)
  orderProductDetails?: OrderProductDetails[];
}
