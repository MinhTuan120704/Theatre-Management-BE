import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "discount",
  timestamps: true,
})
export default class Discount extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.ENUM("percentage", "fixed"),
    allowNull: false,
  })
  declare discountType: "percentage" | "fixed";

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare value: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  declare maxUsage: number | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare minPurchase: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiryDate: Date;
}
